import express from 'express';
import { pool } from './db/pool.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { categoriesRoutes } from './routes/categoriesRoutes.js';
import { categoryTopicsRoutes, topicsRoutes } from './routes/topicsRoutes.js';
import { topicTasksRoutes, tasksRoutes } from './routes/tasksRoutes.js';
import { topicReviewLogsRoutes } from './routes/reviewLogsRoutes.js';
import { weekRoutes } from './routes/weekRoutes.js';
import { staleTopicsRoutes } from './routes/staleTopicsRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';
import { archiveRoutes } from './routes/archiveRoutes.js';

export const app = express();

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories/:categoryId/topics', categoryTopicsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/topics/:topicId/tasks', topicTasksRoutes);
app.use('/api/topics/:topicId/reviews', topicReviewLogsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/week', weekRoutes);
app.use('/api/stale-topics', staleTopicsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/archive', archiveRoutes);

// Must stay last: they handle whatever the routes above did not
app.use(notFound);
app.use(errorHandler);
