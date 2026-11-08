import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoriesValidators.js';
import {
  listCategories,
  addCategory,
  editCategory,
  removeCategory,
} from '../controllers/categoriesController.js';

export const categoriesRoutes = Router();

categoriesRoutes.use(requireAuth);

categoriesRoutes.get('/', listCategories);
categoriesRoutes.post('/', validate(createCategorySchema), addCategory);
categoriesRoutes.put('/:id', validate(updateCategorySchema), editCategory);
categoriesRoutes.delete('/:id', removeCategory);
