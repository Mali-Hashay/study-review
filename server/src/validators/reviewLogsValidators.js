import { z } from 'zod';

export const createReviewLogSchema = z.object({
  confidence: z
    .number('חובה לבחור רמת ביטחון')
    .int('רמת הביטחון צריכה להיות מספר שלם')
    .min(1, 'רמת הביטחון צריכה להיות בין 1 ל-5')
    .max(5, 'רמת הביטחון צריכה להיות בין 1 ל-5'),
  taskId: z.number('מזהה המשימה צריך להיות מספר').int().positive().optional(),
  notes: z.string('ההערות צריכות להיות טקסט').trim().max(1000, 'ההערות ארוכות מדי').optional(),
});
