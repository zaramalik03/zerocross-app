DELETE FROM public.dietary_preferences;
ALTER TABLE public.dietary_preferences
  ALTER COLUMN user_id TYPE uuid USING NULL,
  ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.dietary_preferences
  ADD CONSTRAINT dietary_preferences_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS dietary_preferences_user_diet_key
  ON public.dietary_preferences (user_id, diet_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_allergens_user_allergen_key
  ON public.user_allergens (user_id, allergen_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_allergens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dietary_preferences TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.allergens TO anon, authenticated;
GRANT SELECT ON public.diets TO anon, authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_allergens TO service_role;
GRANT ALL ON public.dietary_preferences TO service_role;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietary_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own row" ON public.users;
CREATE POLICY "Users manage own row" ON public.users
  FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users manage own allergens" ON public.user_allergens;
CREATE POLICY "Users manage own allergens" ON public.user_allergens
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own diets" ON public.dietary_preferences;
CREATE POLICY "Users manage own diets" ON public.dietary_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_dietary_preferences_updated_at ON public.dietary_preferences;
CREATE TRIGGER set_dietary_preferences_updated_at BEFORE UPDATE ON public.dietary_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_user_allergens_updated_at ON public.user_allergens;
CREATE TRIGGER set_user_allergens_updated_at BEFORE UPDATE ON public.user_allergens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();