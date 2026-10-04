-- ========================================================
-- 3. CUSTOMER ENQUIRIES (RFQS) TABLE & POLICIES
-- ========================================================
-- Description: Stores customer quotation requests and project specifications.
-- Run this in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table definition
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin manage enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public update enquiries" ON public.enquiries;

-- 1. Public customers can submit RFQ quote requests
CREATE POLICY "Public insert enquiries"
  ON public.enquiries
  FOR INSERT
  WITH CHECK (true);

-- 2. Allow reading enquiries so that Admin Dashboard and RFQ management can display them
CREATE POLICY "Public read enquiries"
  ON public.enquiries
  FOR SELECT
  USING (true);

-- 3. Allow updating enquiry status (e.g. 'In Review', 'Quoted', 'Closed')
CREATE POLICY "Public update enquiries"
  ON public.enquiries
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. Authenticated admins have full management permissions
CREATE POLICY "Admin manage enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
