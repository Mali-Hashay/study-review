CREATE TABLE review_logs (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     integer     NOT NULL REFERENCES users (id),
  topic_id    integer     NOT NULL REFERENCES topics (id),
  -- Deleting a task keeps the log and just clears the link.
  -- The server checks that the task belongs to topic_id.
  task_id     integer              REFERENCES tasks (id) ON DELETE SET NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  confidence  smallint    NOT NULL,
  notes       text,

  CONSTRAINT review_logs_confidence_range CHECK (confidence BETWEEN 1 AND 5)
);

CREATE INDEX review_logs_user_reviewed_idx ON review_logs (user_id, reviewed_at);
CREATE INDEX review_logs_topic_idx ON review_logs (topic_id);
