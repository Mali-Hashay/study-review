import { query, withTransaction } from '../db/pool.js';

export async function findActiveTopicsByCategory(categoryId) {
  const { rows } = await query(
    'SELECT * FROM topics WHERE category_id = $1 AND archived_at IS NULL ORDER BY order_index, id',
    [categoryId],
  );
  return rows;
}

export async function findActiveTopicById(id) {
  const { rows } = await query('SELECT * FROM topics WHERE id = $1 AND archived_at IS NULL', [id]);
  return rows[0];
}

export async function createTopic(categoryId, name, orderIndex) {
  const { rows } = await query(
    'INSERT INTO topics (category_id, name, order_index) VALUES ($1, $2, $3) RETURNING *',
    [categoryId, name, orderIndex],
  );
  return rows[0];
}

export async function updateTopic(id, name, orderIndex) {
  const { rows } = await query(
    'UPDATE topics SET name = $2, order_index = $3 WHERE id = $1 AND archived_at IS NULL RETURNING *',
    [id, name, orderIndex],
  );
  return rows[0];
}

export async function archiveTopic(id) {
  const { rows } = await query(
    'UPDATE topics SET archived_at = now() WHERE id = $1 AND archived_at IS NULL RETURNING *',
    [id],
  );
  return rows[0];
}

export async function topicHasHistory(id) {
  const { rows } = await query('SELECT id FROM review_logs WHERE topic_id = $1 LIMIT 1', [id]);
  return rows.length > 0;
}

export async function deleteTopicWithTasks(id) {
  return withTransaction(async (client) => {
    await client.query('DELETE FROM tasks WHERE topic_id = $1', [id]);
    const { rows } = await client.query(
      'DELETE FROM topics WHERE id = $1 AND archived_at IS NULL RETURNING *',
      [id],
    );
    return rows[0];
  });
}
