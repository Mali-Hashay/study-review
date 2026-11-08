import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validators/tasksValidators.js';
import { listTasks, addTask, editTask, removeTask } from '../controllers/tasksController.js';

// Same two-router pattern as topicsRoutes.js
export const topicTasksRoutes = Router({ mergeParams: true });
topicTasksRoutes.use(requireAuth);
topicTasksRoutes.get('/', listTasks);
topicTasksRoutes.post('/', validate(createTaskSchema), addTask);

export const tasksRoutes = Router();
tasksRoutes.use(requireAuth);
tasksRoutes.put('/:id', validate(updateTaskSchema), editTask);
tasksRoutes.delete('/:id', removeTask);
