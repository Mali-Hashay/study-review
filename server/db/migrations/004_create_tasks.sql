CREATE TABLE tasks (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic_id    integer NOT NULL REFERENCES topics (id),
  title       text    NOT NULL,
  description text,
  type        text    NOT NULL DEFAULT 'review',
  difficulty  text    NOT NULL DEFAULT 'medium',
  link        text,                              -- URL format is validated by the server
  created_by  integer NOT NULL REFERENCES users (id),

  CONSTRAINT tasks_title_not_blank CHECK (length(trim(title)) > 0),
  CONSTRAINT tasks_type_valid       CHECK (type IN ('review', 'exercise', 'project')),
  CONSTRAINT tasks_difficulty_valid CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE INDEX tasks_topic_idx ON tasks (topic_id);
