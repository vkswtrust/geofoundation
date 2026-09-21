-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile readable" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile upsert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enquiries (all form submissions)
CREATE TYPE public.enquiry_kind AS ENUM (
  'general', 'volunteer', 'foster', 'adoption', 'csr', 'sponsorship', 'contact'
);
CREATE TYPE public.enquiry_status AS ENUM ('new', 'in_progress', 'closed');

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.enquiry_kind NOT NULL,
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  organisation text,
  contact_person text,
  interest text,
  roles text[],
  amount numeric,
  animal_id uuid,
  subject text,
  message text,
  status public.enquiry_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own enquiries readable" ON public.enquiries FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "authenticated can submit" ON public.enquiries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Adoption animals
CREATE TYPE public.animal_status AS ENUM ('available', 'adopted', 'fostered');

CREATE TABLE public.animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text,
  age text,
  gender text,
  location text,
  rescue_story text,
  health_status text,
  vaccination_status text,
  sterilization_status text,
  behaviour text,
  description text,
  geopet_id text UNIQUE,
  photo_urls text[] NOT NULL DEFAULT '{}',
  status public.animal_status NOT NULL DEFAULT 'available',
  is_public boolean NOT NULL DEFAULT true,
  sponsor_info text,
  recovery_timeline text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.animals TO authenticated;
GRANT ALL ON public.animals TO service_role;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public animals readable" ON public.animals FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "admins manage animals" ON public.animals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Donation / payment settings (single row, initially empty)
CREATE TABLE public.donation_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  account_name text,
  bank_name text,
  bank_address text,
  account_number text,
  ifsc_code text,
  upi_id text,
  qr_image_url text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.donation_settings TO authenticated;
GRANT ALL ON public.donation_settings TO service_role;
ALTER TABLE public.donation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "donation settings readable" ON public.donation_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins write donation settings" ON public.donation_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.donation_settings (id) VALUES (true);

-- Impact statistics (admin entered, empty by default)
CREATE TABLE public.impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  value bigint,
  display_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT ALL ON public.impact_stats TO service_role;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "impact stats readable" ON public.impact_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins write impact stats" ON public.impact_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Donations recorded by admin only (no invented records)
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text,
  donor_phone text,
  amount numeric NOT NULL,
  method text,
  reference text,
  purpose text,
  received_on date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage donations" ON public.donations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));