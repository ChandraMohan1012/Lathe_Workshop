-- ========================================================
-- LATHE PATTARAI WORKSHOP - STRICT SUPABASE SECURITY SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT NOT NULL,
  tolerance TEXT NOT NULL DEFAULT '±0.005mm',
  quantity TEXT NOT NULL,
  completion_date DATE DEFAULT CURRENT_DATE,
  client_industry TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  challenge TEXT,
  solution TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LIVE JOBS TABLE (BAY TELEMETRY)
CREATE TABLE IF NOT EXISTS public.live_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bay_number TEXT NOT NULL,
  job_title TEXT NOT NULL,
  material TEXT NOT NULL,
  tolerance TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Setup Phase', 'Quality Check', 'Completed')),
  started_time TEXT NOT NULL,
  estimated_completion TEXT NOT NULL,
  technician TEXT NOT NULL,
  part_reference TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENQUIRIES TABLE (CUSTOMER RFQS)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  drawing_url TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Review', 'Quoted', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKSHOP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.workshop_settings (
  id INT PRIMARY KEY DEFAULT 1,
  workshop_name TEXT NOT NULL DEFAULT 'Lathe Pattarai',
  tagline TEXT NOT NULL DEFAULT 'Precision Machining & Subtractive Tooling Workshop',
  phone TEXT NOT NULL DEFAULT '+91 98400 12345',
  whatsapp TEXT NOT NULL DEFAULT '+91 98400 12345',
  email TEXT NOT NULL DEFAULT 'quotations@lathepattarai.com',
  address TEXT NOT NULL DEFAULT 'Plot 14-B, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu 600032',
  working_hours TEXT NOT NULL DEFAULT 'Mon - Sat: 8:30 AM - 7:30 PM',
  active_bays INT NOT NULL DEFAULT 14,
  total_bays INT NOT NULL DEFAULT 16,
  iso_certified BOOLEAN NOT NULL DEFAULT true,
  standard_tolerance TEXT NOT NULL DEFAULT '±0.005mm',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_settings ENABLE ROW LEVEL SECURITY;

-- DROP OLD POLICIES
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Public read live_jobs" ON public.live_jobs;
DROP POLICY IF EXISTS "Public read settings" ON public.workshop_settings;
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
DROP POLICY IF EXISTS "Admin write live_jobs" ON public.live_jobs;
DROP POLICY IF EXISTS "Admin write enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin write settings" ON public.workshop_settings;

-- 1. PUBLIC READ POLICIES
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read live_jobs" ON public.live_jobs FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.workshop_settings FOR SELECT USING (true);

-- 2. PUBLIC RFQ INSERTION (CUSTOMER ENQUIRIES ONLY)
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- 3. STRICT AUTHENTICATED WRITE POLICIES (ADMIN ONLY)
CREATE POLICY "Admin write projects" ON public.projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write live_jobs" ON public.live_jobs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage enquiries" ON public.enquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin write settings" ON public.workshop_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. SUPABASE STORAGE POLICIES FOR 'project-images' BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload project images" ON storage.objects;

CREATE POLICY "Public read project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated upload project images" ON storage.objects
  FOR ALL TO authenticated WITH CHECK (bucket_id = 'project-images');

-- INITIAL SEED DATA FOR WORKSHOP SETTINGS
INSERT INTO public.workshop_settings (id, workshop_name, tagline, phone, whatsapp, email, address, working_hours, active_bays, total_bays, iso_certified, standard_tolerance)
VALUES (
  1,
  'Lathe Pattarai',
  'Precision Machining & Subtractive Tooling Workshop',
  '+91 98400 12345',
  '+91 98400 12345',
  'quotations@lathepattarai.com',
  'Plot 14-B, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu 600032',
  'Mon - Sat: 8:30 AM - 7:30 PM',
  14,
  16,
  true,
  '±0.005mm'
)
ON CONFLICT (id) DO NOTHING;
