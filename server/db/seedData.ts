import { dbInstance } from './database.js';

export function seedInitialData() {
  const db = dbInstance.getDB;

  // 1. Seed Concepts if empty
  if (db.concepts.length === 0) {
    db.concepts.push(
      { id: 1, name: 'Case endings', category: 'Grammar' },
      { id: 2, name: 'Gender agreement', category: 'Grammar' },
      { id: 3, name: 'Number agreement', category: 'Grammar' },
      { id: 4, name: 'Verb conjugation', category: 'Grammar' },
      { id: 5, name: 'Tense', category: 'Grammar' },
      { id: 6, name: 'Pronoun usage', category: 'Grammar' },
      { id: 7, name: 'Vocabulary', category: 'Vocabulary' },
      { id: 8, name: 'Word order', category: 'Syntax' },
      { id: 9, name: 'Sandhi', category: 'Grammar' },
      { id: 10, name: 'Sentence construction', category: 'Syntax' }
    );
  }

  // 2. Seed Achievements if empty
  if (db.achievements.length === 0) {
    db.achievements.push(
      {
        id: 1,
        code: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first Sanskrit lesson',
        icon: 'Footprints',
        condition_type: 'completed_lessons',
        threshold: 1,
      },
      {
        id: 2,
        code: 'vocab_builder',
        name: 'Vocabulary Builder',
        description: 'Practice and master 25 Sanskrit words',
        icon: 'BookOpen',
        condition_type: 'learned_words',
        threshold: 25,
      },
      {
        id: 3,
        code: 'grammar_explorer',
        name: 'Grammar Explorer',
        description: 'Complete 10 grammar practice exercises',
        icon: 'Sparkles',
        condition_type: 'grammar_exercises',
        threshold: 10,
      },
      {
        id: 4,
        code: 'conversation_starter',
        name: 'Conversation Starter',
        description: 'Complete your first AI Sanskrit tutor session',
        icon: 'MessageSquare',
        condition_type: 'ai_chat',
        threshold: 1,
      },
      {
        id: 5,
        code: 'error_hunter',
        name: 'Error Hunter',
        description: 'Correct 10 mistaken answers with self-correction',
        icon: 'Target',
        condition_type: 'corrected_mistakes',
        threshold: 10,
      },
      {
        id: 6,
        code: 'consistent_learner',
        name: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        icon: 'Flame',
        condition_type: 'streak_days',
        threshold: 7,
      }
    );
  }

  // 3. Seed Missions if empty
  if (db.missions.length === 0) {
    db.missions.push(
      {
        id: 1,
        title: 'Introduce Yourself in Sanskrit',
        description: 'State your name and location using proper Sanskrit sentence structures.',
        category: 'Conversation',
        task_prompt: 'Write a 2-sentence introduction using "मम नाम..." and "अहम्... वसामि".',
        sample_answer: 'मम नाम आनन्दः अस्ति। अहम् नवदेहल्याम् वसामि।',
        xp_reward: 25,
      },
      {
        id: 2,
        title: 'Describe Your Daily Routine',
        description: 'Use present tense verbs (लट् लकार) to describe your morning schedule.',
        category: 'Grammar & Writing',
        task_prompt: 'Write sentences describing waking up (उत्तिष्ठामि) and drinking water (जलम् पिबामि).',
        sample_answer: 'अहम् प्रातः काले उत्तिष्ठामि। तत्पश्चात् जलम् पिबामि।',
        xp_reward: 30,
      },
      {
        id: 3,
        title: 'Order Food & Beverage',
        description: 'Use polite imperative requests (लोट् लकार) to request food items.',
        category: 'Real-World Mission',
        task_prompt: 'Politely ask for water (जलम्) or tea (चायम्) using "ददातु" (Give) and "कृपया" (Please).',
        sample_answer: 'कृपया मह्यम् एकं चषकं चायम् ददातु।',
        xp_reward: 35,
      },
      {
        id: 4,
        title: 'Ask For Directions',
        description: 'Formulate questions using interrogative pronouns like "कुत्र" (Where).',
        category: 'Conversation',
        task_prompt: 'Ask where the school or library is located using "कुत्र अस्ति?".',
        sample_answer: 'भवान् कथयतु, विद्यालयः कुत्र अस्ति?',
        xp_reward: 30,
      },
      {
        id: 5,
        title: 'Describe Your Family',
        description: 'Use possessive pronouns and family terms (माता, पिता, भ्राता, भगिनी).',
        category: 'Vocabulary',
        task_prompt: 'Mention your mother or father in Sanskrit.',
        sample_answer: 'मम माता शिक्षिका अस्ति। मम पिता वैद्यः अस्ति।',
        xp_reward: 40,
      },
      {
        id: 6,
        title: 'Write a Polite Greeting Message',
        description: 'Compose a formal or warm greeting to a teacher or friend.',
        category: 'Cultural Writing',
        task_prompt: 'Write a message with "शुभप्रभातम्" and "अस्तु, पुनः मिलामः".',
        sample_answer: 'शुभप्रभातम् श्रीमन्! भवतः दिनं शुभं भूयात्। पुनः मिलामः।',
        xp_reward: 25,
      }
    );
  }

  // 4. Seed Lessons if empty
  if (db.lessons.length === 0) {
    db.lessons.push(
      {
        id: 1,
        title: 'Essential Sanskrit Greetings & Civilities',
        category: 'Vocabulary',
        level: 'Beginner',
        description: 'Learn foundational greetings like Namaste, Subhaprabhatam, and Dhanyavada.',
        order_num: 1,
      },
      {
        id: 2,
        title: 'Self Introductions & Names',
        category: 'Conversation',
        level: 'Beginner',
        description: 'Master stating your name and asking others using मम नाम... and भवतः/भवत्याः नाम किम्?',
        order_num: 2,
      },
      {
        id: 3,
        title: 'Personal Pronouns (अहम्, त्वम्, सः, सा, तत्)',
        category: 'Grammar',
        level: 'Beginner',
        description: 'Understand 1st, 2nd, and 3rd person singular pronouns across masculine, feminine, and neuter.',
        order_num: 3,
      },
      {
        id: 4,
        title: 'Nouns & Three Sanskrit Genders (लिङ्गम्)',
        category: 'Grammar',
        level: 'Beginner',
        description: 'Learn Masculine (पुंल्लिङ्गम्), Feminine (स्त्रीलिङ्गम्), and Neuter (नपुंसकलिङ्गम्) noun structures.',
        order_num: 4,
      },
      {
        id: 5,
        title: 'Accusative Case (द्वितीया विभक्तिः) & Objects',
        category: 'Grammar',
        level: 'Intermediate',
        description: 'Understand direct objects in Sanskrit sentences (e.g. बालकः जलम् पिबति).',
        order_num: 5,
      },
      {
        id: 6,
        title: 'Present Tense Verb Conjugation (लट् लकारः)',
        category: 'Grammar',
        level: 'Intermediate',
        description: 'Master verb endings -ति, -तः, -न्ति / -सि, -थः, -थ / -मि, -वः, -मः.',
        order_num: 6,
      },
      {
        id: 7,
        title: 'Sandhi Rules: Vowel Joining (स्वरसन्धिः)',
        category: 'Grammar',
        level: 'Advanced',
        description: 'Learn how phonetic coalescence combines adjacent words like विद्या + आलयः = विद्यालयः.',
        order_num: 7,
      }
    );
  }

  // 5. Seed Questions if empty
  if (db.questions.length === 0) {
    db.questions.push(
      // Lesson 1 Questions
      {
        id: 1,
        lesson_id: 1,
        question: 'What is the standard Sanskrit respectful greeting used universally?',
        question_type: 'multiple_choice',
        options: ['शुभरात्रिः', 'नमस्ते', 'धन्यवादः', 'गच्छामि'],
        correct_answer: 'नमस्ते',
        explanation: '"नमस्ते" (Namaste) combines "नमः" (salutation) + "ते" (to you).',
        concept_id: 7,
        grammar_concept_name: 'Vocabulary',
      },
      {
        id: 2,
        lesson_id: 1,
        question: 'Translate "Thank you" into Sanskrit.',
        question_type: 'multiple_choice',
        options: ['शुभप्रभातम्', 'क्षमीयताम्', 'धन्यवादः', 'स्वागतम्'],
        correct_answer: 'धन्यवादः',
        explanation: '"धन्यवादः" (Dhanyavādaḥ) literally means rendering thanks/gratitude.',
        concept_id: 7,
        grammar_concept_name: 'Vocabulary',
      },
      {
        id: 3,
        lesson_id: 1,
        question: 'What does "शुभप्रभातम्" mean?',
        question_type: 'multiple_choice',
        options: ['Good evening', 'Good morning', 'Welcome', 'Goodbye'],
        correct_answer: 'Good morning',
        explanation: '"शुभ" (Auspicious/Good) + "प्रभातम्" (Morning) = Good morning.',
        concept_id: 7,
        grammar_concept_name: 'Vocabulary',
      },

      // Lesson 2 Questions
      {
        id: 4,
        lesson_id: 2,
        question: 'Complete the sentence: "___ नाम आनन्दः अस्ति।" (My name is Anand)',
        question_type: 'fill_blank',
        options: ['मम', 'तव', 'तस्य', 'अहम्'],
        correct_answer: 'मम',
        explanation: '"मम" (Mama) is the genitive form meaning "My". "अहम्" means "I".',
        concept_id: 6,
        grammar_concept_name: 'Pronoun usage',
      },
      {
        id: 5,
        lesson_id: 2,
        question: 'When asking a gentleman "What is your name?", which phrase is grammatically correct?',
        question_type: 'multiple_choice',
        options: ['भवत्याः नाम किम्?', 'भवतः नाम किम्?', 'तव नाम किम्?', 'सः नाम किम्?'],
        correct_answer: 'भवतः नाम किम्?',
        explanation: '"भवतः" (Bhavataḥ) is masculine polite "Your". "भवत्याः" is feminine polite "Your".',
        concept_id: 2,
        grammar_concept_name: 'Gender agreement',
      },

      // Lesson 3 Questions
      {
        id: 6,
        lesson_id: 3,
        question: 'Match the Sanskrit pronoun for "She":',
        question_type: 'multiple_choice',
        options: ['सः', 'सा', 'तत्', 'अहम्'],
        correct_answer: 'सा',
        explanation: '"सा" (Sā) is feminine 3rd person pronoun ("She"). "सः" is masculine ("He").',
        concept_id: 2,
        grammar_concept_name: 'Gender agreement',
      },
      {
        id: 7,
        lesson_id: 3,
        question: 'Identify the correct pronoun: "___ पठामि" (I am reading)',
        question_type: 'multiple_choice',
        options: ['त्वम्', 'सः', 'अहम्', 'सा'],
        correct_answer: 'अहम्',
        explanation: 'Verb ending "-ामि" (pathāmi) indicates 1st person singular, which agrees with "अहम्".',
        concept_id: 4,
        grammar_concept_name: 'Verb conjugation',
      },

      // Lesson 4 Questions
      {
        id: 8,
        lesson_id: 4,
        question: 'What is the gender of the noun "जलम्" (Water)?',
        question_type: 'multiple_choice',
        options: ['Masculine (पुंल्लिङ्गम्)', 'Feminine (स्त्रीलिङ्गम्)', 'Neuter (नपुंसकलिङ्गम्)', 'Dual'],
        correct_answer: 'Neuter (नपुंसकलिङ्गम्)',
        explanation: 'Nouns ending in "-म्" like जलम्, फलम्, गृहम् are neuter in gender.',
        concept_id: 2,
        grammar_concept_name: 'Gender agreement',
      },

      // Lesson 5 Questions
      {
        id: 9,
        lesson_id: 5,
        question: 'In "बालकः जलम् पिबति", what grammatical case is "जलम्"?',
        question_type: 'grammar_id',
        options: ['Prathamā (Nominative)', 'Dvitīyā (Accusative)', 'Tṛtīyā (Instrumental)', 'Saptamī (Locative)'],
        correct_answer: 'Dvitīyā (Accusative)',
        explanation: '"जलम्" is the direct object (Karma kāraka) of drinking, so it takes the Dvitīyā (Accusative) case.',
        concept_id: 1,
        grammar_concept_name: 'Case endings',
      },
      {
        id: 10,
        lesson_id: 5,
        question: 'Rearrange into a correct Sanskrit sentence: [पिबति] [जलम्] [बालकः]',
        question_type: 'word_order',
        options: ['बालकः जलम् पिबति', 'पिबति बालकः जलम्', 'जलम् पिबति बालकः', 'All are valid, but Subject-Object-Verb is standard: बालकः जलम् पिबति'],
        correct_answer: 'बालकः जलम् पिबति',
        explanation: 'Sanskrit allows flexible word order due to case inflections, but Subject (बालकः) - Object (जलम्) - Verb (पिबति) is standard clarity.',
        concept_id: 8,
        grammar_concept_name: 'Word order',
      },

      // Lesson 6 Questions
      {
        id: 11,
        lesson_id: 6,
        question: 'What is the correct 3rd person plural (प्रथमपुरुष बहुवचन) form of verb "पठ्" (read)?',
        question_type: 'multiple_choice',
        options: ['पठति', 'पठतः', 'पठन्ति', 'पठामि'],
        correct_answer: 'पठन्ति',
        explanation: 'The plural suffix for 3rd person in Present Tense (लट् लकार) is "-न्ति" (Paṭhanti).',
        concept_id: 4,
        grammar_concept_name: 'Verb conjugation',
      },

      // Lesson 7 Questions
      {
        id: 12,
        lesson_id: 7,
        question: 'Which Sandhi rule forms "विद्या + आलयः = विद्यालयः"?',
        question_type: 'multiple_choice',
        options: ['Dīrgha Svara Sandhi (दीर्घस्वरसन्धिः)', 'Guṇa Sandhi', 'Vṛddhi Sandhi', 'Yan Sandhi'],
        correct_answer: 'Dīrgha Svara Sandhi (दीर्घस्वरसन्धिः)',
        explanation: 'When two similar vowels meet (आ + आ), they coalesce into their long form (आ): Dīrgha Sandhi.',
        concept_id: 9,
        grammar_concept_name: 'Sandhi',
      }
    );
  }

  dbInstance.save();
  console.log('[GLOSSA DB] Initial seed data checked & populated.');
}
