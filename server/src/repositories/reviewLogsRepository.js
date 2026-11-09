import { query } from '../db/pool.js';

export async function createReviewLog(userId, topicId, taskId, confidence, notes) {
  const { rows } = await query(
    'INSERT INTO review_logs (user_id, topic_id, task_id, confidence, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, topicId, taskId, confidence, notes],
  );
  return rows[0];
}

// Active topics this user hasn't reviewed in `days` days, including topics never reviewed
export async function findStaleTopics(userId, days) {
  const { rows } = await query(
    `SELECT t.id AS topic_id, t.name AS topic_name,
            c.id AS category_id, c.name AS category_name, c.day_of_week,
            last.last_reviewed_at
     FROM topics t
     JOIN categories c ON c.id = t.category_id
     LEFT JOIN (
       SELECT MAX(reviewed_at) AS last_reviewed_at, topic_id
       FROM review_logs
       WHERE user_id = $1
       GROUP BY topic_id
     ) last ON last.topic_id = t.id
     WHERE t.archived_at IS NULL
       AND c.archived_at IS NULL
       AND (last.last_reviewed_at IS NULL OR last.last_reviewed_at < now() - make_interval(days => $2))
     ORDER BY last.last_reviewed_at NULLS FIRST, c.day_of_week, t.order_index`,
    [userId, days],
  );
  return rows;
}

export async function deleteThisWeekReviewLogs(userId, topicId) {
  const { rows } = await query(
    'DELETE FROM review_logs WHERE user_id = $1 AND topic_id = $2 AND reviewed_at>=current_week_start() RETURNING id',
    [userId, topicId],
  );
  return rows.length;
}
