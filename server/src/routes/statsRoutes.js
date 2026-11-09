import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getTopicConfidence } from '../controllers/statsController.js';

export const statsRoutes = Router();
statsRoutes.use(requireAuth);
statsRoutes.get('/topic-confidence', getTopicConfidence);
