import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { getEnquiries, getLiveJobs, getProjects, getWorkshopSettings } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const enquiries = await getEnquiries();
  const liveJobs = await getLiveJobs();
  const projects = await getProjects();
  const settings = await getWorkshopSettings();

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border-b border-outline-variant/40 pb-space-md">
          <div className="flex flex-col">
            <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
              Workshop Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            <Link
              href="/admin/work/new"
              className="inline-flex items-center gap-2 px-space-lg py-space-sm rounded-full bg-primary text-on-primary font-label-technical text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col justify-between">
            <span className="font-label-technical text-xs text-on-surface-variant uppercase">New RFQ Enquiries</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-display-xl text-3xl font-bold text-on-surface">{enquiries.length}</span>
              <span className="font-label-technical text-xs text-primary font-semibold">Active</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col justify-between">
            <span className="font-label-technical text-xs text-on-surface-variant uppercase">Active Turning Bays</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-display-xl text-3xl font-bold text-primary">{settings.activeBays} / {settings.totalBays}</span>
              <span className="font-label-technical text-xs text-emerald-600 font-semibold">Online</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col justify-between">
            <span className="font-label-technical text-xs text-on-surface-variant uppercase">Published Projects</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-display-xl text-3xl font-bold text-on-surface">{projects.length}</span>
              <span className="font-label-technical text-xs text-on-surface-variant font-semibold">Catalog</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col justify-between">
            <span className="font-label-technical text-xs text-on-surface-variant uppercase">Calibration Standard</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-display-xl text-2xl font-bold text-on-surface">{settings.standardTolerance}</span>
              <span className="font-label-technical text-xs text-primary font-semibold">ISO 9001</span>
            </div>
          </div>
        </div>

        {/* RECENT ENQUIRIES TABLE */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col gap-space-md shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <h2 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mark_email_unread</span>
              Recent Customer Quotation Requests
            </h2>
            <Link
              href="/admin/enquiries"
              className="font-label-technical text-xs text-primary uppercase font-semibold hover:underline"
            >
              View All Enquiries →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md text-sm border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 font-label-technical text-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3 px-2">Client Name</th>
                  <th className="pb-3 px-2">Service Required</th>
                  <th className="pb-3 px-2">Company / Phone</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-2 font-semibold text-on-surface">{enq.name}</td>
                    <td className="py-3 px-2 text-on-surface-variant">{enq.serviceType}</td>
                    <td className="py-3 px-2 text-on-surface-variant text-xs">
                      <div>{enq.company || 'Individual'}</div>
                      <div className="text-primary font-mono">{enq.phone}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full font-label-technical text-[10px] uppercase font-bold">
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="text-xs font-label-technical text-primary uppercase font-semibold hover:underline"
                      >
                        Review RFQ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVE BAY STATUS OVERVIEW */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/50 flex flex-col gap-space-md shadow-xs">
          <h2 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-primary">engineering</span>
            Active Turning Bays Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {liveJobs.map((job) => (
              <div key={job.id} className="p-space-md bg-surface-container-low rounded-lg border border-outline-variant/40 flex flex-col gap-2">
                <div className="flex items-center justify-between font-label-technical text-xs uppercase">
                  <span className="font-bold text-primary">{job.bayNumber}</span>
                  <span className="text-on-surface-variant">{job.partReference}</span>
                </div>
                <div className="font-headline-sm text-sm uppercase text-on-surface">{job.jobTitle}</div>
                <div className="flex justify-between items-center text-xs font-label-technical">
                  <span>{job.material} • {job.tolerance}</span>
                  <span className="font-bold text-primary">{job.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${job.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note: System states, skeletons and feedback modules block intentionally omitted as per rule 5 */}
      </main>
    </div>
  );
}
