import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatsBanner from '@/components/StatsBanner';
import WorkCard from '@/components/WorkCard';
import FaqAccordion from '@/components/FaqAccordion';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { getProjects, getLiveJobs } from '@/lib/supabase';
import { mockFaqs, initialSettings } from '@/lib/mockData';

export default async function HomePage() {
  const projects = await getProjects();
  const liveJobs = await getLiveJobs();
  const featuredProjects = projects.filter((p) => p.featured || true).slice(0, 3);
  const activeJobs = liveJobs.slice(0, 4);

  return (
    <>
      <JsonLd />
      <Navbar />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full bg-surface-container-lowest px-gutter py-space-2xl overflow-hidden border-b border-outline-variant/30">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#181c22_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-space-md hero-animate-1">
              <div className="inline-flex items-center gap-space-xs w-max bg-surface-container px-space-md py-space-xs rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-technical text-xs uppercase tracking-widest text-on-surface font-semibold">
                  Subtractive Precision Tooling // Guindy SIDCO
                </span>
              </div>

              <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight leading-tight">
                High-Tolerance <br />
                <span className="text-primary italic font-editorial-accent lowercase">lathe</span> Machining
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Single-piece prototype retooling, precision brass turning, and high-tolerance batch manufacturing. Calibrated down to <strong className="text-on-surface font-semibold">{initialSettings.standardTolerance}</strong> dimensional accuracy.
              </p>

              <div className="flex flex-wrap items-center gap-space-md pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-space-xs px-space-xl py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-sm uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
                >
                  <span>Submit Blueprint / CAD</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-full bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors border border-outline-variant"
                >
                  <span>View Machine Portfolio</span>
                </Link>
              </div>

              {/* Quick specs pills */}
              <div className="pt-space-md grid grid-cols-3 gap-space-sm border-t border-outline-variant/40 mt-4 max-w-lg">
                <div>
                  <span className="block font-label-technical text-[10px] uppercase text-on-surface-variant">Calibrated Tolerance</span>
                  <span className="font-headline-sm text-sm text-primary uppercase font-bold">{initialSettings.standardTolerance}</span>
                </div>
                <div>
                  <span className="block font-label-technical text-[10px] uppercase text-on-surface-variant">Active Bays</span>
                  <span className="font-headline-sm text-sm text-on-surface uppercase font-bold">{initialSettings.activeBays} Online</span>
                </div>
                <div>
                  <span className="block font-label-technical text-[10px] uppercase text-on-surface-variant">Batch Lead</span>
                  <span className="font-headline-sm text-sm text-on-surface uppercase font-bold">48 Hours</span>
                </div>
              </div>
            </div>

            {/* Right Photo Deck Stack */}
            <div className="lg:col-span-5 relative min-h-[360px] flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-outline-variant/60 hero-card-master">
                <Image
                  src="/images/hero-macro-cnc.png"
                  alt="Precision CNC Lathe Turning Brass"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-space-md">
                  <div className="text-white font-label-technical text-xs uppercase tracking-wider">
                    <span className="text-primary-fixed font-bold block">Bay 01 Live Run</span>
                    <span>Brass CW614N • Threaded Bushing Batch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TELEMETRY STATS BANNER */}
        <StatsBanner />

        {/* SERVICES OVERVIEW GRID */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-outline-variant/40 pb-space-md">
              <div className="flex flex-col gap-1">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-semibold">
                  Workshop Capabilities
                </span>
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface">
                  Precision Lathe Services
                </h2>
              </div>
              <Link
                href="/services"
                className="font-label-technical text-xs text-primary uppercase font-semibold tracking-wider hover:underline inline-flex items-center gap-1"
              >
                Explore All Services
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Service Card 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col justify-between gap-4 interactive-card">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/40 text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                  </div>
                  <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface">
                    Heavy Lathe Turning
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Stepped shaft turning, long marine pump shafts up to 95mm diameter, and heavy alloy steel roughing.
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30 font-label-technical text-xs text-primary uppercase font-semibold">
                  Tolerances to ±0.005mm
                </div>
              </div>

              {/* Service Card 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col justify-between gap-4 interactive-card">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/40 text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">settings_input_component</span>
                  </div>
                  <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface">
                    Brass Components & Threading
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Internal micro-threading, turned bushings, flanged sleeves, and high-pressure hydraulic components.
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30 font-label-technical text-xs text-primary uppercase font-semibold">
                  Micro-grooving & Mirror Finish
                </div>
              </div>

              {/* Service Card 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/50 flex flex-col justify-between gap-4 interactive-card">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/40 text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">build_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface">
                    Prototype Tooling & Retooling
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Single-piece emergency tool steel dies, custom punches, replacement bushings, and hard turning on HRC 60+ steel.
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30 font-label-technical text-xs text-primary uppercase font-semibold">
                  Fast 24-48h Prototyping
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PORTFOLIO SECTION */}
        <section className="w-full bg-surface-container-low px-gutter py-space-2xl border-t border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-semibold">
                  Machined Components Showcase
                </span>
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface">
                  Featured Portfolio Works
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="font-label-technical text-xs text-primary uppercase font-semibold tracking-wider hover:underline inline-flex items-center gap-1"
              >
                View Full Showcase Catalog
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {featuredProjects.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* LIVE WORKSHOP BAY TEASER */}
        <section className="w-full bg-surface px-gutter py-space-2xl border-t border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-outline-variant/40 pb-space-md">
              <div>
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Live Shop Floor Telemetry
                </span>
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface mt-1">
                  Active Turning Bay Jobs
                </h2>
              </div>
              <Link
                href="/ongoing"
                className="font-label-technical text-xs text-primary uppercase font-semibold tracking-wider hover:underline inline-flex items-center gap-1"
              >
                Open Full Bay Tracker
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/50 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between font-label-technical text-xs uppercase tracking-wider">
                    <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full font-bold">
                      {job.bayNumber}
                    </span>
                    <span className="text-on-surface-variant">{job.partReference}</span>
                  </div>

                  <h4 className="font-headline-sm text-base uppercase text-on-surface">
                    {job.jobTitle}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-technical">
                    <span>{job.material} • {job.tolerance}</span>
                    <span className="font-semibold text-primary">{job.status}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <FaqAccordion items={mockFaqs} />

        {/* CTA BAND */}
        <CtaBand />
      </main>

      <Footer />
    </>
  );
}
