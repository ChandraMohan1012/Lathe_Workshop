# 🛠️ Lathe Pattarai - Precision Machining Workshop

**Lathe Pattarai** is a modern, high-precision web application built for a subtractive engineering and lathe machining workshop located in Guindy SIDCO Industrial Estate, Chennai.

Calibrated to **±0.005mm dimensional tolerance**, the application provides live shop floor bay telemetry, interactive component showcases, service catalogs, and an administrative portal for managing customer RFQs and active turning bays.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 + Custom Motion Keyframes
- **Backend / DB / Auth**: Supabase (`@supabase/supabase-js`) with offline mock fallback
- **Forms & Validation**: React Hook Form + Zod
- **SEO & Performance**: Next.js Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD schemas
- **Icons**: Material Symbols Outlined

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
│   │   ├── admin/           # Administrative portal (/admin, /admin/login, etc.)
│   │   ├── not-found.tsx    # Industrial-themed 404 page
│   │   ├── sitemap.ts       # Dynamic sitemap generator
│   │   └── robots.ts        # Search engine directives
│   ├── components/          # Shared UI components (Navbar, Footer, CtaBand, etc.)
│   ├── lib/                 # Supabase client & mock data
│   └── types/               # TypeScript interfaces
├── tailwind.config.js       # Tailwind CSS v3 configuration
└── next.config.mjs          # Next.js configuration
```

---

## ⚙️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Admin Portal Access
Navigate to `/admin/login` and use the access key:
- **Default Key**: `lathe2025` or `admin`

---

## 📄 License
Privately owned by Lathe Pattarai Precision Engineering, Guindy SIDCO Unit.
