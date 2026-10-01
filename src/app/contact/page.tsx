'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import { initialSettings } from '@/lib/mockData';
import { createEnquiry, getWorkshopSettings } from '@/lib/supabase';
import { WorkshopSettings } from '@/types';

const enquirySchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 chars)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  company: z.string().optional(),
  serviceType: z.string().min(1, 'Please select a machining service'),
  message: z.string().min(10, 'Please describe your component specs or tolerances'),
  website_hp: z.string().optional(), // Honeypot field for anti-spam
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WorkshopSettings>(initialSettings);

  useEffect(() => {
    getWorkshopSettings().then((res) => {
      if (res) setSettings(res);
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      serviceType: 'Heavy Lathe Turning',
      website_hp: '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    // Spam check: if honeypot is filled, discard silently
    if (data.website_hp && data.website_hp.length > 0) {
      setSubmittedId(`enq-${Date.now()}`);
      reset();
      return;
    }

    setSubmitting(true);
    try {
      const res = await createEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceType: data.serviceType,
        message: data.message,
      });
      setSubmittedId(res.id);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Request Workshop <span className="text-primary italic font-editorial-accent">Quotation</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Submit your engineering drawings or technical specifications. Our engineering desk evaluates blueprints within 2 to 4 hours.
            </p>
          </div>
        </section>

        {/* MAIN CONTACT & FORM SECTION */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-2xl">
            {/* Left Contact & Location Cards */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant/50 flex flex-col gap-space-md shadow-sm">
                <h3 className="font-headline-sm text-xl uppercase tracking-tight text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  Workshop Office
                </h3>

                <div className="flex flex-col gap-4 font-body-md text-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                    <div>
                      <strong className="text-on-surface block text-sm font-semibold">Address</strong>
                      <span className="text-sm">{settings.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">call</span>
                    <div>
                      <strong className="text-on-surface block text-sm font-semibold">Direct Phone / WhatsApp</strong>
                      <a href={`tel:${settings.phone}`} className="text-sm text-primary hover:underline">
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">mail</span>
                    <div>
                      <strong className="text-on-surface block text-sm font-semibold">Engineering Desk Email</strong>
                      <a href={`mailto:${settings.email}`} className="text-sm text-primary hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">schedule</span>
                    <div>
                      <strong className="text-on-surface block text-sm font-semibold">Workshop Hours</strong>
                      <span className="text-sm">{settings.workingHours}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right RFQ Form */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant/60 shadow-md flex flex-col gap-space-md">
                <div className="flex flex-col gap-1 border-b border-outline-variant/40 pb-space-md">
                  <h3 className="font-headline-sm text-2xl uppercase tracking-tight text-on-surface">
                    Submit Job Specifications
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Fill out the technical RFQ form below to receive itemized pricing & lead time estimates.
                  </p>
                </div>

                {submittedId ? (
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 p-space-lg rounded-xl flex flex-col gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-800 font-headline-sm text-lg uppercase font-bold">
                      <span className="material-symbols-outlined text-2xl">check_circle</span>
                      Quotation Request Submitted!
                    </div>
                    <p className="font-body-md text-sm">
                      Your enquiry reference ID is <strong className="font-mono">{submittedId}</strong>. Our engineering desk in Guindy SIDCO will review your details and contact you shortly.
                    </p>
                    <button
                      onClick={() => setSubmittedId(null)}
                      className="mt-3 w-max px-4 py-2 rounded-lg bg-emerald-800 text-white font-label-technical text-xs uppercase font-semibold hover:bg-emerald-900 transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-md">
                    {/* Hidden Honeypot anti-spam field */}
                    <input type="text" tabIndex={-1} autoComplete="off" className="hidden opacity-0 w-0 h-0 pointer-events-none" {...register('website_hp')} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          placeholder="e.g. Ramesh Sundaram"
                          className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                        />
                        {errors.name && (
                          <span className="text-error font-label-technical text-[11px]">{errors.name.message}</span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+91 98765 43210"
                          className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                        />
                        {errors.phone && (
                          <span className="text-error font-label-technical text-[11px]">{errors.phone.message}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="ramesh@company.com"
                          className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                        />
                        {errors.email && (
                          <span className="text-error font-label-technical text-[11px]">{errors.email.message}</span>
                        )}
                      </div>

                      {/* Company */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                          Company / Industrial Unit (Optional)
                        </label>
                        <input
                          type="text"
                          {...register('company')}
                          placeholder="e.g. Chennai Pump Dynamics"
                          className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                        />
                      </div>
                    </div>

                    {/* Service Type Select */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                        Select Machining Service *
                      </label>
                      <select
                        {...register('serviceType')}
                        className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                      >
                        <option value="Heavy Lathe Turning">Heavy Lathe Shaft Turning</option>
                        <option value="Brass Component Fabrication">Brass Component & Sleeve Fabrication</option>
                        <option value="Prototype Tooling & Retooling">Prototype Tooling & Die Retooling</option>
                        <option value="High Volume Batch Manufacturing">High Volume Batch Manufacturing</option>
                        <option value="Other Custom Job">Other Precision Custom Job</option>
                      </select>
                    </div>

                    {/* Message / Specs */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                        Component Specs & Quantity *
                      </label>
                      <textarea
                        rows={4}
                        {...register('message')}
                        placeholder="Detail raw material grade (e.g. SS316L, Brass C36000), required tolerances (e.g. ±0.005mm), batch quantity, and drawings..."
                        className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
                      ></textarea>
                      {errors.message && (
                        <span className="text-error font-label-technical text-[11px]">{errors.message.message}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-sm uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          <span>Processing Evaluation...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Technical RFQ</span>
                          <span className="material-symbols-outlined text-base">send</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <Footer settings={settings} />
    </>
  );
}
