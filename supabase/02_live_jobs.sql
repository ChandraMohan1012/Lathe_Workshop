-- ========================================================
-- 2. LIVE JOBS TABLE (BAY TELEMETRY) & POLICIES
-- ========================================================
-- Description: Tracks real-time machine bay operations, tolerance & progress.
-- Run this in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table definition
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.live_jobs ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public read live_jobs" ON public.live_jobs;
DROP POLICY IF EXISTS "Admin write live_jobs" ON public.live_jobs;

-- Public can view live workshop bays status
CREATE POLICY "Public read live_jobs"
  ON public.live_jobs
  FOR SELECT
  USING (true);

-- Allow admins to update progress and jobs
DROP POLICY IF EXISTS "Public write live_jobs" ON public.live_jobs;
CREATE POLICY "Public write live_jobs"
  ON public.live_jobs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- OPTIONAL SEED DATA: Initial Active Machine Bays
INSERT INTO public.live_jobs (bay_number, job_title, material, tolerance, progress, status, started_time, estimated_completion, technician, part_reference)
VALUES
  ('BAY 01', 'Hydraulics Flange Shaft Turning', 'SS 316L', '±0.005mm', 78, 'In Progress', '08:30 AM', '04:30 PM Today', 'M. Kumar', 'LPS-FLG-316L-092'),
  ('BAY 03', 'Brass Threaded Sleeve Batch Run', 'Brass CW614N', '±0.008mm', 45, 'In Progress', '10:15 AM', '06:00 PM Today', 'R. Selvam', 'LPS-BRS-THD-441'),
  ('BAY 05', 'Heavy Lathe Chucking - 95mm Shaft', 'EN24 Hardened Steel', '±0.010mm', 92, 'Quality Check', '07:00 AM', '02:15 PM Today', 'S. Venkatesh', 'LPS-SHT-EN24-118'),
  ('BAY 08', 'Automotive Bearing Bush Retooling', 'Phosphor Bronze', '±0.005mm', 15, 'Setup Phase', '01:00 PM', 'Tomorrow 11:00 AM', 'K. Anand', 'LPS-BRG-PBZ-003')
ON CONFLICT DO NOTHING;
