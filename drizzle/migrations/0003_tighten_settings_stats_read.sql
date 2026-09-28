DROP POLICY IF EXISTS "donation settings readable" ON public.donation_settings;
CREATE POLICY "donation settings readable" ON public.donation_settings FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL AND id = true);
DROP POLICY IF EXISTS "impact stats readable" ON public.impact_stats;
CREATE POLICY "impact stats readable" ON public.impact_stats FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL AND value IS NOT NULL);