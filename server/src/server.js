import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const server = app.listen(env.port, () => {
  console.log(`🚀 Server listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

// Graceful shutdown (Ctrl+C locally, SIGTERM on Render): finish in-flight requests, then close the DB pool
function shutdown(signal) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
