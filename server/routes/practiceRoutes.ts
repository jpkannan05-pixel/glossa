import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get Practice Exercises by type or targeted concept
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { type, concept_id } = req.query;
    const db = dbInstance.getDB;
    let questions = [...db.questions];

    if (type) {
      questions = questions.filter(q => q.question_type === type);
    }
    if (concept_id) {
      const cid = parseInt(concept_id as string);
      questions = questions.filter(q => q.concept_id === cid);
    }

    return res.json({ exercises: questions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch practice exercises' });
  }
});

export default router;
