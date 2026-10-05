import { Router } from 'express';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';
import { GeminiAIService } from '../services/geminiAI.js';

const router = Router();

// 1. Get Chat History
router.get('/history', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const db = dbInstance.getDB;
    const history = db.chat_history.filter(c => c.user_id === userId);
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// 2. Send Message to AI Tutor GLOSSA
router.post('/message', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { mode, message } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    const db = dbInstance.getDB;
    const prefs = db.user_preferences.find(p => p.user_id === userId);
    const explanationLang = prefs ? prefs.explanation_language : 'English';

    const aiResponse = await GeminiAIService.generateTutorResponse(mode || 'Conversation', message, explanationLang);

    // Save Chat Entry
    const chatEntry = {
      id: db.chat_history.length + 1,
      user_id: userId,
      mode: mode || 'Conversation',
      message,
      response: aiResponse,
      created_at: new Date().toISOString(),
    };
    db.chat_history.push(chatEntry);

    // Check Conversation Starter achievement
    const conversationAchievement = db.achievements.find(a => a.code === 'conversation_starter');
    if (conversationAchievement) {
      const exists = db.user_achievements.some(ua => ua.user_id === userId && ua.achievement_id === conversationAchievement.id);
      if (!exists) {
        db.user_achievements.push({
          user_id: userId,
          achievement_id: conversationAchievement.id,
          unlocked_at: new Date().toISOString(),
        });
      }
    }

    dbInstance.save();
    return res.json({ chatEntry });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ error: 'Unable to communicate with AI Tutor at this time' });
  }
});

export default router;
