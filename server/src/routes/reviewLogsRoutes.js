import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { createReviewLogSchema } from '../validators/reviewLogsValidators.js';
import { addReviewLog, removeThisWeekReviewLogs } from '../controllers/reviewLogsController.js';

export const topicReviewLogsRoutes = Router({ mergeParams: true });
topicReviewLogsRoutes.use(requireAuth);
topicReviewLogsRoutes.post('/', validate(createReviewLogSchema), addReviewLog);
topicReviewLogsRoutes.delete('/this-week', removeThisWeekReviewLogs);
