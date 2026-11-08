import { z } from 'zod';

const title = z.string('חובה למלא כותרת').trim().min(1, 'הכותרת ריקה').max(200, 'הכותרת ארוכה מדי');
const description = z.string('התיאור צריך להיות טקסט').trim().max(2000, 'התיאור ארוך מדי');
const type = z.enum(['review', 'exercise', 'project'], 'סוג המשימה אינו תקין');
const difficulty = z.enum(['easy', 'medium', 'hard'], 'רמת הקושי אינה תקינה');
// http/https only: a "javascript:" link would run code when clicked
const link = z
  .string('הקישור צריך להיות טקסט')
  .trim()
  .pipe(z.url({ protocol: /^https?$/, error: 'הקישור צריך להתחיל ב-http:// או https://' }));

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  type: type.default('review'),
  difficulty: difficulty.default('medium'),
  link: link.optional(),
});

export const updateTaskSchema = z.object({
  title,
  description: description.nullable(),
  type,
  difficulty,
  link: link.nullable(),
});
