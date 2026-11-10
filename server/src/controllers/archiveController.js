import { HttpError } from '../utils/HttpError.js';
import { parseId } from '../utils/parseId.js';
import { findArchivedCategories, restoreCategory } from '../repositories/categoriesRepository.js';
import {
  findArchivedTopics,
  restoreTopic,
  topicCategoryIsArchived,
} from '../repositories/topicsRepository.js';

export async function getArchive(req, res) {
  const [categories, topics] = await Promise.all([findArchivedCategories(), findArchivedTopics()]);
  res.json({
    categories: categories.map((row) => ({
      id: row.id,
      name: row.name,
      dayOfWeek: row.day_of_week,
      archivedAt: row.archived_at,
    })),
    topics: topics.map((row) => ({
      id: row.id,
      name: row.name,
      categoryName: row.category_name,
      categoryArchived: row.category_archived,
    })),
  });
}

export async function restoreArchivedCategory(req, res) {
  const id = parseId(req.params.id);
  const category = await restoreCategory(id);
  if (!category) {
    throw new HttpError(404, 'הקטגוריה לא נמצאה בארכיון');
  }
  res.json({ category });
}

export async function restoreArchivedTopic(req, res) {
  const id = parseId(req.params.id);
  if (await topicCategoryIsArchived(id)) {
    throw new HttpError(409, 'הקטגוריה של הנושא נמצאת בארכיון. צריך לשחזר אותה קודם.');
  }
  const topic = await restoreTopic(id);
  if (!topic) {
    throw new HttpError(404, 'הנושא לא נמצא בארכיון');
  }
  res.json({ topic });
}
