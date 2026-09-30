# 🛠️ Lathe Pattarai - Precision Machining Workshop

**Lathe Pattarai** is a modern, high-precision web application built for a subtractive engineering and lathe machining workshop located in Guindy SIDCO Industrial Estate, Chennai.

Calibrated to **±0.005mm dimensional tolerance**, the application provides live shop floor bay telemetry, interactive component showcases, service catalogs, and an administrative portal for managing customer RFQs and active turning bays.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 + Custom Motion Keyframes
- **Backend / DB / Auth**: Supabase (`@supabase/supabase-js`) with RLS and offline mock fallback
- **Authentication**: Next.js Secure Middleware + HTTP-Only Session Cookies (`lathe_admin_session`)
- **Forms & Validation**: React Hook Form + Zod + Anti-spam honeypot
- **SEO & Performance**: Next.js Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD schemas
- **Icons**: Material Symbols Outlined

---

## 🔒 Security Features

- **Route Guarding**: All `/admin` endpoints (dashboard, works, RFQ enquiries, settings) are protected via Next.js Middleware (`src/middleware.ts`).
- **HTTP-Only Cookies**: Authentication tokens are stored in secure HTTP-only cookies (`lathe_admin_session`) rather than client-side `localStorage`.
- **Environment Key Override**: Admin passkey can be configured via environment variable (`ADMIN_SECRET_KEY`).
- **Anti-Spam**: Contact form includes automated bot honeypot protection.

---

## 📂 Project Structure

```
Lathe_Workshop/
├── public/
│   └── images/              # Local visual assets & component photos
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home page (/)
│   │   ├── portfolio/       # Portfolio showcase (/portfolio, /portfolio/[slug])
│   │   ├── services/        # Services catalog (/services)
│   │   ├── ongoing/         # Live workshop bay tracker (/ongoing)
│   │   ├── about/           # Heritage & facility (/about)
│   │   ├── contact/         # Request for Quotation RFQ form (/contact)
│   │   ├── admin/           # Administrative portal (/admin, /admin/work, etc.)
│   │   │   └── login/       # Protected admin login
│   │   ├── api/             # API routes (/api/admin/login, /api/admin/logout)
│   │   ├── not-found.tsx    # Industrial-themed 404 page
│   │   ├── sitemap.ts       # Dynamic sitemap generator
│   │   └── robots.ts        # Search engine directives
│   ├── components/          # Shared UI components (Navbar, Footer, CtaBand, etc.)
│   ├── lib/                 # Supabase client, auth verification, & mock data
│   ├── middleware.ts        # Route guard middleware for /admin
│   └── types/               # TypeScript interfaces
├── supabase/
│   └── schema.sql           # Database tables, policies, & initial seed data
├── tailwind.config.js       # Tailwind CSS v3 configuration
└── next.config.mjs          # Next.js configuration
```

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://lathepattarai.com
NEXT_PUBLIC_DEMO_MODE=true

# Admin Authentication
ADMIN_SECRET_KEY=your_secure_admin_passkey

# Supabase Database & Auth (Optional for live DB)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🛠️ Database Setup (Supabase)

Run the SQL statements provided in [`supabase/schema.sql`](file:///d:/Project/Lathe_Workshop/supabase/schema.sql) in your Supabase SQL Editor. This sets up the `projects`, `live_jobs`, `enquiries`, and `workshop_settings` tables along with Row Level Security (RLS) policies.

---

## ⚡ Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm run start
```
