'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';
import { getProjectById, updateProject } from '@/lib/supabase';
import { uploadProjectImage } from '@/lib/supabase-storage';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditWorkPage({ params }: EditPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Precision Turning');
  const [material, setMaterial] = useState('');
  const [tolerance, setTolerance] = useState('±0.005mm');
  const [quantity, setQuantity] = useState('100 Units');
  const [clientIndustry, setClientIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/brass-components.png');
  const [featured, setFeatured] = useState(true);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function loadProject() {
      const p = await getProjectById(params.id);
      if (p) {
        setTitle(p.title);
        setCategory(p.category);
        setMaterial(p.material);
        setTolerance(p.tolerance);
        setQuantity(p.quantity);
        setClientIndustry(p.clientIndustry || 'General Engineering');
        setDescription(p.description);
        setImage(p.image);
        setFeatured(Boolean(p.featured));
        setSpecs(Array.isArray(p.specs) ? p.specs : []);
      }
      setLoading(false);
    }
    loadProject();
  }, [params.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await uploadProjectImage(file);
    if (res.success && res.url) {
      setImage(res.url);
    } else {
      alert('Photo upload failed: ' + res.error);
    }
    setUploading(false);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const res = await updateProject(params.id, {
      title,
      category,
      material,
      tolerance,
      quantity,
      clientIndustry: clientIndustry || 'General Engineering',
      description,
      image,
      featured,
      specs: validSpecs,
    });
    setSubmitting(false);

    if (res.success) {
      alert('Project details updated successfully!');
      router.push('/admin/work');
    } else {
      alert('Failed to update project: ' + (res.error || 'Unknown error'));
    }
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
              Client / Target Industry
            </label>
            <input
              type="text"
              value={clientIndustry}
              onChange={(e) => setClientIndustry(e.target.value)}
              placeholder="e.g. Aerospace & Defense, Automotive, General Engineering"
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            />
          </div>

          {/* Photo Upload Section */}
          <div className="flex flex-col gap-2 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Project Photo (Upload to Supabase Storage or Select Asset)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-xs font-label-technical text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90"
              />
              {uploading && <span className="font-label-technical text-xs text-primary">Uploading photo...</span>}
            </div>

            {image && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-outline-variant/60 mt-2">
                <Image src={image} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Dynamic Technical Specs Builder */}
          <div className="flex flex-col gap-2 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Technical Specifications (JSONB)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs font-label-technical text-primary uppercase font-bold hover:underline"
              >
                + Add Spec Line
              </button>
            </div>
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Parameter (e.g. Outer Diameter)"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                  className="flex-1 px-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-xs font-body-md text-on-surface"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 40.00mm ± 0.005)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 px-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-xs font-body-md text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="text-xs font-bold text-error px-2 py-1 hover:bg-error-container/40 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <input
              type="checkbox"
              id="featured-toggle"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
            />
            <label htmlFor="featured-toggle" className="font-label-technical text-xs uppercase text-on-surface cursor-pointer font-semibold">
              Feature this project on Home Page Showcase
            </label>
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
              disabled={submitting}
              className="px-space-xl py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Project Details'}
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

