import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  // Supabase's certificate is signed by its own CA, which Node doesn't trust:
  // keep the connection encrypted but skip CA verification.
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Without this listener, a broken idle connection would crash the whole process
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

export function query(text, params = []) {
  return pool.query(text, params);
}

// A transaction must run on a single connection, so `fn` gets its own client:
// use client.query() inside it, not query().
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
