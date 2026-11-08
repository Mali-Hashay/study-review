CREATE TABLE categories (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text        NOT NULL,
  description text,
  day_of_week smallint    NOT NULL,              -- 1 = Sunday ... 5 = Thursday
  order_index integer     NOT NULL DEFAULT 0,
  archived_at timestamptz,                       -- NULL = active

  CONSTRAINT categories_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT categories_day_of_week_range CHECK (day_of_week BETWEEN 1 AND 5),
  CONSTRAINT categories_order_index_non_negative CHECK (order_index >= 0)
);

CREATE INDEX categories_day_order_idx ON categories (day_of_week, order_index);
