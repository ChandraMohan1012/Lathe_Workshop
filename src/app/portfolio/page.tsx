import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkCard from '@/components/WorkCard';
import CtaBand from '@/components/CtaBand';
import { getProjects, getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Machining Portfolio & Work Showcase',
  description: 'Explore Lathe Pattarai portfolio of precision turned brass components, heavy duty stainless steel drive shafts, and high-tolerance tool steel punch dies.',
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
              High-tolerance turned bushings, multi-start threaded brass sleeves, marine stepped drive shafts, and aerospace actuator collars produced in our Guindy SIDCO facility.
            </p>
          </div>
        </section>

        {/* PORTFOLIO GRID */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {projects.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          title="Have a Custom Mechanical Component Requirement?"
          subtitle="Upload your CAD drawings or technical blueprints to receive an exact itemized quotation and lead-time schedule."
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
