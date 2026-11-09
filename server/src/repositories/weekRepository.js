import { query } from '../db/pool.js';

export async function findWeekPlan(userId) {
  const { rows } = await query(
    `SELECT c.id AS category_id, c.name AS category_name, c.day_of_week,
            t.id AS topic_id, t.name AS topic_name,
            EXISTS (
              SELECT 1 FROM review_logs r
              WHERE r.topic_id = t.id
                AND r.user_id = $1
                AND r.reviewed_at >= current_week_start()
            ) AS reviewed_this_week
     FROM categories c
     LEFT JOIN topics t ON t.category_id = c.id AND t.archived_at IS NULL
     WHERE c.archived_at IS NULL
     ORDER BY c.day_of_week, c.order_index, t.order_index`,
    [userId],
  );
  return rows;
}
