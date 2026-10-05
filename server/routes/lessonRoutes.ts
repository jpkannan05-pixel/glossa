import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';

const router = Router();

// 1. Get All Lessons grouped by category
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;
    const progressList = db.lesson_progress.filter(lp => lp.user_id === userId);

    const lessons = db.lessons.map(l => {
      const prog = progressList.find(p => p.lesson_id === l.id);
      return {
        ...l,
        status: prog ? prog.status : 'not_started',
        score: prog ? prog.score : 0,
      };
    });

    return res.json({ lessons });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// 2. Get Lesson Details & Questions
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const lessonId = parseInt(req.params.id as string);
    const userId = req.user!.id;
    const db = dbInstance.getDB;

    const lesson = db.lessons.find(l => l.id === lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const questions = db.questions.filter(q => q.lesson_id === lessonId);
    const progress = db.lesson_progress.find(lp => lp.user_id === userId && lp.lesson_id === lessonId);

    return res.json({
      lesson,
      questions,
      progress: progress || { status: 'not_started', score: 0 },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lesson detail' });
  }
});

// 3. Submit Answer to Question (with Error-Aware Classification & Adaptive Evaluation)
router.post('/submit-answer', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { question_id, answer, is_previous_mistake } = req.body;

    if (!question_id || answer === undefined) {
      return res.status(400).json({ error: 'question_id and answer are required' });
    }

    const evaluation = AdaptiveEngine.recordAttempt(userId, question_id, answer, !!is_previous_mistake);

    return res.json({ evaluation });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit answer' });
  }
});

// 4. Complete Lesson
router.post('/:id/complete', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const lessonId = parseInt(req.params.id as string);
    const { score } = req.body;

    const db = dbInstance.getDB;
    let prog = db.lesson_progress.find(lp => lp.user_id === userId && lp.lesson_id === lessonId);
    if (!prog) {
      prog = {
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        score: score || 100,
        completed_at: new Date().toISOString(),
      };
      db.lesson_progress.push(prog);
    } else {
      prog.status = 'completed';
      prog.score = Math.max(prog.score, score || 100);
      prog.completed_at = new Date().toISOString();
    }

    // Award Completion XP (+25 XP)
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.xp += 25;
      user.level = AdaptiveEngine.calculateLevel(user.xp).level;
    }

    // Check First Steps Achievement
    const completedCount = db.lesson_progress.filter(lp => lp.user_id === userId && lp.status === 'completed').length;
    const firstStepsAchievement = db.achievements.find(a => a.code === 'first_steps');
    if (firstStepsAchievement && completedCount >= 1) {
      const exists = db.user_achievements.some(ua => ua.user_id === userId && ua.achievement_id === firstStepsAchievement.id);
      if (!exists) {
        db.user_achievements.push({
          user_id: userId,
          achievement_id: firstStepsAchievement.id,
          unlocked_at: new Date().toISOString(),
        });
      }
    }

    dbInstance.save();
    return res.json({ message: 'Lesson completed successfully', xp_earned: 25 });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record lesson completion' });
  }
});

export default router;
