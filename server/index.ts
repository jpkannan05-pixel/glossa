import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { seedInitialData } from './db/seedData.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import errorRoutes from './routes/errorRoutes.js';
import masteryRoutes from './routes/masteryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import linguisticRoutes from './routes/linguisticRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database & Seed initial data
seedInitialData();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/mastery', masteryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/linguistics', linguisticRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/achievements', achievementRoutes);

// Serve static frontend assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 [GLOSSA Backend] Server listening on http://localhost:${PORT}`);
});
