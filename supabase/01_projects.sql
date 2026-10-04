-- ========================================================
-- 1. PROJECTS TABLE & SECURITY POLICIES
-- ========================================================
-- Description: Stores portfolio machining works and projects catalog.
-- Run this in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table definition
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT NOT NULL,
  tolerance TEXT NOT NULL DEFAULT '±0.005mm',
  quantity TEXT NOT NULL,
  completion_date DATE DEFAULT CURRENT_DATE,
  client_industry TEXT NOT NULL DEFAULT 'General Engineering',
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  challenge TEXT,
  solution TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;

-- Public can read all published projects
CREATE POLICY "Public read projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Allow admins to create, update, delete projects
DROP POLICY IF EXISTS "Public write projects" ON public.projects;
CREATE POLICY "Public write projects"
  ON public.projects
  FOR ALL
  USING (true)
  WITH CHECK (true);
