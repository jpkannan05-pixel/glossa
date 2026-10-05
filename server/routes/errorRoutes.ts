import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Get Learner's Error Patterns & Targeted Recommendations
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;

    const patterns = db.error_patterns.filter(ep => ep.user_id === userId);
    const masteries = db.user_concept_mastery.filter(m => m.user_id === userId);

    const patternCards = db.concepts.map(concept => {
      const mastery = masteries.find(m => m.concept_id === concept.id);
      const errorList = patterns.filter(p => p.concept_id === concept.id);
      const totalMistakes = errorList.reduce((acc, p) => acc + p.count, 0);
      const accuracy = mastery ? mastery.accuracy : (totalMistakes > 0 ? 50 : 100);

      let status: 'Needs Practice' | 'Learning' | 'Strong' | 'Untested' = 'Untested';
      if (mastery && mastery.attempt_count > 0) {
        if (accuracy < 70) status = 'Needs Practice';
        else if (accuracy < 88) status = 'Learning';
        else status = 'Strong';
      }

      let recommendation = `Practice ${concept.name} identification and rules.`;
      if (concept.name === 'Case endings') {
        recommendation = 'Practice distinguishing Prathamā (Subject) and Dvitīyā (Accusative object).';
      } else if (concept.name === 'Gender agreement') {
        recommendation = 'Review Masculine (-ः), Feminine (-ा), and Neuter (-म्) noun matches.';
      } else if (concept.name === 'Verb conjugation') {
        recommendation = 'Focus on Present Tense (लट् लकार) singular vs plural verb endings.';
      }

      return {
        concept_id: concept.id,
        concept_name: concept.name,
        category: concept.category,
        status,
        accuracy,
        totalMistakes,
        recommendation,
        errorTypes: errorList.map(e => e.error_type),
        lastOccurrence: errorList.length > 0 ? errorList[0].last_occurrence : null,
      };
    });

    return res.json({ patterns: patternCards });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch error patterns' });
  }
});

export default router;
