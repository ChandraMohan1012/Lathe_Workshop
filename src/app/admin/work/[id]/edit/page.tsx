'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { getProjectById, updateProject } from '@/lib/supabase';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditWorkPage({ params }: EditPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Precision Turning');
  const [material, setMaterial] = useState('');
  const [tolerance, setTolerance] = useState('±0.005mm');
  const [quantity, setQuantity] = useState('100 Units');
  const [clientIndustry, setClientIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/brass-components.png');

  useEffect(() => {
    async function loadProject() {
      const p = await getProjectById(params.id);
      if (p) {
        setTitle(p.title);
        setCategory(p.category);
        setMaterial(p.material);
        setTolerance(p.tolerance);
        setQuantity(p.quantity);
        setClientIndustry(p.clientIndustry);
        setDescription(p.description);
        setImage(p.image);
      }
      setLoading(false);
    }
    loadProject();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProject(params.id, {
      title,
      category,
      material,
      tolerance,
      quantity,
      clientIndustry,
      description,
      image,
    });

    alert('Project details updated successfully!');
    router.push('/admin/work');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <main className="flex-grow p-space-xl flex items-center justify-center font-label-technical text-xs uppercase text-on-surface-variant">
          Loading project details...
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        <div className="flex flex-col gap-1 border-b border-outline-variant/40 pb-space-md">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            EDIT CATALOG ENTRY
          </span>
          <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
            Edit Project: {title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl bg-surface-container-lowest p-space-xl rounded-xl border border-outline-variant/60 shadow-xs flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
              >
                <option value="Precision Turning">Precision Turning</option>
                <option value="Heavy Duty Turning">Heavy Duty Turning</option>
                <option value="CNC Milling & Turning">CNC Milling & Turning</option>
                <option value="Tooling & Re-tooling">Tooling & Re-tooling</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Tolerance Standard *
              </label>
              <input
                type="text"
                required
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Raw Material Grade *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Batch Quantity
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Client Industry Sector
            </label>
            <input
              type="text"
              value={clientIndustry}
              onChange={(e) => setClientIndustry(e.target.value)}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Photo Asset Path
            </label>
            <select
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            >
              <option value="/images/brass-components.png">Brass Turned Components (/images/brass-components.png)</option>
              <option value="/images/lathe-chuck.png">Lathe Chuck & Shaft (/images/lathe-chuck.png)</option>
              <option value="/images/hero-macro-cnc.png">CNC Lathe Cutting (/images/hero-macro-cnc.png)</option>
              <option value="/images/precision-craft.png">Tool Steel Craft (/images/precision-craft.png)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Project Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            ></textarea>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              type="submit"
              className="px-space-xl py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
            >
              Update Project Details
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/work')}
              className="px-space-lg py-space-md rounded-full bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
