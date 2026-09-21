CREATE POLICY "authenticated read animal photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'animal-photos');
CREATE POLICY "admins manage animal photos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'animal-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'animal-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "authenticated read site assets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-assets');
CREATE POLICY "admins manage site assets" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));