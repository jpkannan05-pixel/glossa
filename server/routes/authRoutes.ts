import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbInstance } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'glossa_super_secret_jwt_key_2026';

// 1. Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = dbInstance.getDB;
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: db.users.length + 1,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      level: 1,
      xp: 0,
      streak: 0,
      longest_streak: 0,
      shields: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    // Initial default preferences
    db.user_preferences.push({
      user_id: newUser.id,
      sanskrit_level: 'Complete Beginner',
      learning_goal: ['Vocabulary', 'Grammar'],
      daily_goal: 15,
      explanation_language: 'English',
      teaching_style: 'Simple explanations',
    });

    dbInstance.save();

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        level: newUser.level,
        xp: newUser.xp,
        streak: newUser.streak,
        shields: newUser.shields,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = dbInstance.getDB;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        shields: user.shields,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// 3. Onboarding Preferences
router.post('/onboarding', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { sanskrit_level, learning_goal, daily_goal, explanation_language, teaching_style } = req.body;

    const db = dbInstance.getDB;
    let pref = db.user_preferences.find(p => p.user_id === userId);
    if (!pref) {
      pref = {
        user_id: userId,
        sanskrit_level: sanskrit_level || 'Complete Beginner',
        learning_goal: learning_goal || ['Vocabulary', 'Grammar'],
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
    return res.json({ message: 'Onboarding preferences saved', preferences: pref });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// 4. Forgot Password Request
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const db = dbInstance.getDB;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address' });
  }

  // Create reset token
  const resetToken = jwt.sign({ id: user.id, purpose: 'reset-password' }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({
    message: 'Password reset link sent to your email',
    resetToken, // Returned for UI dev convenience
  });
});

// 5. Reset Password
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ error: 'Reset token and new password required' });

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET) as { id: number; purpose: string };
    if (decoded.purpose !== 'reset-password') return res.status(400).json({ error: 'Invalid reset token' });

    const db = dbInstance.getDB;
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.updated_at = new Date().toISOString();
    dbInstance.save();

    return res.json({ message: 'Password reset successfully. You can now login.' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired password reset link' });
  }
});

export default router;
