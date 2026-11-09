-- Start of the current week: Sunday 00:00, Israel time.
-- date_trunc('week') starts weeks on Monday, so we shift by one day forward and back.
CREATE FUNCTION current_week_start() RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT (date_trunc('week', (now() AT TIME ZONE 'Asia/Jerusalem') + interval '1 day') - interval '1 day')
         AT TIME ZONE 'Asia/Jerusalem'
$$;
