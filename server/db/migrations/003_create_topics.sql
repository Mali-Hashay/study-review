CREATE TABLE topics (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id integer     NOT NULL REFERENCES categories (id),
  name        text        NOT NULL,
  order_index integer     NOT NULL DEFAULT 0,
  archived_at timestamptz,                       -- NULL = active

  CONSTRAINT topics_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT topics_order_index_non_negative CHECK (order_index >= 0)
);

-- PostgreSQL doesn't index foreign keys automatically; category_id comes first so this covers it
CREATE INDEX topics_category_order_idx ON topics (category_id, order_index);
