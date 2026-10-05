import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'glossa_db.json');

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  level: number;
  xp: number;
  streak: number;
  longest_streak: number;
  shields: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: number;
  sanskrit_level: string;
  learning_goal: string[]; // e.g. ["Vocabulary", "Grammar"]
  daily_goal: number; // e.g. 15
  explanation_language: string; // 'English' | 'Tamil'
  teaching_style: string;
}

export interface Concept {
  id: number;
  name: string;
  category: string;
}

export interface Lesson {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  order_num: number;
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

export interface LessonProgress {
  user_id: number;
  lesson_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  completed_at?: string;
}

export interface Attempt {
  id: number;
  user_id: number;
  question_id: number;
  concept_id: number;
  answer: string;
  is_correct: boolean;
  error_category?: string;
  created_at: string;
}

export interface UserConceptMastery {
  user_id: number;
  concept_id: number;
  accuracy: number; // 0 to 100
  mastery_status: 'Not Started' | 'Learning' | 'Practicing' | 'Mastered';
  attempt_count: number;
  mistake_count: number;
}

export interface ErrorPattern {
  id: number;
  user_id: number;
  concept_id: number;
  error_type: string;
  count: number;
  last_occurrence: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  task_prompt: string;
  sample_answer: string;
  xp_reward: number;
}

export interface MissionProgress {
  user_id: number;
  mission_id: number;
  status: 'not_started' | 'completed';
  score: number;
  user_submission?: string;
  completed_at?: string;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  threshold: number;
}

export interface UserAchievement {
  user_id: number;
  achievement_id: number;
  unlocked_at: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
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

export interface StreakLog {
  user_id: number;
  activity_date: string; // YYYY-MM-DD
}

export interface SchemaData {
  users: User[];
  user_preferences: UserPreferences[];
  concepts: Concept[];
  lessons: Lesson[];
  questions: Question[];
  lesson_progress: LessonProgress[];
  attempts: Attempt[];
  user_concept_mastery: UserConceptMastery[];
  error_patterns: ErrorPattern[];
  missions: Mission[];
  mission_progress: MissionProgress[];
  achievements: Achievement[];
  user_achievements: UserAchievement[];
  chat_history: ChatMessage[];
  streak_logs: StreakLog[];
}

const defaultData: SchemaData = {
  users: [],
  user_preferences: [],
  concepts: [],
  lessons: [],
  questions: [],
  lesson_progress: [],
  attempts: [],
  user_concept_mastery: [],
  error_patterns: [],
  missions: [],
  mission_progress: [],
  achievements: [],
  user_achievements: [],
  chat_history: [],
  streak_logs: [],
};

class DBManager {
  private data: SchemaData;

  constructor() {
    this.data = this.load();
  }

  private load(): SchemaData {
    if (!fs.existsSync(DB_FILE)) {
      this.saveData(defaultData);
      return defaultData;
    }
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('[DBManager] Error reading DB file, using default data', e);
      return defaultData;
    }
  }

  public save() {
    this.saveData(this.data);
  }

  private saveData(data: SchemaData) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  public get getDB(): SchemaData {
    return this.data;
  }
}

export const dbInstance = new DBManager();
export const db = dbInstance.getDB;
