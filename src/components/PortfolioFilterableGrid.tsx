'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface PortfolioFilterableGridProps {
  initialProjects: Project[];
  phone?: string;
  whatsapp?: string;
}

const TABS = ['All', 'Turning', 'Threading', 'Boring', 'Batch work'];

// Varying aspect ratios for masonry feel
const ASPECT_RATIOS = [
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[16/10]',
  'aspect-square',
  'aspect-[4/5]',
  'aspect-[16/9]',
];

export default function PortfolioFilterableGrid({
  initialProjects,
  phone = initialSettings.phone,
  whatsapp = initialSettings.whatsapp,
}: PortfolioFilterableGridProps) {
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      // Tab matching logic
      let matchesTab = true;
      if (selectedTab !== 'All') {
        const textToSearch = `${p.category || ''} ${p.title} ${p.description || ''} ${p.material || ''}`.toLowerCase();
        if (selectedTab === 'Turning') {
          matchesTab = textToSearch.includes('turning') || textToSearch.includes('shaft');
        } else if (selectedTab === 'Threading') {
          matchesTab = textToSearch.includes('thread') || textToSearch.includes('bushing');
        } else if (selectedTab === 'Boring') {
          matchesTab = textToSearch.includes('boring') || textToSearch.includes('flange') || textToSearch.includes('coupling');
        } else if (selectedTab === 'Batch work') {
          matchesTab = textToSearch.includes('batch') || textToSearch.includes('repair') || textToSearch.includes('die') || textToSearch.includes('tooling');
        } else {
          matchesTab = textToSearch.includes(selectedTab.toLowerCase());
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tolerance.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [initialProjects, selectedTab, searchQuery]);

  return (
    <div className="flex flex-col gap-10">
      {/* Filters: Plain text tabs with underline indicator + Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant/40 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const active = selectedTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`relative pb-3 font-label-technical text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
                  active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{tab}</span>
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#cab988] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material or spec..."
            className="w-full bg-transparent border-b border-outline-variant/60 focus:border-primary px-1 py-1.5 font-body-md text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs hover:text-on-surface"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Masonry Gallery with Varied Image Heights */}
      {filteredProjects.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredProjects.map((project, idx) => {
            const aspectClass = ASPECT_RATIOS[idx % ASPECT_RATIOS.length];
            return (
              <div
                key={project.id}
                className="break-inside-avoid flex flex-col group transition-opacity duration-300"
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="block relative w-full overflow-hidden rounded-[6px] border border-outline-variant/50 bg-surface-container"
                >
                  <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Small Caption Below */}
                <div className="pt-3 pb-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] font-label-technical uppercase tracking-wider text-on-surface-variant">
                    <span className="text-primary font-semibold">{project.material}</span>
                    <span>{project.tolerance}</span>
                  </div>

                  <Link href={`/portfolio/${project.slug}`}>
                    <h3 className="font-headline-sm text-base uppercase tracking-tight text-on-surface font-bold group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </h3>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State with Call & WhatsApp */
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            No Works Matching Filter
          </span>
          <h3 className="font-display-xl text-2xl uppercase tracking-tight text-on-surface font-bold">
            Looking for a specific component?
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Our workshop handles regular custom turning, threading, and boring jobs that may not be cataloged here. Send your drawing or call directly.
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
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20component%20job%20requirement.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-surface-container-high transition-colors border border-outline-variant"
            >
              <span>WhatsApp Drawing</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
