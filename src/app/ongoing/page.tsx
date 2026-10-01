import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import { getLiveJobs } from '@/lib/supabase';
import { initialSettings } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Live Workshop Jobs & Bay Status Tracker',
  description: 'Track real-time active turning bay jobs, queue progress, and estimated completion times across our 16 lathe bays in Guindy SIDCO.',
};

export default async function OngoingPage() {
  const liveJobs = await getLiveJobs();

  return (
    <>
      <Navbar />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Ongoing Workshop <span className="text-primary italic font-editorial-accent">Jobs</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Real-time operational status across our turning bays. Monitor batch progress, tolerances, and estimated dispatch schedules for active client contracts.
            </p>
          </div>
        </section>

        <StatsBanner />

        {/* LIVE BAY TRACKER BOARD */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            {/* Jobs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {liveJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/60 flex flex-col justify-between gap-space-md interactive-card"
                >
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 font-label-technical text-xs uppercase tracking-wider">
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold">
                      {job.bayNumber}
                    </span>
                    <span className="text-on-surface-variant">{job.partReference}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface">
                      {job.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 font-label-technical text-xs text-on-surface-variant">
                      <span className="bg-surface-container px-2 py-0.5 rounded">{job.material}</span>
                      <span>•</span>
                      <span className="text-primary font-semibold">{job.tolerance}</span>
                    </div>
                  </div>

                  {/* Progress & Status */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30">
                    <div className="flex justify-between items-center text-xs font-label-technical">
                      <span className="text-on-surface-variant uppercase">Run Completion</span>
                      <span className="font-bold text-on-surface">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-700 rounded-full"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-label-technical text-on-surface-variant uppercase pt-1">
                    <div>
                      <span className="block text-[10px]">Technician</span>
                      <span className="font-semibold text-on-surface">{job.technician}</span>
                    </div>
                    <div>
                      <span className="block text-[10px]">Est. Completion</span>
                      <span className="font-semibold text-primary">{job.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Note: System state demonstration block intentionally removed as per rule 5 */}

        <CtaBand
          title="Need Priority Slot Allocation in Active Bays?"
          subtitle="Submit your engineering drawings for immediate bay scheduling and priority turnaround."
        />
      </main>

      <Footer />
    </>
  );
}
