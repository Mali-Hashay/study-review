import { query } from '../db/pool.js';

export async function findUserByEmail(email) {
  const {rows} = await query('SELECT * FROM users WHERE email = $1',[email]);
  return rows[0];
}

export async function findUserById(id) {
  const { rows } = await query(
    'SELECT id, name, email,created_at FROM users WHERE id = $1',
    [id],
  );
  return rows[0];
}

export async function createUser(name, email, passwordHash) {
    const {rows} = await query('INSERT INTO users(name, email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,created_at', [name, email, passwordHash]);
    return rows[0];
}
