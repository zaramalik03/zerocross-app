GRANT SELECT ON public.meals TO anon, authenticated;
GRANT ALL ON public.meals TO service_role;

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.meal_plans TO anon, authenticated;
GRANT ALL ON public.meal_plans TO service_role;

DROP POLICY IF EXISTS "Anyone can view meal plan items" ON public.meal_plans;
CREATE POLICY "Anyone can view meal plan items"
ON public.meal_plans FOR SELECT USING (true);