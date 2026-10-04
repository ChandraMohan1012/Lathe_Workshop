import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import { getProjectBySlug, getProjects, getWorkshopSettings } from '@/lib/supabase';
import WorkCard from '@/components/WorkCard';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Technical Specification`,
    description: project.description,
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PortfolioDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const settings = await getWorkshopSettings();
  const relatedProjects = allProjects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* Breadcrumb strip */}
        <section className="w-full bg-surface-container-low px-gutter py-space-sm border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm font-label-technical text-xs uppercase tracking-widest text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-primary transition-colors">PORTFOLIO</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold truncate max-w-xs">{project.slug}</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>CALIBRATED SPECS</span>
              <span>•</span>
              <span className="text-primary font-semibold">{project.tolerance}</span>
            </div>
          </div>
        </section>

        {/* HERO PROJECT HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <h1 className="font-display-xl text-display-xl-mobile sm:text-headline-lg text-on-surface uppercase tracking-tight">
                {project.title}
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {project.description}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-space-md border-t border-outline-variant/30 font-label-technical text-xs uppercase tracking-wider">
                <div>
                  <span className="text-on-surface-variant block">Material Grade</span>
                  <span className="font-semibold text-on-surface text-sm block mt-0.5">{project.material}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Tolerance Standard</span>
                  <span className="font-semibold text-primary text-sm block mt-0.5">{project.tolerance}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Batch Size</span>
                  <span className="font-semibold text-on-surface text-sm block mt-0.5">{project.quantity}</span>
                </div>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-outline-variant/60">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED TECHNICAL SPECIFICATIONS & CASE STUDY */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-2xl">
            {/* Main Details */}
            <div className="lg:col-span-8 flex flex-col gap-space-2xl">
              {/* Engineering Specs Table */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant/50 flex flex-col gap-space-md">
                <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface flex items-center gap-2 border-b border-outline-variant/40 pb-3">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                  Calibrated Engineering Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {project.specs.map((spec, idx) => (
                    <div key={idx} className="flex flex-col p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
                      <span className="font-label-technical text-xs text-on-surface-variant uppercase tracking-wider">{spec.label}</span>
                      <span className="font-headline-sm text-sm text-on-surface font-semibold mt-1">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution */}
              {project.challenge && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col gap-2">
                    <h4 className="font-headline-sm text-base uppercase text-error flex items-center gap-2">
                      <span className="material-symbols-outlined">warning</span>
                      Machining Challenge
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant mt-1">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col gap-2">
                    <h4 className="font-headline-sm text-base uppercase text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined">verified</span>
                      Tooling Solution
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant mt-1">
                      {project.solution}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              <div className="bg-surface-container-high p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col gap-space-md">
                <h4 className="font-headline-sm text-base uppercase tracking-tight text-on-surface">
                  Client & Lead Specs
                </h4>
                <div className="flex flex-col gap-3 font-label-technical text-xs text-on-surface-variant uppercase">
                  <div className="flex justify-between pb-2 border-b border-outline-variant/30">
                    <span>Industry Sector:</span>
                    <span className="font-semibold text-on-surface">{project.clientIndustry}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-outline-variant/30">
                    <span>Completion Date:</span>
                    <span className="font-semibold text-on-surface">{project.completionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Standard:</span>
                    <span className="font-semibold text-primary">Micrometer Verified</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full text-center py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all mt-2"
                >
                  Quote Similar Job
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <section className="w-full bg-surface-container-low px-gutter py-space-2xl border-t border-outline-variant/30">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <h3 className="font-display-xl text-headline-md uppercase tracking-tight text-on-surface">
                Related Machined Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {relatedProjects.map((p) => (
                  <WorkCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand phone={settings.phone} />
      </main>

      <Footer settings={settings} />
    </>
  );
}
