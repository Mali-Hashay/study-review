import { findWeekPlan } from '../repositories/weekRepository.js';

// One row per topic → one object per category, each with its topics
function groupByCategory(rows) {
  const categories = new Map();

  for (const row of rows) {
    if (!categories.has(row.category_id)) {
      categories.set(row.category_id, {
        id: row.category_id,
        name: row.category_name,
        dayOfWeek: row.day_of_week,
        topics: [],
      });
    }
    // A category with no active topics comes back as one row with topic_id = NULL (LEFT JOIN)
    if (row.topic_id === null) continue;

    categories.get(row.category_id).topics.push({
      id: row.topic_id,
      name: row.topic_name,
      reviewedThisWeek: row.reviewed_this_week,
      lastReviewedAt: row.last_reviewed_at,
    });
  }

  return [...categories.values()];
}

export async function getWeek(req, res) {
  const rows = await findWeekPlan(req.userId);
  res.json({ categories: groupByCategory(rows) });
}
