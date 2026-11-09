import { z } from 'zod';
import { HttpError } from '../utils/HttpError.js';
import { findStaleTopics } from '../repositories/reviewLogsRepository.js';

// Query string values are always strings ("14"), so coerce converts them to numbers
const daysSchema = z.coerce.number().int().min(1).max(365).default(14);

export async function getStaleTopics(req, res) {
  const result = daysSchema.safeParse(req.query.days);
  if (!result.success) {
    throw new HttpError(400, 'מספר הימים צריך להיות מספר שלם בין 1 ל-365');
  }

  const rows = await findStaleTopics(req.userId, result.data);
  const topics = rows.map((row) => ({
    id: row.topic_id,
    name: row.topic_name,
    categoryId: row.category_id,
    categoryName: row.category_name,
    dayOfWeek: row.day_of_week,
    lastReviewedAt: row.last_reviewed_at,
  }));

  res.json({ days: result.data, topics });
}
