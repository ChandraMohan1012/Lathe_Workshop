'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminShell from '@/components/AdminShell';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/AdminToast';
import { Project } from '@/types';
import { getProjects, deleteProject } from '@/lib/supabase';

export default function AdminWorkListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Ongoing'>('All');
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Mobile menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch {
        showToast('Failed to load projects catalog.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteProject(deleteTarget.id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast(`"${deleteTarget.title}" deleted from catalog.`, 'success');
      } else {
        showToast(res.error || 'Failed to delete work. Please try again.', 'error');
      }
    } catch {
      showToast('Error deleting work.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      // Status filter
      if (statusFilter === 'Completed') {
        return matchesSearch && Boolean(p.completionDate);
      }
      if (statusFilter === 'Ongoing') {
        // If completion date is in future or flagged as ongoing
        return matchesSearch && (!p.completionDate || p.completionDate === 'Ongoing');
      }
      return matchesSearch;
    });
  }, [projects, search, statusFilter]);

  const actionButton = (
    <Link
      href="/admin/work/new"
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors shadow-xs min-h-[40px]"
    >
      <span className="material-symbols-outlined text-base">add</span>
      <span>Add New Work</span>
    </Link>
  );

  return (
    <AdminShell
      title="Works & Portfolio"
      subtitle="Manage finished components and live machining catalog."
      action={actionButton}
    >
      <div className="flex flex-col gap-6">
        {/* Controls: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-6">
            {(['All', 'Completed', 'Ongoing'] as const).map((tab) => {
              const active = statusFilter === tab;
              const count =
                tab === 'All'
                  ? projects.length
                  : tab === 'Completed'
                  ? projects.filter((p) => p.completionDate && p.completionDate !== 'Ongoing').length
                  : projects.filter((p) => !p.completionDate || p.completionDate === 'Ongoing').length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`relative pb-2 font-label-technical text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container font-mono">
                    {count}
                  </span>
                  {active && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#cab988]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, material, or category..."
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-1.5 font-body-md text-sm text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs hover:text-on-surface"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content: Loading Skeleton, Empty State, or Works Content */}
        {loading ? (
          <div className="flex flex-col divide-y divide-outline-variant/30 border-y border-outline-variant/40">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4 flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container rounded-[4px]" />
                  <div className="flex flex-col gap-2">
                    <div className="w-48 h-4 bg-surface-container rounded" />
                    <div className="w-32 h-3 bg-surface-container rounded" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="py-16 flex flex-col items-center justify-center text-center gap-3 max-w-sm mx-auto">
            <span className="material-symbols-outlined text-4xl text-outline-variant">
              inventory_2
            </span>
            <h3 className="font-headline-sm text-base uppercase text-on-surface font-bold">
              {search ? 'No works match your search' : 'No works added yet'}
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
              {search
                ? 'Try searching with a different term or clear the search filter.'
                : 'Publish your finished lathe turning jobs to show prospective clients.'}
            </p>
            {!search && (
              <Link
                href="/admin/work/new"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Your First Work</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* DESKTOP TABLE (Hidden on mobile <1024px)                  */}
            {/* ========================================================= */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left font-body-md text-sm border-collapse border-y border-outline-variant/40">
                <thead>
                  <tr className="border-b border-outline-variant/60 font-label-technical text-xs text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3 px-3">Preview</th>
                    <th className="py-3 px-3">Component Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Material & Specs</th>
                    <th className="py-3 px-3">Tolerance</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="relative w-12 h-12 rounded-[4px] overflow-hidden bg-surface-container border border-outline-variant/50">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface uppercase text-sm">
                            {p.title}
                          </span>
                          <span className="text-[11px] font-label-technical text-on-surface-variant">
                            {p.completionDate || 'Recent Batch'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block font-label-technical text-xs text-primary font-bold uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-on-surface-variant">
                        <div className="font-semibold text-on-surface">{p.material}</div>
                        <div>{p.quantity}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-xs text-primary">
                        {p.tolerance}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/work/${p.id}/edit`}
                            className="p-1.5 rounded-[4px] text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                            title="Edit Work"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-[4px] text-on-surface-variant hover:text-error hover:bg-red-50 transition-colors"
                            title="Delete Work"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ========================================================= */}
            {/* MOBILE LIST ROWS (Hidden on desktop lg+)                 */}
            {/* ========================================================= */}
            <div className="lg:hidden flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
              {filteredProjects.map((p) => {
                const isMenuOpen = activeMenuId === p.id;

                return (
                  <div key={p.id} className="py-4 flex flex-col gap-2 relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-[4px] overflow-hidden bg-surface-container border border-outline-variant/50 flex-shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-sm uppercase tracking-tight text-on-surface font-bold leading-snug truncate">
                            {p.title}
                          </span>
                          <span className="font-label-technical text-xs text-primary font-bold uppercase mt-0.5">
                            {p.category}
                          </span>
                          <span className="font-body-md text-xs text-on-surface-variant mt-0.5 truncate">
                            {p.material} • <strong className="font-mono text-on-surface">{p.tolerance}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Mobile 3-Dots Action Menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                          className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface rounded-[4px] min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label="Actions"
                        >
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-10 z-20 w-44 bg-surface rounded-[4px] border border-outline-variant/70 shadow-lg py-1 flex flex-col animate-in fade-in zoom-in-95">
                            <Link
                              href={`/admin/work/${p.id}/edit`}
                              className="px-4 py-2.5 text-xs font-label-technical uppercase tracking-wider text-on-surface hover:bg-surface-container flex items-center gap-2"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                              <span>Edit Details</span>
                            </Link>

                            <Link
                              href={`/portfolio/${p.slug}`}
                              target="_blank"
                              className="px-4 py-2.5 text-xs font-label-technical uppercase tracking-wider text-on-surface hover:bg-surface-container flex items-center gap-2"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-base">open_in_new</span>
                              <span>View Public</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeleteTarget(p);
                              }}
                              className="px-4 py-2.5 text-xs font-label-technical uppercase tracking-wider text-error hover:bg-red-50 flex items-center gap-2 border-t border-outline-variant/30 text-left"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              <span>Delete Work</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete this work?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete Work"
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
