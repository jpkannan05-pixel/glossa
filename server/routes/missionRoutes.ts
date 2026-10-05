import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';

const router = Router();

// 1. Get All Real-World Missions with user progress
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;
    const progressList = db.mission_progress.filter(mp => mp.user_id === userId);

    const missions = db.missions.map(m => {
      const prog = progressList.find(p => p.mission_id === m.id);
      return {
        ...m,
        status: prog ? prog.status : 'not_started',
        score: prog ? prog.score : 0,
        user_submission: prog ? prog.user_submission : null,
      };
    });

    return res.json({ missions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// 2. Submit Mission
router.post('/:id/submit', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const missionId = parseInt(req.params.id as string);
    const { submission } = req.body;

    if (!submission) return res.status(400).json({ error: 'Submission content is required' });

    const result = AdaptiveEngine.evaluateMission(userId, missionId, submission);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to process mission submission' });
  }
});

export default router;
