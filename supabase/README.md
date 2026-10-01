# Supabase SQL Queries Guide

Idhula ella database tables matrum policies separate files-ah pirichi kuduthurukkom:

| File | Purpose | Description |
|---|---|---|
| [`01_projects.sql`](./01_projects.sql) | **Projects Catalog** | Portfolio works, technical specs (JSONB), tolerance, RLS policies |
| [`02_live_jobs.sql`](./02_live_jobs.sql) | **Live Turning Bays** | Bay telemetry, job progress %, status, seed data for 4 bays |
| [`03_enquiries.sql`](./03_enquiries.sql) | **Customer RFQs** | Public quote requests, drawing uploads, admin review status |
| [`04_workshop_settings.sql`](./04_workshop_settings.sql) | **Workshop Settings** | Phone, WhatsApp, address, working hours, tolerance + initial seed record |
| [`05_storage_bucket.sql`](./05_storage_bucket.sql) | **Storage Bucket** | `project-images` bucket creation & photo upload permissions |
| [`schema.sql`](./schema.sql) | **All-in-One** | Ella scripts-aiyum ore stretch-la run panna use aagum |

---

### How to Execute in Supabase:
1. Open [Supabase Dashboard](https://supabase.com/dashboard) -> Select your project.
2. Left navigation-la **SQL Editor** (`>_`) open pannunga.
3. Melirukura files-ah `01` la irundhu `05` varaikum oru oru file-ah open panni paste pannitu **Run** click pannunga.
