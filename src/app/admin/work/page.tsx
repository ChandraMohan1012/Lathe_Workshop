'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';
import { Project } from '@/types';
import { getProjects, deleteProject } from '@/lib/supabase';

export default function AdminWorkListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the catalog?`)) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.material.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border-b border-outline-variant/40 pb-space-md">
          <div className="flex flex-col">
            <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
              PORTFOLIO MANAGEMENT
            </span>
            <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
              Machining Works & Projects Catalog
            </h1>
          </div>

          <Link
            href="/admin/work/new"
            className="inline-flex items-center gap-2 px-space-lg py-space-sm rounded-full bg-primary text-on-primary font-label-technical text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add New Project</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, material, or category..."
            className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
          />
        </div>

        {/* Works Table */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-xs">
          {loading ? (
            <div className="p-8 text-center font-label-technical text-xs uppercase text-on-surface-variant">
              Loading projects catalog...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center font-label-technical text-xs uppercase text-on-surface-variant">
              No projects found in catalog.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md text-sm border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/40 font-label-technical text-xs text-on-surface-variant uppercase tracking-wider">
                    <th className="pb-3 px-2">Preview</th>
                    <th className="pb-3 px-2">Title</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Material / Specs</th>
                    <th className="pb-3 px-2">Tolerance</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/50">
                      <td className="py-3 px-2">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-2 font-semibold text-on-surface max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full font-label-technical text-[10px] uppercase font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-on-surface-variant">
                        <div>{p.material}</div>
                        <div className="text-on-surface">{p.quantity}</div>
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-primary text-xs">
                        {p.tolerance}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/work/${p.id}/edit`}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-primary/20 text-primary transition-colors"
                            title="Edit Project"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error transition-colors"
                            title="Delete Project"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
