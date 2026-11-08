import { HttpError } from '../utils/HttpError.js';
import { parseId } from '../utils/parseId.js';
import { findActiveTopicById } from '../repositories/topicsRepository.js';
import { findTasksByTopic, createTask, updateTask, deleteTask } from '../repositories/tasksRepository.js';

async function requireActiveTopic(topicId) {
  const topic = await findActiveTopicById(topicId);
  if (!topic) {
    throw new HttpError(404, 'הנושא לא נמצא');
  }
}

export async function listTasks(req, res) {
  const topicId = parseId(req.params.topicId);
  await requireActiveTopic(topicId);

  const tasks = await findTasksByTopic(topicId);
  res.json({ tasks });
}

export async function addTask(req, res) {
  const topicId = parseId(req.params.topicId);
  await requireActiveTopic(topicId);

  const task = await createTask(topicId, req.body, req.userId);
  res.status(201).json({ task });
}

export async function editTask(req, res) {
  const id = parseId(req.params.id);

  const task = await updateTask(id, req.body);
  if (!task) {
    throw new HttpError(404, 'המשימה לא נמצאה');
  }

  res.json({ task });
}

// Always a real delete: review_logs.task_id is ON DELETE SET NULL, so history is kept
export async function removeTask(req, res) {
  const id = parseId(req.params.id);

  const task = await deleteTask(id);
  if (!task) {
    throw new HttpError(404, 'המשימה לא נמצאה');
  }

  res.status(204).end();
}
