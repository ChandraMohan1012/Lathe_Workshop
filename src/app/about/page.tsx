import { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import { initialSettings } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Heritage & Machining Facility',
  description: 'Learn about Lathe Pattarai precision manufacturing heritage, master machinist tradition, and calibrated lathe turning facility in Guindy SIDCO, Chennai.',
};

import { getWorkshopSettings } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AboutPage() {
  const settings = await getWorkshopSettings();

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Machining Heritage & <span className="text-primary italic font-editorial-accent">Craft</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Rooted in classic machinist discipline and continuous micrometer calibration, Lathe Pattarai delivers subtractive tooling excellence for Chennai industrial manufacturing sectors.
            </p>
          </div>
        </section>

        <StatsBanner settings={settings} />

        {/* FOUNDER & HERITAGE SECTION */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            {/* Master Machinist Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-outline-variant/60">
                <Image
                  src="/images/master-machinist.png"
                  alt="Master Indian Machinist & Lathe Workshop Owner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-space-lg">
                  <div className="text-white flex flex-col gap-1">
                    <span className="font-headline-sm text-lg uppercase tracking-tight">Master Craftsmanship</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heritage Narrative */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface">
                Uncompromising Subtractive Precision
              </h2>

              <p className="font-body-lg text-on-surface-variant">
                Established in the heart of Guindy SIDCO Industrial Estate, Lathe Pattarai was built on a foundational commitment: that mechanical precision is measured not in millimeter estimates, but in verified 0.005mm tolerances.
              </p>

              <p className="font-body-md text-on-surface-variant">
                From single-piece emergency replacement bushings for heavy hydraulic machinery to batch turned brass components and stepped drive shafts, our workshop combines classic master-lathe feel with rigorous CMM quality auditing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-md border-t border-outline-variant/40 mt-2">
                <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40">
                  <h4 className="font-headline-sm text-base uppercase text-primary">DIN EN ISO Protocol</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">
                    All machining dimensions undergo multi-point micrometer validation.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/40">
                  <h4 className="font-headline-sm text-base uppercase text-primary">SIDCO Industrial Unit</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">
                    Located in Plot 14-B with 16 heavy lathe and CNC bays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FACILITY SHOWCASE */}
        <section className="w-full bg-surface-container-low px-gutter py-space-2xl border-t border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col gap-1 text-center">
              <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface">
                Modern Lathe Workshop Floor
              </h2>
            </div>

            <div className="relative w-full aspect-[21/9] min-h-[300px] rounded-2xl overflow-hidden shadow-xl border border-outline-variant/60">
              <Image
                src="/images/workshop-floor.png"
                alt="Wide Angle View of Lathe Workshop Floor"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <CtaBand phone={settings.phone} />
      </main>

      <Footer settings={settings} />
    </>
  );
}
