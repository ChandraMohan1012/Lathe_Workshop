import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import PortfolioFilterableGrid from '@/components/PortfolioFilterableGrid';
import { getProjects, getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Portfolio & Machined Components Showcase | Erode',
  description: 'Explore precision turned brass bushings, agricultural submersible pump shafts, textile loom components, and custom lathe job works machined in Erode.',
  alternates: {
    canonical: '/portfolio',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PortfolioPage() {
  const projects = await getProjects();
  const settings = await getWorkshopSettings();

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow">
        {/* Header Section with thin line divider */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-2 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Portfolio</span>
            </div>

            <h1 className="font-display-xl text-3xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
              Machined Portfolio
            </h1>

            <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Precision turned brass bushings, textile machinery rollers, agricultural submersible pump shafts, and custom flanged couplings machined in our Erode workshop.
            </p>
          </div>
        </section>

        {/* Portfolio Masonry Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto">
            <PortfolioFilterableGrid
              initialProjects={projects}
              phone={settings.phone}
              whatsapp={settings.whatsapp}
            />
          </div>
        </section>

        <CtaBand
          title="Need a similar component machined?"
          subtitle="Send your component dimensions, raw material grade, or blueprint on WhatsApp for a fast quotation."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
