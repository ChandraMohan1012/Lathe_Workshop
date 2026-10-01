'use client';

import { useState } from 'react';
import { LiveJob } from '@/types';
import { updateLiveJobStatus } from '@/lib/supabase';

interface AdminBaysManagerProps {
  initialJobs: LiveJob[];
}

const STATUS_OPTIONS: LiveJob['status'][] = [
  'In Progress',
  'Setup Phase',
  'Quality Check',
  'Completed',
];

const STATUS_COLORS: Record<LiveJob['status'], { bg: string; text: string; border: string }> = {
  'In Progress': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  'Setup Phase': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  'Quality Check': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  'Completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
};

export default function AdminBaysManager({ initialJobs }: AdminBaysManagerProps) {
  const [jobs, setJobs] = useState<LiveJob[]>(initialJobs);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProgressChange = (id: string, newProgress: number) => {
    const clamped = Math.max(0, Math.min(100, newProgress));
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, progress: clamped } : j))
    );
  };

  const handleStatusChange = (id: string, newStatus: LiveJob['status']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
  };

  const handleSave = async (job: LiveJob) => {
    setSavingId(job.id);
    setErrorMsg(null);
    try {
      const res = await updateLiveJobStatus(job.id, job.progress, job.status);
      if (res.success) {
        setSuccessId(job.id);
        setTimeout(() => setSuccessId(null), 3000);
      } else {
        setErrorMsg(res.error || 'Failed to update job status.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error saving bay updates.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/60 flex flex-col gap-space-lg shadow-sm">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">precision_manufacturing</span>
            <h2 className="font-headline-sm text-xl uppercase tracking-tight text-on-surface">
              Active Turning Bays Operations
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-label-technical font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="font-body-md text-xs text-on-surface-variant">
            Update lathe bay execution progress and operational phases. Changes immediately reflect on the public{' '}
            <strong className="text-on-surface">/ongoing</strong> tracking board and home page.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-3 py-1.5 rounded-lg text-xs font-label-technical">
            {errorMsg}
          </div>
        )}
      </div>

      {/* BAYS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {jobs.map((job) => {
          const isSaving = savingId === job.id;
          const isSaved = successId === job.id;
          const statusStyle = STATUS_COLORS[job.status] || STATUS_COLORS['In Progress'];

          return (
            <div
              key={job.id}
              className={`p-space-lg bg-surface-container-low rounded-xl border transition-all flex flex-col gap-space-md shadow-xs ${
                isSaved ? 'border-emerald-500/70 ring-1 ring-emerald-500/30' : 'border-outline-variant/50 hover:border-outline-variant'
              }`}
            >
              {/* Card Header: Bay & Ref */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-primary text-on-primary font-label-technical text-xs font-bold uppercase tracking-wider">
                    {job.bayNumber}
                  </span>
                  <span className="font-label-technical text-[11px] text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded">
                    {job.partReference}
                  </span>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-[11px] font-label-technical font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                  {job.status}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-base uppercase text-on-surface font-semibold">
                  {job.jobTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-label-technical text-on-surface-variant">
                  <span>Material: <strong className="text-on-surface">{job.material}</strong></span>
                  <span>•</span>
                  <span>Tolerance: <strong className="text-primary font-mono">{job.tolerance}</strong></span>
                  <span>•</span>
                  <span>Tech: <strong className="text-on-surface">{job.technician}</strong></span>
                </div>
              </div>

              {/* Interactive Status Dropdown */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/30">
                <label className="font-label-technical text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Operational Phase
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {STATUS_OPTIONS.map((st) => {
                    const isSelected = job.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(job.id, st)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-label-technical uppercase font-bold tracking-tight transition-all border ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Progress Slider & Presets */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-label-technical">
                  <span className="text-on-surface-variant uppercase font-semibold">
                    Machining Progress
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-bold text-primary">
                      {job.progress}%
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={job.progress}
                    onChange={(e) => handleProgressChange(job.id, Number(e.target.value))}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Progress Quick Presets */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  {[25, 50, 75, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleProgressChange(job.id, preset)}
                      className={`flex-1 py-1 text-[10px] font-label-technical uppercase font-semibold rounded border transition-colors ${
                        job.progress === preset
                          ? 'bg-primary/20 text-primary border-primary/50 font-bold'
                          : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Save Button */}
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-3">
                <span className="font-label-technical text-[10px] text-on-surface-variant uppercase">
                  Est. Completion: <strong className="text-on-surface">{job.estimatedCompletion}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleSave(job)}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-label-technical text-xs uppercase font-bold tracking-wider transition-all shadow-xs ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>Syncing...</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Synced ✓</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">sync</span>
                      <span>Update Bay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
