import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getArchive,
  restoreArchivedCategory,
  restoreArchivedTopic,
} from '../controllers/archiveController.js';

export const archiveRoutes = Router();
archiveRoutes.use(requireAuth);
archiveRoutes.get('/', getArchive);
archiveRoutes.post('/categories/:id/restore', restoreArchivedCategory);
archiveRoutes.post('/topics/:id/restore', restoreArchivedTopic);
