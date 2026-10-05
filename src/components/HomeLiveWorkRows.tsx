import Link from 'next/link';
import { LiveJob } from '@/types';

interface HomeLiveWorkRowsProps {
  jobs: LiveJob[];
}

export default function HomeLiveWorkRows({ jobs }: HomeLiveWorkRowsProps) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/40 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
              Shop Floor Activity
            </span>
            <h2 className="font-display-xl text-3xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
              Active Turning Bay Jobs
            </h2>
          </div>
          <Link
            href="/ongoing"
            className="font-label-technical text-xs uppercase tracking-wider text-primary font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <span>Open Bay Tracker</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Compact List Rows with thin dividers */}
        <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low/40 px-2 sm:px-3 transition-colors"
            >
              {/* Left: Bay Number + Job Title & Material */}
              <div className="flex items-start sm:items-center gap-4 min-w-[280px] lg:min-w-[340px]">
                <span className="font-label-technical text-xs font-bold px-2 py-1 bg-surface-container-high text-on-surface rounded-[4px] border border-outline-variant/40 flex-shrink-0">
                  {job.bayNumber}
                </span>
                <div className="flex flex-col">
                  <h4 className="font-headline-sm text-base uppercase tracking-tight text-on-surface font-bold">
                    {job.jobTitle}
                  </h4>
                  <span className="font-label-technical text-xs text-on-surface-variant uppercase mt-0.5">
                    {job.material} • {job.tolerance}
                  </span>
                </div>
              </div>

              {/* Middle: Thin Progress Line */}
              <div className="flex flex-col gap-1 flex-grow max-w-md">
                <div className="flex justify-between items-center text-[11px] font-label-technical text-on-surface-variant uppercase">
                  <span>Batch Run</span>
                  <span className="font-bold text-on-surface">{job.progress}%</span>
                </div>
                <div className="w-full bg-outline-variant/30 h-1.5 rounded-none overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-700 ease-out"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>

              {/* Right: Status text & ETA */}
              <div className="flex items-center justify-between md:justify-end gap-6 text-right min-w-[160px]">
                <div className="flex flex-col text-left md:text-right">
                  <span className="font-label-technical text-xs font-bold text-primary uppercase">
                    {job.status}
                  </span>
                  <span className="font-label-technical text-[10px] text-on-surface-variant uppercase">
                    ETA: {job.estimatedCompletion}
                  </span>
                </div>
                <Link
                  href="/ongoing"
                  className="font-label-technical text-xs text-on-surface-variant hover:text-primary"
                  title="View details"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
