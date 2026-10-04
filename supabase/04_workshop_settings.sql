-- ========================================================
-- 4. WORKSHOP SETTINGS TABLE & SEED DATA
-- ========================================================
-- Description: Stores workshop name, phone, address, working hours, and tolerance.
-- Run this in Supabase SQL Editor.

-- Table definition
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.workshop_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public read settings" ON public.workshop_settings;
DROP POLICY IF EXISTS "Admin write settings" ON public.workshop_settings;

-- Public can read workshop contact info and settings
CREATE POLICY "Public read settings"
  ON public.workshop_settings
  FOR SELECT
  USING (true);

-- Allow admins to update workshop settings
DROP POLICY IF EXISTS "Public write settings" ON public.workshop_settings;
CREATE POLICY "Public write settings"
  ON public.workshop_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- INITIAL SEED RECORD (Ensures ID 1 always exists)
INSERT INTO public.workshop_settings (
  id,
  workshop_name,
  tagline,
  phone,
  whatsapp,
  email,
  address,
  working_hours,
  active_bays,
  total_bays,
  iso_certified,
  standard_tolerance
)
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
ON CONFLICT (id) DO UPDATE SET
  workshop_name = EXCLUDED.workshop_name,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  working_hours = EXCLUDED.working_hours;
