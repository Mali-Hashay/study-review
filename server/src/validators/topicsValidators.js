import { z } from 'zod';

const name = z.string('חובה למלא שם').trim().min(1, 'השם ריק').max(100, 'השם ארוך מדי');
const orderIndex = z.number('חובה למלא סדר').int().min(0, 'הסדר לא יכול להיות שלילי');

export const createTopicSchema = z.object({
  name,
  orderIndex: orderIndex.default(0),
});

export const updateTopicSchema = z.object({
  name,
  orderIndex,
});
