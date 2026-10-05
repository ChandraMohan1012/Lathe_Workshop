import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import AdminBaysManager from '@/components/AdminBaysManager';
import { getEnquiries, getLiveJobs, getProjects } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const enquiries = await getEnquiries();
  const liveJobs = await getLiveJobs();
  const projects = await getProjects();

  const completedWorksCount = projects.length;
  const activeJobsCount = liveJobs.filter((j) => j.status !== 'Completed').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const latestEnquiries = enquiries.slice(0, 5);

  return (
    <AdminShell
      title="Workshop Dashboard"
      subtitle="Welcome back. Here is an overview of current shop operations."
    >
      <div className="flex flex-col gap-10">
        {/* ========================================================= */}
        {/* 1. TOP QUICK ACTIONS: 3 Large Tappable Buttons            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/admin/work/new"
            className="flex items-center justify-between p-4 rounded-[4px] bg-[#6a5d34] text-white hover:bg-[#7e6f3e] transition-colors shadow-xs group min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">add_circle</span>
              <span className="font-headline-sm text-sm uppercase tracking-wider font-bold">
                Add New Work
              </span>
            </div>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>

          <a
            href="#ongoing-jobs-section"
            className="flex items-center justify-between p-4 rounded-[4px] bg-[#1e2126] text-white hover:bg-black transition-colors shadow-xs group min-h-[56px] border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[#cab988]">sync</span>
              <span className="font-headline-sm text-sm uppercase tracking-wider font-bold">
                Update Ongoing Jobs
              </span>
            </div>
            <span className="material-symbols-outlined text-lg text-[#cab988] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>

          <Link
            href="/admin/enquiries"
            className="flex items-center justify-between p-4 rounded-[4px] bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-surface-container-high transition-colors shadow-xs group min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">chat</span>
              <span className="font-headline-sm text-sm uppercase tracking-wider font-bold">
                View Enquiries ({newEnquiriesCount})
              </span>
            </div>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 2. SUMMARY: Single Inline Row of 3 Numbers with Dividers  */}
        {/* ========================================================= */}
        <div className="border-y border-outline-variant/40 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/40">
            <div className="flex flex-col items-start sm:items-center py-2 sm:py-0 px-2 sm:px-6">
              <span className="font-display-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
                {completedWorksCount}
              </span>
              <span className="font-label-technical text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                Completed Works in Catalog
              </span>
            </div>

            <div className="flex flex-col items-start sm:items-center py-4 sm:py-0 px-2 sm:px-6">
              <span className="font-display-xl text-3xl sm:text-4xl text-[#6a5d34] font-bold tracking-tight">
                {activeJobsCount}
              </span>
              <span className="font-label-technical text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                Ongoing Bay Jobs Active
              </span>
            </div>

            <div className="flex flex-col items-start sm:items-center py-4 sm:py-0 px-2 sm:px-6">
              <span className="font-display-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
                {newEnquiriesCount}
              </span>
              <span className="font-label-technical text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                New Customer Enquiries
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ONGOING JOBS: Compact List                             */}
        {/* ========================================================= */}
        <AdminBaysManager initialJobs={liveJobs} />

        {/* ========================================================= */}
        {/* 4. LATEST ENQUIRIES: 5 Rows with Tap-to-Call              */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface font-bold">
                Latest Customer Enquiries
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Direct quotes requested by regional customers.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="font-label-technical text-xs text-primary uppercase font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>View All Enquiries</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {latestEnquiries.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant font-body-md text-sm">
              No customer enquiries yet. Incoming blueprint and quote requests will appear here.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
              {latestEnquiries.map((enq) => {
                const isNew = enq.status === 'New';
                const cleanPhone = enq.phone.replace(/[^0-9+]/g, '');

                return (
                  <div
                    key={enq.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/40 px-2 sm:px-3 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Unread indicator dot */}
                      <span
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          isNew ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                        title={isNew ? 'New enquiry' : 'Read'}
                      />

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-sm text-sm uppercase text-on-surface font-bold">
                            {enq.name}
                          </span>
                          {enq.company && (
                            <span className="text-xs text-on-surface-variant truncate">
                              • {enq.company}
                            </span>
                          )}
                        </div>

                        <p className="font-body-md text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                          {enq.serviceType}: {enq.message}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Phone tap-to-call & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pl-5 sm:pl-0">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface font-label-technical text-xs font-semibold"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">call</span>
                        <span>{enq.phone}</span>
                      </a>

                      <Link
                        href="/admin/enquiries"
                        className="text-xs font-label-technical text-primary uppercase font-bold hover:underline"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
