import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get My Mastery Map
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;

    const masteries = db.user_concept_mastery.filter(m => m.user_id === userId);
    const attempts = db.attempts.filter(a => a.user_id === userId);

    const conceptMap = db.concepts.map(c => {
      const mastery = masteries.find(m => m.concept_id === c.id);
      const conceptAttempts = attempts.filter(a => a.concept_id === c.id);

      return {
        concept_id: c.id,
        name: c.name,
        category: c.category,
        accuracy: mastery ? mastery.accuracy : 0,
        mastery_status: mastery ? mastery.mastery_status : 'Not Started',
        attempt_count: mastery ? mastery.attempt_count : 0,
        mistake_count: mastery ? mastery.mistake_count : 0,
        recentAttempts: conceptAttempts.slice(-3).reverse(),
      };
    });

    return res.json({ conceptMap });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch concept mastery map' });
  }
});

export default router;
