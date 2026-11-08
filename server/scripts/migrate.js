import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool, query, withTransaction } from '../src/db/pool.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '..', 'db', 'migrations');

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   text        PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedMigrations() {
  const { rows } = await query('SELECT filename FROM schema_migrations');
  return new Set(rows.map((row) => row.filename));
}

async function getMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR);
  // Zero-padded numbers (001, 002...) make alphabetical order = run order
  return files.filter((file) => file.endsWith('.sql')).sort();
}

// The migration and its record in schema_migrations share one transaction,
// so a failed file leaves no trace and is retried on the next run.
async function runMigration(filename) {
  const sql = await readFile(path.join(MIGRATIONS_DIR, filename), 'utf8');

  await withTransaction(async (client) => {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
  });
}

try {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const pending = (await getMigrationFiles()).filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log(' Database is up to date, nothing to run');
  }

  for (const filename of pending) {
    await runMigration(filename);
    console.log(` Applied ${filename}`);
  }
} catch (err) {
  console.error(' Migration failed, nothing from the failing file was applied');
  console.error(`   ${err.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
