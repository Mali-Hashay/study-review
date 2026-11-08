import { HttpError } from '../utils/HttpError.js';
import { parseId } from '../utils/parseId.js';
import { findActiveCategoryById } from '../repositories/categoriesRepository.js';
import {
  findActiveTopicsByCategory,
  createTopic,
  updateTopic,
  archiveTopic,
  topicHasHistory,
  deleteTopicWithTasks,
} from '../repositories/topicsRepository.js';

async function requireActiveCategory(categoryId) {
  const category = await findActiveCategoryById(categoryId);
  if (!category) {
    throw new HttpError(404, 'הקטגוריה לא נמצאה');
  }
}

export async function listTopics(req, res) {
  const categoryId = parseId(req.params.categoryId);
  await requireActiveCategory(categoryId);

  const topics = await findActiveTopicsByCategory(categoryId);
  res.json({ topics });
}

export async function addTopic(req, res) {
  const categoryId = parseId(req.params.categoryId);
  await requireActiveCategory(categoryId);

  const { name, orderIndex } = req.body;
  const topic = await createTopic(categoryId, name, orderIndex);
  res.status(201).json({ topic });
}

export async function editTopic(req, res) {
  const id = parseId(req.params.id);
  const { name, orderIndex } = req.body;

  const topic = await updateTopic(id, name, orderIndex);
  if (!topic) {
    throw new HttpError(404, 'הנושא לא נמצא');
  }

  res.json({ topic });
}

export async function removeTopic(req, res) {
  const id = parseId(req.params.id);
  const hasHistory = await topicHasHistory(id);

  const topic = hasHistory ? await archiveTopic(id) : await deleteTopicWithTasks(id);
  if (!topic) {
    throw new HttpError(404, 'הנושא לא נמצא');
  }

  res.json({ archived: hasHistory });
}
