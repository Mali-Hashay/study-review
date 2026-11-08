import { pool } from '../src/db/pool.js';

function hintFor(err) {
  if (err.code === 'ENOTFOUND') return 'The host name in DATABASE_URL is wrong (check for typos).';
  if (err.code === '28P01') return 'Wrong database password in DATABASE_URL.';
  if (err.code === 'ETIMEDOUT' || /timeout/i.test(err.message))
    return 'Connection timed out. Make sure you used the "Session pooler" URL, not "Direct connection".';
  if (/error establishing an SSL connection/i.test(err.message))
    return 'Something on your network (e.g. a content filter or firewall) is blocking the database port.';
  if (/tenant or user not found/i.test(err.message))
    return 'The user part of the URL should look like "postgres.<project-ref>".';
  return null;
}

try {
  const { rows } = await pool.query(
    'SELECT current_database() AS database, now() AS server_time, version() AS version',
  );
  const { database, server_time: serverTime, version } = rows[0];

  console.log(' Connected to the database successfully');
  console.log(`   Database:    ${database}`);
  console.log(`   Server time: ${serverTime.toISOString()}`);
  console.log(`   Version:     ${version.split(' on ')[0]}`);
} catch (err) {
  console.error(' Could not connect to the database');
  console.error(`   ${err.message}`);
  const hint = hintFor(err);
  if (hint) console.error(`   Hint: ${hint}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
