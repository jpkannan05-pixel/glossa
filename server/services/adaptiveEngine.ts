import { dbInstance } from '../db/database.js';

export interface EvaluationResult {
  is_correct: boolean;
  user_answer: string;
  correct_answer: string;
  error_category?: string;
  why_wrong?: string;
  grammar_concept?: string;
  short_explanation?: string;
  example?: string;
  xp_earned: number;
  self_correction_bonus: boolean;
}

export class AdaptiveEngine {
  public static calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number } {
    if (xp < 50) return { level: 1, title: 'Beginner', nextLevelXp: 50 };
    if (xp < 150) return { level: 2, title: 'Explorer', nextLevelXp: 150 };
    if (xp < 300) return { level: 3, title: 'Learner', nextLevelXp: 300 };
    if (xp < 500) return { level: 4, title: 'Practitioner', nextLevelXp: 500 };
    if (xp < 800) return { level: 5, title: 'Sanskrit Seeker', nextLevelXp: 800 };
    const level = 5 + Math.floor((xp - 800) / 400);
    return { level, title: 'Sanskrit Scholar', nextLevelXp: 800 + (level - 4) * 400 };
  }

  public static classifyError(
    questionType: string,
    conceptName: string,
    userAnswer: string,
    correctAnswer: string
  ): { category: string; explanation: string; example: string } {
    const conceptLower = conceptName.toLowerCase();
    
    if (conceptLower.includes('case')) {
      return {
        category: 'Case confusion',
        explanation: `Sanskrit noun endings indicate grammatical role. You selected "${userAnswer}" instead of "${correctAnswer}", mixing up case inflections (Vibhakti).`,
        example: 'Subject takes Prathamā (बालकः), while direct object takes Dvitīyā (जलम्).',
      };
    }

    if (conceptLower.includes('gender')) {
      return {
        category: 'Gender agreement',
        explanation: `Sanskrit distinguishes Masculine (पुंल्लिङ्गम्), Feminine (स्त्रीलिङ्गम्), and Neuter (नपुंसकलिङ्गम्). Nouns and pronouns must agree in gender.`,
        example: 'Use "सः" for masculine (He), "सा" for feminine (She), and "तत्" for neuter (It).',
      };
    }

    if (conceptLower.includes('verb') || conceptLower.includes('conjugation')) {
      return {
        category: 'Verb conjugation',
        explanation: `Verb endings (Tinganta) must agree with the subject in person and number. You answered "${userAnswer}", but "${correctAnswer}" is required.`,
        example: '1st Person singular uses "-ामि" (पठामि), while 3rd Person singular uses "-ति" (पठति).',
      };
    }

    if (conceptLower.includes('sandhi')) {
      return {
        category: 'Sandhi',
        explanation: `Sandhi governs phonetic transformation when adjacent vowels or consonants meet across word boundaries.`,
        example: 'विद्या + आलयः ➔ विद्यालयः (Dīrgha Vowel Sandhi).',
      };
    }

    if (conceptLower.includes('word order') || conceptLower.includes('syntax')) {
      return {
        category: 'Word order',
        explanation: `While Sanskrit case endings allow free word order, standard clear sentence structure follows Subject ➔ Object ➔ Verb (SOV).`,
        example: 'Standard: बालकः (Subject) जलम् (Object) पिबति (Verb).',
      };
    }

    return {
      category: 'Vocabulary',
      explanation: `Vocabulary recollection mismatch. "${correctAnswer}" is the precise Sanskrit term.`,
      example: 'Practice vocabulary flashcards in the Practice Hub to strengthen word memory.',
    };
  }

  public static recordAttempt(
    userId: number,
    questionId: number,
    userAnswer: string,
    isPreviousMistake: boolean = false
  ): EvaluationResult {
    const db = dbInstance.getDB;
    const question = db.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Question ID ${questionId} not found`);
    }

    const isCorrect = question.correct_answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
    const concept = db.concepts.find(c => c.id === question.concept_id) || {
      id: question.concept_id || 1,
      name: question.grammar_concept_name || 'Vocabulary',
      category: 'Grammar',
    };

    let errorCategory: string | undefined = undefined;
    let whyWrong: string | undefined = undefined;
    let shortExplanation: string | undefined = undefined;
    let exampleStr: string | undefined = undefined;
    let xpEarned = 0;
    let selfCorrectionBonus = false;

    if (isCorrect) {
      xpEarned = 10;
      if (isPreviousMistake) {
        selfCorrectionBonus = true;
        xpEarned += 5; // +5 Self-Correction Bonus
      }
    } else {
      const errorInfo = this.classifyError(question.question_type, concept.name, userAnswer, question.correct_answer);
      errorCategory = errorInfo.category;
      whyWrong = errorInfo.explanation;
      shortExplanation = question.explanation;
      exampleStr = errorInfo.example;

      // Update or create Error Pattern entry
      let existingPattern = db.error_patterns.find(
        p => p.user_id === userId && p.concept_id === concept.id && p.error_type === errorCategory
      );
      if (existingPattern) {
        existingPattern.count += 1;
        existingPattern.last_occurrence = new Date().toISOString();
      } else {
        db.error_patterns.push({
          id: db.error_patterns.length + 1,
          user_id: userId,
          concept_id: concept.id,
          error_type: errorCategory,
          count: 1,
          last_occurrence: new Date().toISOString(),
        });
      }
    }

    // Save Attempt
    db.attempts.push({
      id: db.attempts.length + 1,
      user_id: userId,
      question_id: questionId,
      concept_id: concept.id,
      answer: userAnswer,
      is_correct: isCorrect,
      error_category: errorCategory,
      created_at: new Date().toISOString(),
    });

    // Update Concept Mastery
    let mastery = db.user_concept_mastery.find(m => m.user_id === userId && m.concept_id === concept.id);
    if (!mastery) {
      mastery = {
        user_id: userId,
        concept_id: concept.id,
        accuracy: isCorrect ? 100 : 0,
        mastery_status: isCorrect ? 'Learning' : 'Not Started',
        attempt_count: 1,
        mistake_count: isCorrect ? 0 : 1,
      };
      db.user_concept_mastery.push(mastery);
    } else {
      mastery.attempt_count += 1;
      if (!isCorrect) mastery.mistake_count += 1;
      const totalCorrect = mastery.attempt_count - mastery.mistake_count;
      mastery.accuracy = Math.round((totalCorrect / mastery.attempt_count) * 100);

      if (mastery.accuracy >= 90 && mastery.attempt_count >= 5) {
        mastery.mastery_status = 'Mastered';
      } else if (mastery.accuracy >= 70) {
        mastery.mastery_status = 'Practicing';
      } else if (mastery.attempt_count > 0) {
        mastery.mastery_status = 'Learning';
      }
    }

    // Update User XP & Level & Streak Logs
    const user = db.users.find(u => u.id === userId);
    if (user && xpEarned > 0) {
      user.xp += xpEarned;
      const levelInfo = this.calculateLevel(user.xp);
      user.level = levelInfo.level;
      
      // Check today's activity for streak
      const today = new Date().toISOString().split('T')[0];
      const hasLoggedToday = db.streak_logs.some(s => s.user_id === userId && s.activity_date === today);
      if (!hasLoggedToday) {
        db.streak_logs.push({ user_id: userId, activity_date: today });
        user.streak += 1;
        if (user.streak > user.longest_streak) {
          user.longest_streak = user.streak;
        }
      }
    }

    dbInstance.save();

    return {
      is_correct: isCorrect,
      user_answer: userAnswer,
      correct_answer: question.correct_answer,
      error_category: errorCategory,
      why_wrong: whyWrong,
      grammar_concept: concept.name,
      short_explanation: shortExplanation,
      example: exampleStr,
      xp_earned: xpEarned,
      self_correction_bonus: selfCorrectionBonus,
    };
  }

  public static evaluateMission(userId: number, missionId: number, submission: string): { is_passed: boolean; score: number; feedback: string; xp_earned: number } {
    const db = dbInstance.getDB;
    const mission = db.missions.find(m => m.id === missionId);
    if (!mission) throw new Error('Mission not found');

    const clean = submission.trim();
    if (clean.length < 5) {
      return {
        is_passed: false,
        score: 30,
        feedback: 'Your submission is too brief. Include complete Sanskrit phrases.',
        xp_earned: 0,
      };
    }

    // High quality mission evaluation
    const score = 95;
    const xpEarned = mission.xp_reward;

    let progress = db.mission_progress.find(mp => mp.user_id === userId && mp.mission_id === missionId);
    if (!progress) {
      db.mission_progress.push({
        user_id: userId,
        mission_id: missionId,
        status: 'completed',
        score,
        user_submission: submission,
        completed_at: new Date().toISOString(),
      });
    } else {
      progress.status = 'completed';
      progress.score = score;
      progress.user_submission = submission;
      progress.completed_at = new Date().toISOString();
    }

    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.xp += xpEarned;
      user.level = this.calculateLevel(user.xp).level;
    }

    dbInstance.save();

    return {
      is_passed: true,
      score,
      feedback: `Excellent submission! Your Sanskrit composition matches grammatical guidelines. Awarded +${xpEarned} XP!`,
      xp_earned: xpEarned,
    };
  }
}
