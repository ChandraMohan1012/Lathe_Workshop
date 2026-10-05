import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import OngoingJobsList from '@/components/OngoingJobsList';
import { getLiveJobs, getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Ongoing Bay Jobs & Live Workshop Status | Erode',
  description: 'Monitor active lathe turning bays, component progress, and estimated delivery times at Lathe Pattarai workshop in Erode.',
  alternates: {
    canonical: '/ongoing',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function OngoingPage() {
  const liveJobs = await getLiveJobs();
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
              <span className="text-on-surface font-semibold">Ongoing Jobs</span>
            </div>

            <h1 className="font-display-xl text-3xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
              Ongoing Bay Work
            </h1>

            <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Real-time operational view across our turning bays in Erode. Track running batches, calibrated tolerances, and estimated completion times.
            </p>
          </div>
        </section>

        <StatsBanner settings={settings} />

        {/* ONGOING JOBS TIMELINE/LIST */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto">
            <OngoingJobsList
              jobs={liveJobs}
              phone={settings.phone}
              whatsapp={settings.whatsapp}
            />
          </div>
        </section>

        <CtaBand
          title="Need priority slot allocation in our bays?"
          subtitle="Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Send your drawing to schedule your batch run."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
