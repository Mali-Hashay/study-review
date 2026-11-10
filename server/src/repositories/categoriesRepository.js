import { query, withTransaction } from '../db/pool.js';

export async function findActiveCategories() {
  const { rows } = await query(
    `SELECT c.*, COUNT(t.id)::int AS topic_count
     FROM categories c
     LEFT JOIN topics t ON t.category_id = c.id AND t.archived_at IS NULL
     WHERE c.archived_at IS NULL
     GROUP BY c.id
     ORDER BY c.day_of_week, c.order_index`,
  );
  return rows;
}

export async function findActiveCategoryById(id) {
  const { rows } = await query(
    'SELECT * from categories WHERE id=$1 AND archived_at IS NULL',
    [id],
  );
  return rows[0];
}

export async function createCategory(name, description, dayOfWeek, orderIndex) {
  const { rows } = await query(
    'INSERT INTO categories(name,description,day_of_week,order_index) VALUES($1,$2,$3,$4) RETURNING *',
    [name, description, dayOfWeek, orderIndex],
  );
  return rows[0];
}

export async function updateCategory(id, name, description, dayOfWeek, orderIndex) {
  const { rows } = await query(
    'UPDATE categories SET name=$2, description=$3, day_of_week=$4, order_index=$5 WHERE id=$1 AND archived_at IS NULL RETURNING *',
    [id, name, description, dayOfWeek, orderIndex],
  );
  return rows[0];
}

export async function archiveCategory(id) {
  const { rows } = await query(
    'UPDATE categories SET archived_at=now() WHERE id=$1 AND archived_at IS NULL RETURNING *',
    [id],
  );
  return rows[0];
}

export async function categoryHasHistory(id) {
  const { rows } = await query(
    'SELECT review_logs.id FROM review_logs JOIN topics ON review_logs.topic_id = topics.id WHERE topics.category_id = $1 LIMIT 1',
    [id],
  );
  return rows.length > 0;
}

// Children first: foreign keys block deleting a category that still has topics,
// and a topic that still has tasks.
export async function deleteCategoryWithContent(id) {
  return withTransaction(async (client) => {
    await client.query(
      'DELETE FROM tasks WHERE topic_id IN (SELECT id FROM topics WHERE category_id = $1)',
      [id],
    );
    await client.query('DELETE FROM topics WHERE category_id = $1', [id]);
    const { rows } = await client.query(
      'DELETE FROM categories WHERE id = $1 AND archived_at IS NULL RETURNING *',
      [id],
    );
    return rows[0];
  });
}

export async function findArchivedCategories() {
  const { rows } = await query(
    'SELECT * FROM categories WHERE archived_at IS NOT NULL ORDER BY archived_at DESC',
  );
  return rows;
}

export async function restoreCategory(id) {
  const { rows } = await query(
    'UPDATE categories SET archived_at = NULL WHERE id = $1 AND archived_at IS NOT NULL RETURNING *',
    [id],
  );
  return rows[0];
}
