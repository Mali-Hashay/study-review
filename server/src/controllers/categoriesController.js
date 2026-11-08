import { HttpError } from '../utils/HttpError.js';
import { parseId } from '../utils/parseId.js';
import {
  findActiveCategories,
  createCategory,
  updateCategory,
  archiveCategory,
  categoryHasHistory,
  deleteCategoryWithContent,
} from '../repositories/categoriesRepository.js';

export async function listCategories(req, res) {
  const categories = await findActiveCategories();
  res.json({ categories });
}

export async function addCategory(req, res) {
  const { name, description, dayOfWeek, orderIndex } = req.body;
  const category = await createCategory(name, description, dayOfWeek, orderIndex);
  res.status(201).json({ category });
}

export async function editCategory(req, res) {
  const id = parseId(req.params.id);
  const { name, description, dayOfWeek, orderIndex } = req.body;

  const category = await updateCategory(id, name, description, dayOfWeek, orderIndex);
  if (!category) {
    throw new HttpError(404, 'הקטגוריה לא נמצאה');
  }

  res.json({ category });
}

export async function removeCategory(req, res) {
  const id = parseId(req.params.id);
  const hasHistory = await categoryHasHistory(id);

  const category = hasHistory ? await archiveCategory(id) : await deleteCategoryWithContent(id);
  if (!category) {
    throw new HttpError(404, 'הקטגוריה לא נמצאה');
  }

  res.json({ archived: hasHistory });
}
