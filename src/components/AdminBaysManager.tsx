'use client';

import { useState } from 'react';
import { LiveJob } from '@/types';
import { updateLiveJobStatus } from '@/lib/supabase';
import { useToast } from '@/components/AdminToast';

interface AdminBaysManagerProps {
  initialJobs: LiveJob[];
}

const STATUS_OPTIONS: LiveJob['status'][] = [
  'In Progress',
  'Setup Phase',
  'Quality Check',
  'Completed',
];

export default function AdminBaysManager({ initialJobs }: AdminBaysManagerProps) {
  const [jobs, setJobs] = useState<LiveJob[]>(initialJobs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { showToast } = useToast();

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

  const handleQuickComplete = async (job: LiveJob) => {
    setSavingId(job.id);
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, progress: 100, status: 'Completed' as const } : j
    );
    setJobs(updatedJobs);

    try {
      const res = await updateLiveJobStatus(job.id, 100, 'Completed');
      if (res.success) {
        showToast(`${job.bayNumber} marked as completed!`, 'success');
      } else {
        showToast(res.error || 'Failed to update job status.', 'error');
      }
    } catch {
      showToast('Error updating job status.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleSave = async (job: LiveJob) => {
    setSavingId(job.id);
    try {
      const res = await updateLiveJobStatus(job.id, job.progress, job.status);
      if (res.success) {
        showToast(`${job.bayNumber} updated successfully!`, 'success');
        setEditingId(null);
      } else {
        showToast(res.error || 'Failed to update bay.', 'error');
      }
    } catch {
      showToast('Error updating bay.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div id="ongoing-jobs-section" className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
        <div className="flex flex-col">
          <h2 className="font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface font-bold">
            Ongoing Jobs
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Track and update progress for active workshop bays.
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="py-8 text-center text-on-surface-variant font-body-md text-sm">
          No ongoing jobs right now. All bays are ready.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
          {jobs.map((job) => {
            const isEditing = editingId === job.id;
            const isSaving = savingId === job.id;
            const isCompleted = job.status === 'Completed' || job.progress === 100;

            return (
              <div
                key={job.id}
                className="py-4 sm:py-5 flex flex-col gap-3 transition-colors hover:bg-surface-container-low/40 px-2 sm:px-3"
              >
                {/* Top Row: Bay badge, Job Title, Material, Status Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-label-technical text-xs font-bold px-2 py-0.5 bg-surface-container-high text-on-surface rounded-[3px] border border-outline-variant/60 flex-shrink-0">
                      {job.bayNumber}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-sm sm:text-base uppercase tracking-tight text-on-surface font-bold">
                        {job.jobTitle}
                      </span>
                      <span className="font-label-technical text-xs text-on-surface-variant uppercase mt-0.5">
                        {job.material} • {job.tolerance}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator tag */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-label-technical uppercase tracking-wider font-semibold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-surface-container text-on-surface border-outline-variant/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted ? 'bg-emerald-600' : 'bg-primary'
                        }`}
                      />
                      <span>{job.status}</span>
                    </span>

                    <span className="font-mono text-sm font-bold text-primary">
                      {job.progress}%
                    </span>
                  </div>
                </div>

                {/* Middle: Thin Progress Line */}
                <div className="w-full bg-outline-variant/30 h-1.5 overflow-hidden">
                  <div
                    className="bg-[#6a5d34] h-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                {/* Bottom Row / Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="font-label-technical text-xs text-on-surface-variant uppercase">
                    Machinist: <strong className="text-on-surface font-semibold">{job.technician}</strong> • ETA: {job.estimatedCompletion}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleQuickComplete(job)}
                        className="px-3 py-1.5 rounded-[4px] bg-emerald-700 hover:bg-emerald-800 text-white font-label-technical text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50 min-h-[36px]"
                      >
                        {isSaving ? 'Saving...' : 'Mark completed'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : job.id)}
                      className="px-3 py-1.5 rounded-[4px] border border-outline-variant text-on-surface hover:bg-surface-container font-label-technical text-xs uppercase tracking-wider font-semibold transition-colors min-h-[36px]"
                    >
                      {isEditing ? 'Close' : 'Update progress'}
                    </button>
                  </div>
                </div>

                {/* Expanded Inline Editor when "Update progress" is clicked */}
                {isEditing && (
                  <div className="mt-2 p-4 bg-surface-container-low border border-outline-variant/60 rounded-[4px] flex flex-col gap-4 animate-in fade-in duration-150">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-label-technical uppercase">
                        <span className="font-semibold text-on-surface">Adjust Progress</span>
                        <span className="font-mono font-bold text-primary text-sm">{job.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={job.progress}
                        onChange={(e) => handleProgressChange(job.id, Number(e.target.value))}
                        className="w-full h-2 accent-[#6a5d34] cursor-pointer"
                      />
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {[25, 50, 75, 100].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleProgressChange(job.id, preset)}
                            className={`py-1.5 text-xs font-label-technical font-semibold rounded-[3px] border transition-colors ${
                              job.progress === preset
                                ? 'bg-[#6a5d34] text-white border-[#6a5d34]'
                                : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container'
                            }`}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                        Operational Status
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {STATUS_OPTIONS.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(job.id, st)}
                            className={`py-2 px-2 text-xs font-label-technical uppercase tracking-wider font-semibold rounded-[3px] border transition-colors ${
                              job.status === st
                                ? 'bg-[#6a5d34] text-white border-[#6a5d34]'
                                : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-[4px] border border-outline-variant text-on-surface font-label-technical text-xs uppercase tracking-wider font-semibold hover:bg-surface-container"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave(job)}
                        className="px-5 py-2 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Updates'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
