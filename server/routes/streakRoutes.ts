import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get Streak data & Shields
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const logs = db.streak_logs.filter(s => s.user_id === userId);

    return res.json({
      streak: user.streak,
      longest_streak: user.longest_streak,
      shields: user.shields,
      logs: logs.map(l => l.activity_date),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

export default router;
