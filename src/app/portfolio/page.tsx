import { Metadata } from 'next';
import Link from 'next/link';
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
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {projects.map((project) => (
                  <WorkCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-space-2xl rounded-2xl border border-outline-variant/40 text-center flex flex-col items-center justify-center gap-space-md py-16">
                <span className="material-symbols-outlined text-5xl text-outline">precision_manufacturing</span>
                <h3 className="font-headline-sm text-xl uppercase tracking-tight text-on-surface">No Machined Works Cataloged Yet</h3>
                <p className="font-body-md text-sm text-on-surface-variant max-w-md">
                  Our engineering team is documenting recent batch productions. Contact our engineering desk to discuss your custom manufacturing specifications.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all"
                >
                  Request Custom Quote
                </Link>
              </div>
            )}
          </div>
        </section>

        <CtaBand
          title="Have a Custom Mechanical Component Requirement?"
          subtitle="Upload your CAD drawings or technical blueprints to receive an exact itemized quotation and lead-time schedule."
          phone={settings.phone}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
