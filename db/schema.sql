```sql
CREATE TABLE IF NOT EXISTS app_00bf_expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_00bf_expenses_user_id ON app_00bf_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_app_00bf_expenses_category ON app_00bf_expenses(category);

ALTER TABLE app_00bf_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY app_00bf_expenses_select ON app_00bf_expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY app_00bf_expenses_insert ON app_00bf_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY app_00bf_expenses_update ON app_00bf_expenses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY app_00bf_expenses_delete ON app_00bf_expenses FOR DELETE USING (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_00bf_expenses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_00bf_expenses;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS app_00bf_totals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_00bf_totals_user_id ON app_00bf_totals(user_id);

ALTER TABLE app_00bf_totals ENABLE ROW LEVEL SECURITY;

CREATE POLICY app_00bf_totals_select ON app_00bf_totals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY app_00bf_totals_insert ON app_00bf_totals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY app_00bf_totals_update ON app_00bf_totals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY app_00bf_totals_delete ON app_00bf_totals FOR DELETE USING (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_00bf_totals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_00bf_totals;
  END IF;
END $$;
```