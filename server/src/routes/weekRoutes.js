import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getWeek } from '../controllers/weekController.js';

export const weekRoutes = Router();
weekRoutes.use(requireAuth);
weekRoutes.get('/', getWeek);
