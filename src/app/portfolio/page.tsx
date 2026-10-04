import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import PortfolioFilterableGrid from '@/components/PortfolioFilterableGrid';
import { getProjects, getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Machining Portfolio & Work Showcase | Erode',
  description: 'Explore Lathe Pattarai portfolio of precision turned brass bushings, agricultural submersible pump shafts, textile loom components, and custom lathe job works in Erode.',
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

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HEADER SECTION */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Machined Works <span className="text-primary italic font-editorial-accent">Catalog</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Precision turned brass bushings, textile machinery rollers, agricultural submersible pump shafts, and custom flanged couplings machined in our Erode facility.
            </p>
          </div>
        </section>

        {/* PORTFOLIO GRID WITH CATEGORY & MATERIAL FILTERS */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto">
            <PortfolioFilterableGrid initialProjects={projects} />
          </div>
        </section>

        <CtaBand
          title="Need Custom Lathe Job Work or Replacement Parts?"
          subtitle="Call or WhatsApp your drawing, sample part, or dimensions to get an instant quote."
          phone={settings.phone}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
