export interface User {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  longest_streak: number;
  shields: number;
  created_at?: string;
}

export interface UserPreferences {
  sanskrit_level: string;
  learning_goal: string[];
  daily_goal: number;
  explanation_language: 'English' | 'Tamil';
  teaching_style: string;
}

export interface Lesson {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  order_num: number;
  status?: 'not_started' | 'in_progress' | 'completed';
  score?: number;
}

export interface Question {
  id: number;
  lesson_id: number;
  question: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  concept_id: number;
  grammar_concept_name: string;
}

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

export interface ErrorPatternCard {
  concept_id: number;
  concept_name: string;
  category: string;
  status: 'Needs Practice' | 'Learning' | 'Strong' | 'Untested';
  accuracy: number;
  totalMistakes: number;
  recommendation: string;
  errorTypes: string[];
  lastOccurrence?: string;
}

export interface MasteryConcept {
  concept_id: number;
  name: string;
  category: string;
  accuracy: number;
  mastery_status: 'Not Started' | 'Learning' | 'Practicing' | 'Mastered';
  attempt_count: number;
  mistake_count: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  task_prompt: string;
  sample_answer: string;
  xp_reward: number;
  status?: 'not_started' | 'completed';
  score?: number;
  user_submission?: string;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  threshold: number;
  isUnlocked?: boolean;
  unlockedAt?: string;
}

export interface WordAnalysis {
  word: string;
  lemma: string;
  pos: string;
  gender?: string;
  number?: string;
  caseOrTense?: string;
  dhatuOrPratipadika: string;
  morphology: string;
  confidence: 'High' | 'Medium' | 'Low (Heuristic)';
  explanation: string;
}

export interface SentenceAnalysis {
  sentence: string;
  tokens: string[];
  words: WordAnalysis[];
  syntaxTree: {
    id: number;
    word: string;
    pos: string;
    role: string;
    parent: number | null;
    relation: string;
  }[];
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

export interface ChatMessage {
  id: number;
  mode: string;
  message: string;
  response: {
    sanskrit?: string;
    translation?: string;
    explanation?: string;
    grammar_correction?: {
      user_wrote: string;
      better_version: string;
      why: string;
      grammar_concept: string;
    };
  };
  created_at: string;
}
