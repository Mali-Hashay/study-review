import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getStaleTopics } from '../controllers/staleTopicsController.js';

export const staleTopicsRoutes = Router();
staleTopicsRoutes.use(requireAuth);
staleTopicsRoutes.get('/', getStaleTopics);
