import { Router } from 'express';
import { SanskritNLP } from '../services/sanskritNLP.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// 1. Analyze Sanskrit Word
router.post('/analyze-word', authenticateToken, (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: 'Sanskrit word is required' });

    const analysis = SanskritNLP.analyzeWord(word);
    return res.json({ analysis });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to analyze word' });
  }
});

// 2. Analyze Sanskrit Sentence (Tokenization, POS, Kāraka Dependency Pipeline)
router.post('/analyze-sentence', authenticateToken, (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence) return res.status(400).json({ error: 'Sanskrit sentence is required' });

    const analysis = SanskritNLP.analyzeSentence(sentence);
    return res.json({ analysis });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to analyze sentence' });
  }
});

export default router;
