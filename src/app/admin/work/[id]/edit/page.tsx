'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import WorkForm from '@/components/WorkForm';
import { getProjectById, updateProject } from '@/lib/supabase';
import { Project } from '@/types';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditWorkPage({ params }: EditPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProjectById(params.id);
        if (p) {
          setProject(p);
        } else {
          setLoadError('Work not found in catalog.');
        }
      } catch {
        setLoadError('Failed to load work details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleUpdate = async (data: any) => {
    return await updateProject(params.id, data);
  };

  return (
    <AdminShell
      title={project ? `Edit: ${project.title}` : 'Edit Work'}
      subtitle="Modify component parameters, tolerances, photos, or status."
      backHref="/admin/work"
    >
      <div className="max-w-3xl">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse py-8">
            <div className="h-6 bg-surface-container rounded w-1/3" />
            <div className="h-10 bg-surface-container rounded" />
            <div className="h-10 bg-surface-container rounded" />
          </div>
        ) : loadError || !project ? (
          <div className="p-6 bg-red-50 border border-red-300 text-red-900 rounded-[4px] text-sm">
            {loadError || 'Work not found.'}
          </div>
        ) : (
          <WorkForm initialData={project} isEditing onSubmit={handleUpdate} />
        )}
      </div>
    </AdminShell>
  );
}
