'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LiveJob } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface OngoingJobsListProps {
  jobs: LiveJob[];
  phone?: string;
  whatsapp?: string;
}

export default function OngoingJobsList({
  jobs,
  phone = initialSettings.phone,
  whatsapp = initialSettings.whatsapp,
}: OngoingJobsListProps) {
  const [selectedTab, setSelectedTab] = useState<'All' | 'In progress' | 'Almost done'>('All');

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedTab === 'All') return true;
      if (selectedTab === 'Almost done') {
        return job.progress >= 75 || job.status.toLowerCase().includes('quality') || job.status.toLowerCase().includes('almost');
      }
      if (selectedTab === 'In progress') {
        return job.progress < 75 && !job.status.toLowerCase().includes('completed');
      }
      return true;
    });
  }, [jobs, selectedTab]);

  const thumbnails = [
    '/images/hero-macro-cnc.png',
    '/images/brass-components.png',
    '/images/lathe-chuck.png',
    '/images/precision-craft.png',
    '/images/workshop-floor.png',
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Filter Tabs: Plain text tabs with underline indicator */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-outline-variant/40 pb-4">
        {(['All', 'In progress', 'Almost done'] as const).map((tab) => {
          const active = selectedTab === tab;
          const count =
            tab === 'All'
              ? jobs.length
              : tab === 'Almost done'
              ? jobs.filter((j) => j.progress >= 75).length
              : jobs.filter((j) => j.progress < 75).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`relative pb-3 font-label-technical text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${
                active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>{tab}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-surface-container font-mono">
                {count}
              </span>
              {active && (
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#cab988] transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline/List of Jobs */}
      {filteredJobs.length > 0 ? (
        <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
          {filteredJobs.map((job, idx) => {
            const thumb = thumbnails[idx % thumbnails.length];
            const isAlmostDone = job.progress >= 75;

            return (
              <div
                key={job.id}
                className="py-6 sm:py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-low/30 transition-colors px-2 sm:px-4"
              >
                {/* Left: Thumbnail + Bay + Title + Material */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-[320px] lg:min-w-[380px]">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[4px] overflow-hidden border border-outline-variant/50 flex-shrink-0 bg-surface-container">
                    <Image
                      src={thumb}
                      alt={job.jobTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-technical text-[10px] uppercase font-bold px-2 py-0.5 bg-surface-container-high text-on-surface rounded-[2px] border border-outline-variant/40">
                        {job.bayNumber}
                      </span>
                      <span className="font-label-technical text-[10px] text-on-surface-variant uppercase">
                        Ref: {job.partReference}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface font-bold">
                      {job.jobTitle}
                    </h3>

                    <span className="font-label-technical text-xs text-on-surface-variant uppercase">
                      {job.material} • <span className="text-primary font-bold">{job.tolerance}</span>
                    </span>
                  </div>
                </div>

                {/* Center: Thin Progress Line */}
                <div className="flex flex-col gap-1.5 flex-grow max-w-md">
                  <div className="flex justify-between items-center text-xs font-label-technical uppercase">
                    <span className="text-on-surface-variant">Production Run</span>
                    <span className="font-bold text-on-surface">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-800 ease-out"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-label-technical text-on-surface-variant uppercase pt-0.5">
                    <span>Machinist: {job.technician}</span>
                    <span>Started: {job.startedTime}</span>
                  </div>
                </div>

                {/* Right: Status Tag + ETA */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 min-w-[140px] text-right">
                  <span
                    className={`font-label-technical text-xs uppercase font-bold px-2.5 py-1 rounded-[3px] border ${
                      isAlmostDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-surface-container text-on-surface border-outline-variant/60'
                    }`}
                  >
                    {isAlmostDone ? 'Almost done' : 'In progress'}
                  </span>
                  <span className="font-label-technical text-xs text-on-surface-variant uppercase">
                    ETA: <strong className="text-on-surface">{job.estimatedCompletion}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Restyled Without a Card */
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            Shop Floor Status
          </span>
          <h3 className="font-display-xl text-2xl uppercase tracking-tight text-on-surface font-bold">
            All Bays Ready
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            All lathe turning bays are open and ready for immediate job setup. Submit your blueprints or contact our workshop to reserve a bay slot.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Call Workshop</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20part%20to%20schedule%20for%20turning.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-surface-container-high transition-colors border border-outline-variant"
            >
              <span>Schedule Bay via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
