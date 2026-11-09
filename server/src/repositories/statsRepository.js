import { query } from '../db/pool.js';

export async function findTopicConfidence(userId) {
  const { rows } = await query(
    `SELECT t.id AS topic_id, t.name AS topic_name,
            ROUND(AVG(r.confidence), 1) AS avg_confidence,
            COUNT(r.id) AS review_count
     FROM review_logs r
     JOIN topics t ON r.topic_id = t.id
     WHERE r.user_id = $1 AND t.archived_at IS NULL
     GROUP BY t.id
     ORDER BY avg_confidence`,
    [userId],
  );
  return rows;
}
