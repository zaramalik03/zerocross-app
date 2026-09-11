CREATE SEQUENCE IF NOT EXISTS public.dietary_preferences_id_seq OWNED BY public.dietary_preferences.id;
SELECT setval('public.dietary_preferences_id_seq', COALESCE((SELECT MAX(id) FROM public.dietary_preferences), 0) + 1, false);
ALTER TABLE public.dietary_preferences ALTER COLUMN id SET DEFAULT nextval('public.dietary_preferences_id_seq');
GRANT USAGE, SELECT ON SEQUENCE public.dietary_preferences_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.dietary_preferences_id_seq TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dietary_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_allergens TO authenticated;
CREATE UNIQUE INDEX IF NOT EXISTS dietary_preferences_user_diet_key ON public.dietary_preferences (user_id, diet_id);