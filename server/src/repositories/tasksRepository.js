import { query } from '../db/pool.js';

export async function findTasksByTopic(topicId) {
  const { rows } = await query('SELECT * FROM tasks WHERE topic_id = $1 ORDER BY id', [topicId]);
  return rows;
}

export async function taskBelongsToTopic(taskId, topicId) {
  const { rows } = await query(
    'SELECT id FROM tasks WHERE id = $1 AND topic_id = $2',
    [taskId, topicId],
  );
  return rows.length > 0;
}

export async function createTask(topicId, { title, description, type, difficulty, link }, createdBy) {
  const { rows } = await query(
    `INSERT INTO tasks (topic_id, title, description, type, difficulty, link, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [topicId, title, description, type, difficulty, link, createdBy],
  );
  return rows[0];
}

export async function updateTask(id, { title, description, type, difficulty, link }) {
  const { rows } = await query(
    `UPDATE tasks
     SET title = $2, description = $3, type = $4, difficulty = $5, link = $6
     WHERE id = $1
     RETURNING *`,
    [id, title, description, type, difficulty, link],
  );
  return rows[0];
}

export async function deleteTask(id) {
  const { rows } = await query(
    'DELETE FROM tasks WHERE id = $1 RETURNING *',
    [id],
  );
  return rows[0];
}
