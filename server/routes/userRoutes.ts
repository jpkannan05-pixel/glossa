import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// 1. Get Current User Profile & Real Dashboard Stats
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const preferences = db.user_preferences.find(p => p.user_id === userId) || {
      sanskrit_level: 'Complete Beginner',
      learning_goal: ['Vocabulary', 'Grammar'],
      daily_goal: 15,
      explanation_language: 'English',
      teaching_style: 'Simple explanations',
    };

    const completedLessons = db.lesson_progress.filter(lp => lp.user_id === userId && lp.status === 'completed').length;
    const masteries = db.user_concept_mastery.filter(m => m.user_id === userId);
    const overallMastery = masteries.length > 0
      ? Math.round(masteries.reduce((acc, m) => acc + m.accuracy, 0) / masteries.length)
      : 0;

    const achievementsCount = db.user_achievements.filter(ua => ua.user_id === userId).length;

    // Recent activity
    const recentAttempts = db.attempts
      .filter(a => a.user_id === userId)
      .slice(-5)
      .reverse();

    // Weak concepts
    const weakConcepts = masteries
      .filter(m => m.accuracy < 75 && m.attempt_count > 0)
      .map(m => {
        const concept = db.concepts.find(c => c.id === m.concept_id);
        return {
          id: m.concept_id,
          name: concept ? concept.name : 'Grammar',
          accuracy: m.accuracy,
          mistakes: m.mistake_count,
        };
      });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        longest_streak: user.longest_streak,
        shields: user.shields,
        created_at: user.created_at,
      },
      preferences,
      stats: {
        completedLessons,
        overallMastery,
        achievementsUnlocked: achievementsCount,
      },
      weakConcepts,
      recentActivity: recentAttempts,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// 2. Update Profile & Preferences
router.put('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, sanskrit_level, learning_goal, daily_goal, explanation_language, teaching_style } = req.body;

    const db = dbInstance.getDB;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    user.updated_at = new Date().toISOString();

    let pref = db.user_preferences.find(p => p.user_id === userId);
    if (!pref) {
      pref = {
        user_id: userId,
        sanskrit_level: sanskrit_level || 'Complete Beginner',
        learning_goal: learning_goal || ['Vocabulary'],
        daily_goal: daily_goal || 15,
        explanation_language: explanation_language || 'English',
        teaching_style: teaching_style || 'Simple explanations',
      };
      db.user_preferences.push(pref);
    } else {
      if (sanskrit_level) pref.sanskrit_level = sanskrit_level;
      if (learning_goal) pref.learning_goal = learning_goal;
      if (daily_goal) pref.daily_goal = daily_goal;
      if (explanation_language) pref.explanation_language = explanation_language;
      if (teaching_style) pref.teaching_style = teaching_style;
    }

    dbInstance.save();
    return res.json({ message: 'Profile updated successfully', user, preferences: pref });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
