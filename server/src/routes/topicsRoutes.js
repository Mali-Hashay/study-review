import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { createTopicSchema, updateTopicSchema } from '../validators/topicsValidators.js';
import { listTopics, addTopic, editTopic, removeTopic } from '../controllers/topicsController.js';

// Mounted twice in app.js:
//   /api/categories/:categoryId/topics  → list / create topics of a category
//   /api/topics/:id                     → edit / delete a single topic
export const categoryTopicsRoutes = Router({ mergeParams: true });
categoryTopicsRoutes.use(requireAuth);
categoryTopicsRoutes.get('/', listTopics);
categoryTopicsRoutes.post('/', validate(createTopicSchema), addTopic);

export const topicsRoutes = Router();
topicsRoutes.use(requireAuth);
topicsRoutes.put('/:id', validate(updateTopicSchema), editTopic);
topicsRoutes.delete('/:id', removeTopic);
