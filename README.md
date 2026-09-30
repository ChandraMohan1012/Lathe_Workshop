# 🛠️ Lathe Pattarai - Precision Machining Workshop

**Lathe Pattarai** is a modern, high-precision web application built for a subtractive engineering and lathe machining workshop located in Guindy SIDCO Industrial Estate, Chennai.

Calibrated to **±0.005mm dimensional tolerance**, the application provides live shop floor bay telemetry, interactive component showcases, service catalogs, and an administrative portal for managing customer RFQs and active turning bays.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 + Custom Motion Keyframes
- **Backend / DB / Auth**: Supabase (`@supabase/ssr` + `@supabase/supabase-js`)
- **Authentication**: Supabase Auth Session Cookies via `@supabase/ssr` Middleware
- **Forms & Validation**: React Hook Form + Zod + Anti-spam honeypot
- **SEO & Performance**: Next.js Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD schemas
- **Icons**: Material Symbols Outlined

---

## 🔒 Security Architecture

- **Strict Row Level Security (RLS)**: Public read-only access for projects/telemetry; all write operations (insert, update, delete) are locked `TO authenticated` Supabase users (`auth.role() = 'authenticated'`).
- **Supabase SSR Middleware (`src/middleware.ts`)**: Route protection via `@supabase/ssr` `createServerClient`. Verifies `supabase.auth.getUser()` before permitting `/admin/*` navigation.
- **Client-Side Auth Client (`src/lib/supabase-browser.ts`)**: Admin write operations execute through `createSupabaseBrowserClient()`, passing authenticated session Bearer headers to satisfy RLS write policies.
- **Anti-Spam**: Honeypot protection on contact RFQ submittal forms.

---

## 📋 Teammate Deployment Checklist (Supabase & Vercel)

### 1. Supabase Database Schema
Run [`supabase/schema.sql`](file:///d:/Project/Lathe_Workshop/supabase/schema.sql) in your Supabase SQL Editor to provision tables, indexes, seed data, and `TO authenticated` RLS policies.

### 2. Disable Public Signups & Create Owner User
1. In Supabase Dashboard, go to **Authentication → Settings**.
2. **Disable "Allow new users to sign up"** (ensures arbitrary visitors cannot sign up and gain admin privileges).
3. Under **Authentication → Users**, manually click **"Add User"** to create the workshop owner email & password.

### 3. Storage Bucket Configuration
1. In Supabase Dashboard, go to **Storage → Buckets**.
2. Confirm or create a public bucket named `project-images`.

### 4. Vercel Environment Variables
Set the following environment variables in Vercel **Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_SITE_URL=https://lathepattarai.com
NEXT_PUBLIC_DEMO_MODE=true

NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

---

## ⚡ Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
npm run start
```
