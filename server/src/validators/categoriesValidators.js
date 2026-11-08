import { z } from 'zod';

const name = z.string('חובה למלא שם').trim().min(1, 'השם ריק').max(100, 'השם ארוך מדי');
const description = z.string('התיאור צריך להיות טקסט').trim().max(500, 'התיאור ארוך מדי');
const dayOfWeek = z
  .number('חובה לבחור יום')
  .int('היום צריך להיות מספר שלם')
  .min(1, 'היום צריך להיות בין ראשון לחמישי')
  .max(5, 'היום צריך להיות בין ראשון לחמישי');
const orderIndex = z.number('חובה למלא סדר').int().min(0, 'הסדר לא יכול להיות שלילי');

export const createCategorySchema = z.object({
  name,
  description: description.optional(),
  dayOfWeek,
  // The table's DEFAULT doesn't apply when we explicitly send NULL, so default it here
  orderIndex: orderIndex.default(0),
});

// Full update: every field must be sent. description may be null to clear it.
export const updateCategorySchema = z.object({
  name,
  description: description.nullable(),
  dayOfWeek,
  orderIndex,
});
