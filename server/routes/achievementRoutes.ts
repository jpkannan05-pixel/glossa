import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get Achievements List with unlocked status
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;

    const unlocked = db.user_achievements.filter(ua => ua.user_id === userId);

    const achievements = db.achievements.map(a => {
      const isUnlocked = unlocked.some(u => u.achievement_id === a.id);
      const unlockEntry = unlocked.find(u => u.achievement_id === a.id);
      return {
        ...a,
        isUnlocked,
        unlockedAt: unlockEntry ? unlockEntry.unlocked_at : null,
      };
    });

    return res.json({ achievements });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;
