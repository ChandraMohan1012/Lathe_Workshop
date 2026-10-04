'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';
import { createProject } from '@/lib/supabase';
import { uploadProjectImage } from '@/lib/supabase-storage';

export default function AdminNewWorkPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Precision Turning');
  const [material, setMaterial] = useState('');
  const [tolerance, setTolerance] = useState('±0.005mm');
  const [quantity, setQuantity] = useState('100 Units');
  const [clientIndustry, setClientIndustry] = useState('General Engineering');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/brass-components.png');
  const [featured, setFeatured] = useState(true);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Outer Diameter', value: '40.00mm ± 0.005' },
    { label: 'Surface Finish', value: 'Ra 0.4 µm Ground' },
  ]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const res = await createProject({
      slug: slug || `project-${Date.now()}`,
      title,
      category,
      material,
      tolerance,
      quantity,
      completionDate: new Date().toISOString().split('T')[0],
      clientIndustry: clientIndustry || 'General Engineering',
      image,
      description,
      specs: validSpecs,
      featured,
    });

    setSubmitting(false);

    if (res.success) {
      alert('New project published to catalog!');
      router.push('/admin/work');
    } else {
      alert('Failed to publish project to catalog: ' + (res.error || 'Unknown error'));
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        <div className="flex flex-col gap-1 border-b border-outline-variant/40 pb-space-md">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
            Add New Portfolio Project
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
              placeholder="e.g. Precision Brass Threaded Bushings"
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
                <option value="Lathe Turning">Lathe Turning</option>
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
                placeholder="e.g. ±0.005mm"
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
                placeholder="e.g. SS316L Stainless Steel"
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
                placeholder="e.g. 500 Units"
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
              placeholder="e.g. Textile Machinery, Pump & Motor, Automotive, General Engineering"
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
              placeholder="Describe machining operations, threads, grooves, and finish..."
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {submitting ? 'Publishing Project...' : 'Publish Project to Catalog'}
          </button>
        </form>
      </main>
    </div>
  );
}

