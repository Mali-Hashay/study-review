import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool, query, withTransaction } from '../src/db/pool.js';

const SEED_FILE = path.join(import.meta.dirname, '..', 'db', 'seed.sql');

try {
  // count(*) is a bigint, which pg returns as a string; ::int makes it a number
  const { rows } = await query('SELECT count(*)::int AS count FROM categories');

  // Category names aren't UNIQUE, so running the seed twice would duplicate everything
  if (rows[0].count > 0) {
    console.log(' Categories already exist, skipping seed');
  } else {
    const sql = await readFile(SEED_FILE, 'utf8');
    await withTransaction((client) => client.query(sql));
    console.log(' Seed data inserted');
  }
} catch (err) {
  console.error(' Seed failed, nothing was inserted');
  console.error(`   ${err.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
