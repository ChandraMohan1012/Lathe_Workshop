'use client';

import AdminShell from '@/components/AdminShell';
import WorkForm from '@/components/WorkForm';
import { createProject } from '@/lib/supabase';

export default function AdminNewWorkPage() {
  const handleCreate = async (data: any) => {
    return await createProject(data);
  };

  return (
    <AdminShell
      title="Add New Work"
      subtitle="Publish a finished or ongoing machined component to the workshop catalog."
      backHref="/admin/work"
    >
      <div className="max-w-3xl">
        <WorkForm onSubmit={handleCreate} />
      </div>
    </AdminShell>
  );
}
