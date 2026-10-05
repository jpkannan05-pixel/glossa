import dotenv from 'dotenv';
dotenv.config();

export interface AIChatResponse {
  sanskrit: string;
  translation: string;
  explanation: string;
  grammar_correction?: {
    user_wrote: string;
    better_version: string;
    why: string;
    grammar_concept: string;
  };
}

export class GeminiAIService {
  private static apiKey = process.env.GEMINI_API_KEY || '';

  public static async generateTutorResponse(
    mode: string,
    userMessage: string,
    explanationLang: string = 'English'
  ): Promise<AIChatResponse> {
    if (this.apiKey) {
      try {
        const response = await this.callGeminiAPI(mode, userMessage, explanationLang);
        if (response) return response;
      } catch (err) {
        console.warn('[GeminiAIService] Gemini API error, falling back to intelligent rule-based engine:', err);
      }
    }

    // Contextual Intelligent Fallback Engine
    return this.generateFallbackResponse(mode, userMessage, explanationLang);
  }

  private static async callGeminiAPI(
    mode: string,
    userMessage: string,
    explanationLang: string
  ): Promise<AIChatResponse | null> {
    const prompt = `
You are GLOSSA, an expert AI Sanskrit Tutor. 
Mode: ${mode}
Explanation Language: ${explanationLang}
Learner Message: "${userMessage}"

Respond strictly as JSON with this schema:
{
  "sanskrit": "Sanskrit sentence or phrase (Devanagari)",
  "translation": "Translation into ${explanationLang}",
  "explanation": "Detailed explanation tailored to mode ${mode}",
  "grammar_correction": null or {
    "user_wrote": "Learner's exact phrase if flawed",
    "better_version": "Corrected Sanskrit phrase",
    "why": "Detailed grammatical justification",
    "grammar_concept": "Grammar concept name (e.g. Case endings, Verb conjugation)"
  }
}
Do NOT include markdown backticks like \`\`\`json. Return pure JSON string only.
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return JSON.parse(text);
  }

  private static generateFallbackResponse(
    mode: string,
    userMessage: string,
    explanationLang: string
  ): AIChatResponse {
    const lower = userMessage.toLowerCase();
    const isTamil = explanationLang.toLowerCase() === 'tamil';

    if (lower.includes('namaste') || lower.includes('hello') || lower.includes('नमस्ते') || lower.includes('hi')) {
      return {
        sanskrit: 'नमस्ते! भवतः/भवत्याः स्वागतम् अस्ति।',
        translation: isTamil ? 'வணக்கம்! உங்களை அன்போடு வரவேற்கிறோம்.' : 'Namaste! You are warmly welcomed to GLOSSA.',
        explanation: 'Standard polite Sanskrit greeting. "भवतः" is masculine polite "your", "भवत्याः" is feminine.',
      };
    }

    if (lower.includes('name') || lower.includes('नाम')) {
      return {
        sanskrit: 'मम नाम ग्लॉसा (GLOSSA) अस्ति। भवतः नाम किम्?',
        translation: isTamil ? 'என் பெயர் க்ளோஸா. உங்கள் பெயர் என்ன?' : 'My name is GLOSSA. What is your name?',
        explanation: '"मम" (Mama) means "My", "नाम" (Nāma) means "Name", "अस्ति" (Asti) means "Is".',
      };
    }

    if (lower.includes('case') || lower.includes('vibhakti') || lower.includes('विभक्ति')) {
      return {
        sanskrit: 'संस्कृतव्याकरणे अष्टौ विभक्तयः सन्ति।',
        translation: isTamil ? 'சமஸ்கிருத இலக்கணத்தில் 8 விபக்திகள் உள்ளன.' : 'There are eight cases (Vibhakti) in Sanskrit grammar.',
        explanation: 'Prathamā (Subject), Dvitīyā (Object), Tṛtīyā (Instrumental), Caturthī (Dative), Pañcamī (Ablative), Ṣaṣṭhī (Genitive), Saptamī (Locative), and Sambodhana (Vocative).',
      };
    }

    // Default tutoring response
    return {
      sanskrit: 'अस्तु, संस्कृतशिक्षणं निरन्तरं कुर्मः।',
      translation: isTamil ? 'சரி, நமது சமஸ்கிருத கற்றலைத் தொடர்வோம்.' : 'Alright, let us continue our Sanskrit learning step by step!',
      explanation: `Mode: ${mode}. In Sanskrit, precision in case endings and verb forms creates elegant clarity. Feel free to ask about grammar rules, vocabulary, or sentence constructions!`,
    };
  }
}
