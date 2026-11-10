import { query, withTransaction } from '../db/pool.js';

export async function findActiveTopicsByCategory(categoryId) {
  const { rows } = await query(
    `SELECT t.*, COUNT(ta.id)::int AS task_count
     FROM topics t
     LEFT JOIN tasks ta ON t.id = ta.topic_id
     WHERE t.category_id = $1 AND t.archived_at IS NULL
     GROUP BY t.id
     ORDER BY t.order_index, t.id`,
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

export async function findArchivedTopics() {
  const { rows } = await query(
    `SELECT t.id, t.name, c.name AS category_name,
            c.archived_at IS NOT NULL AS category_archived
     FROM topics t
     JOIN categories c ON c.id = t.category_id
     WHERE t.archived_at IS NOT NULL
     ORDER BY t.archived_at DESC`,
  );
  return rows;
}

// A restored topic would stay hidden if its category is still archived
export async function topicCategoryIsArchived(id) {
  const { rows } = await query(
    `SELECT c.archived_at IS NOT NULL AS archived
     FROM topics t
     JOIN categories c ON c.id = t.category_id
     WHERE t.id = $1`,
    [id],
  );
  return rows[0]?.archived ?? false;
}

export async function restoreTopic(id) {
  const { rows } = await query(
    'update topics set archived_at = null where id = $1 and archived_at IS not null returning *',
    [id],
  );
  return rows[0];
}
