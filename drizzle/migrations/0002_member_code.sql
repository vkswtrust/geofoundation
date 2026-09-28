CREATE SEQUENCE IF NOT EXISTS public.member_code_seq START 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS member_code text UNIQUE;
UPDATE public.profiles p SET member_code = 'GPC' || lpad(nextval('public.member_code_seq')::text, 3, '0')
FROM (SELECT id FROM public.profiles WHERE member_code IS NULL ORDER BY created_at) s WHERE p.id = s.id;
UPDATE public.profiles SET avatar_url = NULL;
ALTER TABLE public.profiles ALTER COLUMN member_code SET DEFAULT ('GPC' || lpad(nextval('public.member_code_seq')::text, 3, '0'));
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;