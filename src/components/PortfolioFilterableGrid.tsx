'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import WorkCard from './WorkCard';

interface PortfolioFilterableGridProps {
  initialProjects: Project[];
}

export default function PortfolioFilterableGrid({ initialProjects }: PortfolioFilterableGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories and materials dynamically from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [initialProjects]);

  const materials = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return ['All', ...Array.from(set)];
  }, [initialProjects]);

  // Filter projects based on category, material, and search
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchMaterial = selectedMaterial === 'All' || p.material === selectedMaterial;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tolerance.toLowerCase().includes(query) ||
        (p.clientIndustry && p.clientIndustry.toLowerCase().includes(query));

      return matchCategory && matchMaterial && matchSearch;
    });
  }, [initialProjects, selectedCategory, selectedMaterial, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedMaterial !== 'All' || searchQuery.length > 0;

  if (initialProjects.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-space-2xl rounded-2xl border border-outline-variant/40 text-center flex flex-col items-center justify-center gap-space-md py-16">
        <span className="material-symbols-outlined text-5xl text-outline">precision_manufacturing</span>
        <h3 className="font-headline-sm text-xl uppercase tracking-tight text-on-surface">No Machined Works Cataloged Yet</h3>
        <p className="font-body-md text-sm text-on-surface-variant max-w-md">
          Our engineering team is documenting recent batch productions. Contact our engineering desk to discuss your custom manufacturing specifications.
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all"
        >
          Request Custom Quote
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-xl">
      {/* FILTER & SEARCH BAR */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl border border-outline-variant/50 shadow-xs flex flex-col gap-space-md">
        {/* Top Controls: Search + Material dropdown */}
        <div className="flex flex-col sm:flex-row gap-space-sm items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-grow max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components by title, tolerance, or material..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-sm text-on-surface"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Material Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap hidden sm:inline">
              Material:
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-label-technical text-xs uppercase tracking-wider text-on-surface"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat === 'All' ? 'All Materials' : mat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-outline-variant/30">
          <span className="font-label-technical text-[11px] uppercase tracking-wider text-on-surface-variant mr-2">
            Category:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count = cat === 'All' ? initialProjects.length : initialProjects.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-label-technical text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/50'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs font-label-technical text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* RESULT STATUS BAR */}
      <div className="flex items-center justify-between text-xs font-label-technical text-on-surface-variant uppercase tracking-wider px-1">
        <span>
          Showing <strong className="text-on-surface font-semibold">{filteredProjects.length}</strong> of{' '}
          {initialProjects.length} machined works
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-semibold">
            Active Filter: {selectedCategory !== 'All' ? selectedCategory : ''}{' '}
            {selectedMaterial !== 'All' ? `• ${selectedMaterial}` : ''}
          </span>
        )}
      </div>

      {/* PORTFOLIO GRID OR NO RESULTS */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredProjects.map((project) => (
            <WorkCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest p-space-2xl rounded-2xl border border-outline-variant/40 text-center flex flex-col items-center justify-center gap-space-md py-12">
          <span className="material-symbols-outlined text-4xl text-outline">filter_list_off</span>
          <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface">No Machined Works Match Filter</h3>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md">
            No projects found matching category &quot;{selectedCategory}&quot; or material &quot;{selectedMaterial}&quot;. Try resetting your filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
