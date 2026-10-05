export interface WordAnalysis {
  word: string;
  lemma: string;
  pos: 'Subanta (Noun/Pronoun)' | 'Tinganta (Verb)' | 'Avyaya (Indeclinable)' | 'Viśeṣaṇa (Adjective)';
  gender?: 'Masculine (पुंल्लिङ्गम्)' | 'Feminine (स्त्रीलिङ्गम्)' | 'Neuter (नपुंसकलिङ्गम्)' | 'N/A';
  number?: 'Singular (एकवचनम्)' | 'Dual (द्विवचनम्)' | 'Plural (बहुवचनम्)' | 'N/A';
  caseOrTense?: string;
  dhatuOrPratipadika: string;
  morphology: string;
  confidence: 'High' | 'Medium' | 'Low (Heuristic)';
  explanation: string;
}

export interface DependencyNode {
  id: number;
  word: string;
  pos: string;
  role: string; // Kartā, Karma, Karaṇa, Kriyā, etc.
  parent: number | null; // ID of governing word (e.g., Kriyā)
  relation: string;
}

export interface SentenceAnalysis {
  sentence: string;
  tokens: string[];
  words: WordAnalysis[];
  syntaxTree: DependencyNode[];
  subject: string;
  object: string;
  verb: string;
  translation: string;
  pipelineSteps: {
    step: string;
    title: string;
    output: string;
  }[];
}

// Built-in Sanskrit Morphological Dictionary & Rule Engine
const dictionary: Record<string, Partial<WordAnalysis>> = {
  // Nouns & Pronouns
  'अहम्': { lemma: 'अस्मद्', pos: 'Subanta (Noun/Pronoun)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'अस्मद्', morphology: 'अस्मद् + सु (1st person singular)', confidence: 'High', explanation: 'First person pronoun "I" in Nominative singular.' },
  'त्वम्': { lemma: 'युष्मद्', pos: 'Subanta (Noun/Pronoun)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'युष्मद्', morphology: 'युष्मद् + सु (2nd person singular)', confidence: 'High', explanation: 'Second person pronoun "You" in Nominative singular.' },
  'सः': { lemma: 'तद्', pos: 'Subanta (Noun/Pronoun)', gender: 'Masculine (पुंल्लिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'तद्', morphology: 'तद् + सु (Masculine singular)', confidence: 'High', explanation: 'Third person masculine pronoun "He".' },
  'सा': { lemma: 'तद्', pos: 'Subanta (Noun/Pronoun)', gender: 'Feminine (स्त्रीलिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'तद्', morphology: 'तद् + सु (Feminine singular)', confidence: 'High', explanation: 'Third person feminine pronoun "She".' },
  'बालकः': { lemma: 'बालक', pos: 'Subanta (Noun/Pronoun)', gender: 'Masculine (पुंल्लिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'बालक', morphology: 'बालक + सु (a-kāra masculine nominative)', confidence: 'High', explanation: 'Nominative singular of "Boy".' },
  'बालिका': { lemma: 'बालिका', pos: 'Subanta (Noun/Pronoun)', gender: 'Feminine (स्त्रीलिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative - Subject)', dhatuOrPratipadika: 'बालिका', morphology: 'बालिका + सु (ā-kāra feminine nominative)', confidence: 'High', explanation: 'Nominative singular of "Girl".' },
  'जलम्': { lemma: 'जल', pos: 'Subanta (Noun/Pronoun)', gender: 'Neuter (नपुंसकलिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Dvitīyā (Accusative - Object) / Prathamā', dhatuOrPratipadika: 'जल', morphology: 'जल + अम् (Neuter accusative)', confidence: 'High', explanation: 'Direct object form of "Water".' },
  'भोजनम्': { lemma: 'भोजन', pos: 'Subanta (Noun/Pronoun)', gender: 'Neuter (नपुंसकलिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Dvitīyā (Accusative - Object) / Prathamā', dhatuOrPratipadika: 'भोजन', morphology: 'भोजन + अम्', confidence: 'High', explanation: 'Direct object form of "Food".' },
  'गृहम्': { lemma: 'गृह', pos: 'Subanta (Noun/Pronoun)', gender: 'Neuter (नपुंसकलिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Dvitīyā / Prathamā', dhatuOrPratipadika: 'गृह', morphology: 'गृह + अम्', confidence: 'High', explanation: 'Noun "House/Home".' },
  'विद्यालयः': { lemma: 'विद्यालय', pos: 'Subanta (Noun/Pronoun)', gender: 'Masculine (पुंल्लिङ्गम्)', number: 'Singular (एकवचनम्)', caseOrTense: 'Prathamā (Nominative)', dhatuOrPratipadika: 'विद्या + आलय', morphology: 'विद्या (knowledge) + आलय (abode) + सु', confidence: 'High', explanation: 'Compound noun (Tatpuruṣa) meaning "School".' },
  
  // Verbs
  'पठति': { lemma: 'पठ्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 3rd Person (प्रथमपुरुषः)', dhatuOrPratipadika: 'पठ् (To read/study)', morphology: 'पठ् + शप् + ति', confidence: 'High', explanation: 'Conjugated verb form meaning "reads".' },
  'पठामि': { lemma: 'पठ्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 1st Person (उत्तमपुरुषः)', dhatuOrPratipadika: 'पठ् (To read/study)', morphology: 'पठ् + शप् + मि', confidence: 'High', explanation: 'Conjugated verb form meaning "I read".' },
  'पिबति': { lemma: 'पा/पिब्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 3rd Person (प्रथमपुरुषः)', dhatuOrPratipadika: 'पा (To drink)', morphology: 'पिब् + शप् + ति', confidence: 'High', explanation: 'Conjugated verb form meaning "drinks".' },
  'पिबामि': { lemma: 'पा/पिब्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 1st Person (उत्तमपुरुषः)', dhatuOrPratipadika: 'पा (To drink)', morphology: 'पिब् + शप् + मि', confidence: 'High', explanation: 'Conjugated verb form meaning "I drink".' },
  'गच्छति': { lemma: 'गम्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 3rd Person (प्रथमपुरुषः)', dhatuOrPratipadika: 'गम् (To go)', morphology: 'गच्छ् + शप् + ति', confidence: 'High', explanation: 'Conjugated verb form meaning "goes".' },
  'करोति': { lemma: 'कृ', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 3rd Person (प्रथमपुरुषः)', dhatuOrPratipadika: 'कृ (To do/make)', morphology: 'कृ + उ + ति', confidence: 'High', explanation: 'Conjugated verb form meaning "does/makes".' },
  'अस्ति': { lemma: 'अस्', pos: 'Tinganta (Verb)', gender: 'N/A', number: 'Singular (एकवचनम्)', caseOrTense: 'Present Tense (लट् लकारः) - 3rd Person (प्रथमपुरुषः)', dhatuOrPratipadika: 'अस् (To be)', morphology: 'अस् + ति', confidence: 'High', explanation: 'Existential verb meaning "is".' },
  
  // Avyaya
  'कुत्र': { lemma: 'कुत्र', pos: 'Avyaya (Indeclinable)', gender: 'N/A', number: 'N/A', caseOrTense: 'Adverb of place', dhatuOrPratipadika: 'किम् + त्र', morphology: 'किम् + त्रल् pratyaya', confidence: 'High', explanation: 'Indeclinable interrogative adverb "Where".' },
  'अत्र': { lemma: 'अत्र', pos: 'Avyaya (Indeclinable)', gender: 'N/A', number: 'N/A', caseOrTense: 'Adverb of place', dhatuOrPratipadika: 'इदम् + त्र', morphology: 'इदम् + त्रल्', confidence: 'High', explanation: 'Indeclinable adverb "Here".' },
  'तत्र': { lemma: 'तत्र', pos: 'Avyaya (Indeclinable)', gender: 'N/A', number: 'N/A', caseOrTense: 'Adverb of place', dhatuOrPratipadika: 'तद् + त्र', morphology: 'तद् + त्रल्', confidence: 'High', explanation: 'Indeclinable adverb "There".' },
};

export class SanskritNLP {
  public static analyzeWord(rawWord: string): WordAnalysis {
    const cleanWord = rawWord.trim().replace(/[|।!?,]/g, '');
    
    if (dictionary[cleanWord]) {
      const entry = dictionary[cleanWord];
      return {
        word: cleanWord,
        lemma: entry.lemma || cleanWord,
        pos: entry.pos || 'Subanta (Noun/Pronoun)',
        gender: entry.gender || 'N/A',
        number: entry.number || 'Singular (एकवचनम्)',
        caseOrTense: entry.caseOrTense || 'Prathamā',
        dhatuOrPratipadika: entry.dhatuOrPratipadika || cleanWord,
        morphology: entry.morphology || `${cleanWord} base`,
        confidence: entry.confidence || 'High',
        explanation: entry.explanation || 'Morphological breakdown from lexicon.',
      };
    }

    // Morphological Fallback Rules (Heuristics)
    if (cleanWord.endsWith('ति') || cleanWord.endsWith('ामि') || cleanWord.endsWith('न्ति')) {
      return {
        word: cleanWord,
        lemma: cleanWord.replace(/(ति|ामि|न्ति)$/, ''),
        pos: 'Tinganta (Verb)',
        gender: 'N/A',
        number: cleanWord.endsWith('न्ति') ? 'Plural (बहुवचनम्)' : 'Singular (एकवचनम्)',
        caseOrTense: cleanWord.endsWith('ामि') ? 'Present Tense (लट् लकारः) - 1st Person' : 'Present Tense (लट् लकारः) - 3rd Person',
        dhatuOrPratipadika: cleanWord.replace(/(ति|ामि|न्ति)$/, '') + ' (Root)',
        morphology: `${cleanWord.replace(/(ति|ामि|न्ति)$/, '')} + verb suffix`,
        confidence: 'Medium',
        explanation: `Inferred verb conjugation based on ending suffix.`,
      };
    }

    if (cleanWord.endsWith('ः')) {
      return {
        word: cleanWord,
        lemma: cleanWord.slice(0, -1),
        pos: 'Subanta (Noun/Pronoun)',
        gender: 'Masculine (पुंल्लिङ्गम्)',
        number: 'Singular (एकवचनम्)',
        caseOrTense: 'Prathamā (Nominative - Subject)',
        dhatuOrPratipadika: cleanWord.slice(0, -1),
        morphology: `${cleanWord.slice(0, -1)} + Visarga (सु)`,
        confidence: 'Medium',
        explanation: 'Inferred masculine singular noun ending in Visarga (ः).',
      };
    }

    if (cleanWord.endsWith('म्')) {
      return {
        word: cleanWord,
        lemma: cleanWord.slice(0, -1),
        pos: 'Subanta (Noun/Pronoun)',
        gender: 'Neuter (नपुंसकलिङ्गम्)',
        number: 'Singular (एकवचनम्)',
        caseOrTense: 'Dvitīyā (Accusative - Object)',
        dhatuOrPratipadika: cleanWord.slice(0, -1),
        morphology: `${cleanWord.slice(0, -1)} + Anusvāra/Makāra (अम्)`,
        confidence: 'Medium',
        explanation: 'Inferred accusative direct object or neuter noun ending in -म्.',
      };
    }

    return {
      word: cleanWord,
      lemma: cleanWord,
      pos: 'Subanta (Noun/Pronoun)',
      gender: 'N/A',
      number: 'Singular (एकवचनम्)',
      caseOrTense: 'Uncertain',
      dhatuOrPratipadika: cleanWord,
      morphology: `${cleanWord} (Unanalyzed)`,
      confidence: 'Low (Heuristic)',
      explanation: 'Word form not in static lexicon; analyzed via general Sanskrit morphosyntactic patterns.',
    };
  }

  public static analyzeSentence(sentence: string): SentenceAnalysis {
    const tokens = sentence.trim().split(/\s+/).map(t => t.replace(/[|।!?,]/g, '')).filter(Boolean);
    const wordAnalyses = tokens.map(t => this.analyzeWord(t));

    let subject = 'Unspecified';
    let object = 'Unspecified';
    let verb = 'Unspecified';

    const syntaxTree: DependencyNode[] = [];
    let verbNodeId: number | null = null;

    // Find verb first
    wordAnalyses.forEach((w, idx) => {
      if (w.pos === 'Tinganta (Verb)') {
        verb = w.word;
        verbNodeId = idx + 1;
      }
    });

    wordAnalyses.forEach((w, idx) => {
      const id = idx + 1;
      let role = 'Other';
      let parent: number | null = verbNodeId;
      let relation = 'dep';

      if (w.pos === 'Tinganta (Verb)') {
        role = 'Kriyā (Action Verb)';
        parent = null;
        relation = 'ROOT';
      } else if (w.caseOrTense?.includes('Prathamā') || w.word === 'अहम्' || w.word === 'बालकः' || w.word === 'सः') {
        role = 'Kartā (Subject)';
        subject = w.word;
        relation = 'k1 (Kartā)';
      } else if (w.caseOrTense?.includes('Dvitīyā') || w.word === 'जलम्' || w.word === 'भोजनम्' || w.word === 'गृहम्') {
        role = 'Karma (Object)';
        object = w.word;
        relation = 'k2 (Karma)';
      } else if (w.pos === 'Avyaya (Indeclinable)') {
        role = 'Kriyāviśeṣaṇa (Adverb)';
        relation = 'adv';
      }

      syntaxTree.push({
        id,
        word: w.word,
        pos: w.pos,
        role,
        parent,
        relation,
      });
    });

    // Translation heuristics
    let translation = 'Sanskrit sentence structure analysis';
    if (subject === 'बालकः' && object === 'जलम्' && verb === 'पिबति') {
      translation = 'The boy is drinking water.';
    } else if (subject === 'अहम्' && verb === 'पठामि') {
      translation = 'I am reading / studying.';
    } else if (subject === 'अहम्' && object === 'जलम्' && verb === 'पिबामि') {
      translation = 'I am drinking water.';
    } else {
      translation = `${subject !== 'Unspecified' ? subject : ''} ${object !== 'Unspecified' ? object : ''} ${verb !== 'Unspecified' ? verb : ''}`.trim() || sentence;
    }

    const pipelineSteps = [
      { step: '1. Tokenization', title: 'Lexical Segmentation', output: JSON.stringify(tokens) },
      { step: '2. Morphological Analysis', title: 'Stem & Inflection Identification', output: wordAnalyses.map(w => `${w.word} ➔ [Prātipadika/Dhātu: ${w.dhatuOrPratipadika}] (${w.morphology})`).join(' | ') },
      { step: '3. POS Tagging', title: 'Syntactic Categorization', output: wordAnalyses.map(w => `${w.word}: ${w.pos}`).join(' | ') },
      { step: '4. Kāraka Dependency Parsing', title: 'Syntactic Role Binding', output: syntaxTree.map(n => `${n.word} (${n.role}) ➔ ${n.parent ? `Node #${n.parent}` : 'ROOT'}`).join(' | ') },
      { step: '5. Semantic Interpretation', title: 'Literal & Structural Translation', output: `Subject: ${subject} | Object: ${object} | Verb: ${verb} ➔ "${translation}"` },
    ];

    return {
      sentence,
      tokens,
      words: wordAnalyses,
      syntaxTree,
      subject,
      object,
      verb,
      translation,
      pipelineSteps,
    };
  }
}
