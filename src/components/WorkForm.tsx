'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Project } from '@/types';
import { uploadProjectImage } from '@/lib/supabase-storage';
import { useToast } from '@/components/AdminToast';

interface WorkFormProps {
  initialData?: Partial<Project>;
  isEditing?: boolean;
  onSubmit: (data: {
    slug: string;
    title: string;
    category: string;
    material: string;
    tolerance: string;
    quantity: string;
    completionDate: string;
    clientIndustry: string;
    image: string;
    description: string;
    specs: { label: string; value: string }[];
    featured: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
}

const CATEGORIES = [
  'Turning',
  'Threading',
  'Boring',
  'Repair and Batch work',
  'Precision Turning',
  'Heavy Duty Turning',
];

export default function WorkForm({ initialData, isEditing = false, onSubmit }: WorkFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [material, setMaterial] = useState(initialData?.material || '');
  const [tolerance, setTolerance] = useState(initialData?.tolerance || '±0.005mm');
  const [quantity, setQuantity] = useState(initialData?.quantity || '');
  const [clientIndustry, setClientIndustry] = useState(initialData?.clientIndustry || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '/images/hero-macro-cnc.png');
  const [featured, setFeatured] = useState(initialData?.featured ?? true);

  // Status toggle: "Completed" vs "Ongoing"
  const isInitiallyOngoing = initialData?.completionDate === 'Ongoing';
  const [statusType, setStatusType] = useState<'Completed' | 'Ongoing'>(
    isInitiallyOngoing ? 'Ongoing' : 'Completed'
  );
  const [completionDate, setCompletionDate] = useState(
    initialData?.completionDate && initialData?.completionDate !== 'Ongoing'
      ? initialData.completionDate
      : new Date().toISOString().split('T')[0]
  );
  const [progress, setProgress] = useState(50);

  // Dynamic specs without hardcoded dummy rows
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    Array.isArray(initialData?.specs) ? initialData!.specs : []
  );

  // Loading & error states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Dirty state tracking for unsaved changes warning
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setIsDirty(true);
  }, [title, category, material, tolerance, quantity, clientIndustry, description, image, featured, statusType, completionDate, specs]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !submitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, submitting]);

  // Photo upload handler with 5MB validation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photo is larger than 5MB. Please choose a smaller photo.');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a JPG, PNG, or WEBP image.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadProjectImage(file);
      if (res.success && res.url) {
        setImage(res.url);
        showToast('Photo uploaded successfully!', 'success');
      } else {
        setUploadError(res.error || 'Failed to upload photo. Please check network connection.');
      }
    } catch {
      setUploadError('An unexpected error occurred during photo upload.');
    } finally {
      setUploading(false);
    }
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
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a component title.');
      return;
    }
    if (!category) {
      setFormError('Please select a machining category.');
      return;
    }
    if (!material.trim()) {
      setFormError('Please enter the raw material grade.');
      return;
    }

    setSubmitting(true);

    const slug =
      initialData?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const result = await onSubmit({
      slug: slug || `work-${Date.now()}`,
      title: title.trim(),
      category,
      material: material.trim(),
      tolerance: tolerance.trim() || '±0.005mm',
      quantity: quantity.trim() || '1 Unit',
      completionDate: statusType === 'Ongoing' ? 'Ongoing' : completionDate,
      clientIndustry: clientIndustry.trim() || 'General Engineering',
      image,
      description: description.trim(),
      specs: validSpecs,
      featured,
    });

    setSubmitting(false);

    if (result.success) {
      setIsDirty(false);
      showToast(isEditing ? 'Work updated successfully!' : 'New work added to catalog!', 'success');
      router.push('/admin/work');
    } else {
      setFormError(result.error || 'Failed to save changes. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Inline Form Error Banner */}
      {formError && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-[4px] text-xs font-body-md flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-base text-red-700 flex-shrink-0 mt-0.5">
            error
          </span>
          <span>{formError}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 1: BASIC DETAILS                                 */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-6 border-b border-outline-variant/40 pb-8">
        <div className="flex flex-col gap-1">
          <span className="font-label-technical text-xs text-primary uppercase font-bold tracking-widest">
            Step 1 of 3
          </span>
          <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
            Basic Details
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Component name, machining category, and material type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Component Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Submersible Pump Drive Shaft 75mm"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/40"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors cursor-pointer"
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Raw Material Grade */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Material Grade *
            </label>
            <input
              type="text"
              required
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. SS316L, EN8, Brass CW614N"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        {/* Status Toggle: Ongoing vs Completed */}
        <div className="flex flex-col gap-3 pt-2">
          <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
            Job Status
          </label>
          <div className="inline-flex rounded-[4px] border border-outline-variant/60 p-1 w-max bg-surface-container-low">
            <button
              type="button"
              onClick={() => setStatusType('Completed')}
              className={`px-4 py-2 rounded-[3px] text-xs font-label-technical uppercase tracking-wider font-bold transition-colors ${
                statusType === 'Completed'
                  ? 'bg-[#6a5d34] text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Completed Work
            </button>
            <button
              type="button"
              onClick={() => setStatusType('Ongoing')}
              className={`px-4 py-2 rounded-[3px] text-xs font-label-technical uppercase tracking-wider font-bold transition-colors ${
                statusType === 'Ongoing'
                  ? 'bg-[#6a5d34] text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Ongoing in Bay
            </button>
          </div>

          {statusType === 'Completed' ? (
            <div className="flex flex-col gap-1 max-w-xs pt-1">
              <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                Completion Date
              </span>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-1.5 font-body-md text-base text-on-surface focus:outline-none"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-w-sm pt-1">
              <div className="flex justify-between text-xs font-label-technical uppercase">
                <span className="text-on-surface-variant">Estimated Progress</span>
                <span className="font-bold text-primary font-mono">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-2 accent-[#6a5d34] cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: DETAILS & SPECIFICATIONS                       */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-6 border-b border-outline-variant/40 pb-8">
        <div className="flex flex-col gap-1">
          <span className="font-label-technical text-xs text-primary uppercase font-bold tracking-widest">
            Step 2 of 3
          </span>
          <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
            Details & Tolerances
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Tolerances, batch quantities, and technical parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Tolerance */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Tolerance Standard
            </label>
            <input
              type="text"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              placeholder="e.g. ±0.005mm"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Batch Quantity
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500 Units"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
            />
          </div>

          {/* Client Industry */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Target Industry
            </label>
            <input
              type="text"
              value={clientIndustry}
              onChange={(e) => setClientIndustry(e.target.value)}
              placeholder="e.g. Textile, Agricultural Pumps"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
            Component Description & Operations
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe operations: turning, internal threading, bore counterboring, bearing journal ground finishes..."
            className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2 font-body-md text-base text-on-surface focus:outline-none transition-colors resize-y"
          />
        </div>

        {/* Dynamic Spec Rows Builder (Label + Value) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Custom Measurement Specs (Optional)
            </span>
            <button
              type="button"
              onClick={handleAddSpec}
              className="font-label-technical text-xs uppercase font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Spec Line</span>
            </button>
          </div>

          {specs.length === 0 ? (
            <p className="text-xs text-on-surface-variant font-body-md italic">
              No custom specs added. Click &quot;Add Spec Line&quot; if you want to display specific dimensions (e.g. Outer Diameter, Thread Pitch, Bearing Bore).
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Measurement (e.g. Outer Dia)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                    className="flex-1 bg-transparent border-b border-outline-variant px-0 py-1.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 50.00mm ±0.005)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 bg-transparent border-b border-outline-variant px-0 py-1.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-on-surface-variant hover:text-error text-xs"
                    title="Remove spec"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="featured-toggle"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded-[2px] text-[#6a5d34] border-outline-variant focus:ring-0 cursor-pointer"
          />
          <label
            htmlFor="featured-toggle"
            className="font-body-md text-sm text-on-surface cursor-pointer select-none"
          >
            Show this work on the home page showcase
          </label>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: PHOTOS                                         */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex flex-col gap-1">
          <span className="font-label-technical text-xs text-primary uppercase font-bold tracking-widest">
            Step 3 of 3
          </span>
          <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
            Work Photo
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Upload clear photography of the finished component (max 5MB, JPG/PNG/WEBP).
          </p>
        </div>

        {uploadError && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-[4px] text-xs font-body-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base text-red-700">error</span>
            <span>{uploadError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Current Cover Preview */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
              Cover Preview
            </span>
            <div className="relative w-44 aspect-[4/3] rounded-[4px] overflow-hidden border border-outline-variant/60 bg-surface-container">
              <Image src={image} alt="Component cover" fill className="object-cover" />
            </div>
          </div>

          {/* Upload Input */}
          <div className="flex flex-col gap-3 flex-grow">
            <label className="flex flex-col items-center justify-center p-6 border border-dashed border-outline-variant/80 hover:border-primary rounded-[4px] cursor-pointer bg-surface-container-low/40 hover:bg-surface-container transition-colors group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="material-symbols-outlined text-3xl text-primary mb-1">
                add_photo_alternate
              </span>
              <span className="font-label-technical text-xs uppercase tracking-wider font-bold text-on-surface">
                {uploading ? 'Uploading Photo...' : 'Take Photo or Choose from Gallery'}
              </span>
              <span className="text-[11px] text-on-surface-variant font-body-md mt-0.5">
                JPG, PNG, or WEBP up to 5MB
              </span>
            </label>

            {/* Quick stock fallback options if offline */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-label-technical text-[10px] uppercase tracking-wider text-on-surface-variant">
                Or select existing workshop photo:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  '/images/hero-macro-cnc.png',
                  '/images/brass-components.png',
                  '/images/lathe-chuck.png',
                  '/images/precision-craft.png',
                  '/images/workshop-floor.png',
                ].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImage(src)}
                    className={`relative w-14 h-10 rounded-[3px] overflow-hidden border flex-shrink-0 ${
                      image === src ? 'border-primary ring-2 ring-primary' : 'border-outline-variant'
                    }`}
                  >
                    <Image src={src} alt="Stock choice" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STICKY BOTTOM BAR ON MOBILE / STANDARD ON DESKTOP         */}
      {/* ========================================================= */}
      <div className="fixed lg:static bottom-0 left-0 right-0 z-40 bg-surface/98 backdrop-blur-md border-t border-outline-variant/60 lg:border-none p-3 lg:p-0 flex items-center justify-end gap-3 shadow-lg lg:shadow-none">
        <button
          type="button"
          onClick={() => router.push('/admin/work')}
          className="px-5 py-2.5 rounded-[4px] border border-outline-variant text-on-surface font-label-technical text-xs uppercase tracking-wider font-semibold hover:bg-surface-container transition-colors min-h-[44px]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
        >
          {submitting ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEditing ? 'Save Changes' : 'Publish Work'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
