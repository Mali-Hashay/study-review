-- No BEGIN/COMMIT here: migrate.js wraps each migration file in a transaction.

CREATE TABLE users (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          text        NOT NULL,
  email         text        NOT NULL,
  password_hash text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT users_name_not_blank CHECK (length(trim(name)) > 0),
  -- Lowercase only, so the UNIQUE check below is effectively case-insensitive
  CONSTRAINT users_email_lowercase CHECK (email = lower(email)),
  CONSTRAINT users_email_unique UNIQUE (email)
);
