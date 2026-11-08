function requireVar(name) {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Copy server/.env.example to server/.env and fill it in.',
    );
  }
  return value.trim();
}

function requireSecret(name, minLength) {
  const value = requireVar(name);
  if (value.length < minLength) {
    throw new Error(`"${name}" must be at least ${minLength} characters long.`);
  }
  return value;
}

function parsePort(raw) {
  const port = Number(raw ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535 (got "${raw}").`);
  }
  return port;
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parsePort(process.env.PORT),
  databaseUrl: requireVar('DATABASE_URL'),
  databaseSsl: process.env.DATABASE_SSL !== 'false',
  jwtSecret: requireSecret('JWT_SECRET', 32),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
  registrationCode: requireVar('REGISTRATION_CODE'),
});
