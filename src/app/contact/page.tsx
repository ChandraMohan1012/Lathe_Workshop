'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import { initialSettings } from '@/lib/mockData';
import { createEnquiry, getWorkshopSettings } from '@/lib/supabase';
import { uploadDrawingFile } from '@/lib/supabase-storage';
import { WorkshopSettings } from '@/types';

const enquirySchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 chars)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  company: z.string().optional(),
  serviceType: z.string().min(1, 'Please select a machining service'),
  message: z.string().min(5, 'Please describe your component specs or tolerances (min 5 chars)'),
  website_hp: z.string().optional(), // Honeypot field for anti-spam
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WorkshopSettings>(initialSettings);
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      serviceType: '',
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
    setUploadError(null);
    try {
      let drawingUrl: string | undefined = undefined;

      if (drawingFile) {
        const uploadRes = await uploadDrawingFile(drawingFile);
        if (uploadRes.success) {
          drawingUrl = uploadRes.url;
        } else if (uploadRes.error) {
          setUploadError(uploadRes.error);
        }
      }

      const res = await createEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceType: data.serviceType,
        message: data.message,
        drawingUrl,
      });
      setSubmittedId(res.id);
      setDrawingFile(null);
      reset({ serviceType: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Clean phone numbers and remove double spaces
  const cleanPhone = (settings.phone || initialSettings.phone).replace(/\s+/g, ' ').trim();
  const cleanPhoneTel = cleanPhone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '');

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow pb-16 lg:pb-0">
        {/* Header Section with thin line divider */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-2 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Contact & Enquiry</span>
            </div>

            <h1 className="font-display-xl text-3xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
              Contact Workshop & Quotes
            </h1>

            <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Call our engineering desk directly or submit your CAD blueprint for evaluation.
            </p>
          </div>
        </section>

        {/* MAIN CONTACT & RFQ SECTION */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT: Large Tappable Phone & WhatsApp as Big Text, Divided by Thin Lines */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                  Direct Workshop Reach
                </span>
                <h2 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                  Get in Touch
                </h2>
              </div>

              {/* Contact Details with Thin 1px Dividers */}
              <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
                {/* Large Tappable Phone */}
                <div className="py-5 flex flex-col gap-1">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    Direct Phone Call
                  </span>
                  <a
                    href={`tel:${cleanPhoneTel}`}
                    className="font-display-xl text-2xl sm:text-3xl text-on-surface font-bold hover:text-primary transition-colors inline-block tracking-tight"
                  >
                    {cleanPhone}
                  </a>
                  <span className="font-body-md text-xs text-on-surface-variant">
                    Tap to speak directly with the workshop supervisor
                  </span>
                </div>

                {/* Large Tappable WhatsApp */}
                <div className="py-5 flex flex-col gap-1">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    WhatsApp Blueprint Desk
                  </span>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20requirement%20in%20Erode.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display-xl text-2xl sm:text-3xl text-[#6a5d34] font-bold hover:underline inline-block tracking-tight"
                  >
                    +91 {cleanWhatsapp.slice(-10, -5)} {cleanWhatsapp.slice(-5)}
                  </a>
                  <span className="font-body-md text-xs text-on-surface-variant">
                    Send photos, CAD drawings, or voice notes for rapid estimation
                  </span>
                </div>

                {/* Email Address */}
                <div className="py-4 flex flex-col gap-1">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    Engineering Desk Email
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-headline-sm text-base sm:text-lg text-on-surface hover:text-primary transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>

                {/* Physical Address */}
                <div className="py-4 flex flex-col gap-1">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    Workshop Location
                  </span>
                  <p className="font-body-md text-sm sm:text-base text-on-surface leading-snug">
                    {settings.address}
                  </p>
                </div>

                {/* Working Hours */}
                <div className="py-4 flex flex-col gap-1">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    Operating Schedule
                  </span>
                  <p className="font-body-md text-sm sm:text-base text-on-surface font-semibold">
                    {settings.workingHours}
                  </p>
                  <span className="text-xs text-on-surface-variant">Sunday by advance breakdown appointment</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Form with Underline-Style Inputs (No Boxed Inputs) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2 border-b border-outline-variant/40 pb-4">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                  Job Specifications (RFQ)
                </span>
                <h3 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                  Submit Component Requirements
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                  Call or WhatsApp for an instant quote, or fill out the enquiry form below.
                </p>
              </div>

              {submittedId ? (
                <div className="p-6 bg-surface-container-low border border-[#cab988]/60 rounded-[4px] flex flex-col gap-3">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Enquiry Submitted Successfully
                  </span>
                  <h4 className="font-headline-sm text-xl uppercase tracking-tight text-on-surface font-bold">
                    Reference ID: {submittedId}
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    Our engineering desk in Erode has received your specifications. We will review dimensions, machine capacity, and reach out promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedId(null)}
                    className="w-max mt-2 px-4 py-2 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
                  >
                    Submit Another Component
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  {/* Hidden Honeypot */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden opacity-0 w-0 h-0 pointer-events-none"
                    {...register('website_hp')}
                  />

                  {/* Name & Phone in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="Ramesh Sundaram"
                        className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors"
                      />
                      {errors.name && (
                        <span className="text-error font-label-technical text-[10px]">{errors.name.message}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors"
                      />
                      {errors.phone && (
                        <span className="text-error font-label-technical text-[10px]">{errors.phone.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Email & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="ramesh@company.com"
                        className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors"
                      />
                      {errors.email && (
                        <span className="text-error font-label-technical text-[10px]">{errors.email.message}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                        Company or Factory Name (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('company')}
                        placeholder="Kongu Textile & Pumps, Erode"
                        className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Dropdown with visible placeholder option */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                      Machining Service *
                    </label>
                    <select
                      {...register('serviceType')}
                      defaultValue=""
                      className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option value="Turning">Turning (Pump & Motor Shafts, Rollers)</option>
                      <option value="Threading">Threading (Brass Bushings, Metric & ACME)</option>
                      <option value="Boring">Boring (4-Jaw Chucking, Flanges, Housings)</option>
                      <option value="Repair and Batch work">Repair and Batch work (Emergency Breakdown, Runs)</option>
                    </select>
                    {errors.serviceType && (
                      <span className="text-error font-label-technical text-[10px]">{errors.serviceType.message}</span>
                    )}
                  </div>

                  {/* Message / Specifications */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                      Component Specifications & Quantity *
                    </label>
                    <textarea
                      rows={3}
                      {...register('message')}
                      placeholder="Specify material grade (e.g. EN8, SS304, Brass CW614N), required tolerances (e.g. ±0.005mm), batch quantity, and dimensions..."
                      className="w-full bg-transparent border-b border-outline-variant/70 focus:border-primary px-0 py-2 font-body-md text-sm text-on-surface focus:outline-none transition-colors resize-y"
                    ></textarea>
                    {errors.message && (
                      <span className="text-error font-label-technical text-[10px]">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Optional Drawing Upload (Underline style / thin border) */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-label-technical uppercase tracking-wider text-on-surface-variant">
                      <span>Attach Blueprint or CAD Drawing (Optional)</span>
                      <span className="text-[10px]">PDF, DWG, DXF, PNG, JPG (Max 15MB)</span>
                    </div>

                    {drawingFile ? (
                      <div className="flex items-center justify-between p-3 rounded-[4px] border border-primary/40 bg-surface-container">
                        <div className="flex items-center gap-2 text-xs font-label-technical text-on-surface truncate">
                          <span className="material-symbols-outlined text-primary text-base">description</span>
                          <span className="truncate font-bold">{drawingFile.name}</span>
                          <span className="text-on-surface-variant">
                            ({(drawingFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDrawingFile(null)}
                          className="text-on-surface-variant hover:text-error text-xs font-label-technical uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-outline-variant/70 hover:border-primary rounded-[4px] cursor-pointer bg-surface-container-low/40 hover:bg-surface-container-low transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.step,.stp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 15 * 1024 * 1024) {
                                setUploadError('File exceeds 15MB limit.');
                              } else {
                                setUploadError(null);
                                setDrawingFile(file);
                              }
                            }
                          }}
                          className="hidden"
                        />
                        <span className="material-symbols-outlined text-lg text-primary">upload_file</span>
                        <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface">
                          Select Blueprint / CAD File
                        </span>
                      </label>
                    )}

                    {uploadError && (
                      <span className="text-error font-label-technical text-[10px]">{uploadError}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Specifications...' : 'Submit Specifications for Quotation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FULL-WIDTH GOOGLE MAP SECTION WITH "GET DIRECTIONS" BUTTON */}
        <section className="w-full bg-surface-container-low border-t border-outline-variant/40 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                  Interactive Navigation
                </span>
                <h3 className="font-display-xl text-xl sm:text-2xl uppercase tracking-tight text-on-surface font-bold">
                  Workshop Location & Highway Access
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                  {settings.address}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'Perundurai Road, Erode, Tamil Nadu')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[4px] bg-[#181c22] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-black transition-colors border border-white/20 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-base">directions</span>
                <span>Get Directions in Google Maps</span>
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-80 sm:h-96 rounded-[6px] overflow-hidden border border-outline-variant/50 relative bg-surface-container">
              <iframe
                title="Lathe Pattarai Workshop Location in Erode"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.42316447814!2d77.65487771761614!3d11.3410364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46762f46bd%3A0x6b7d2f9b233a01a!2sPerundurai%20Rd%2C%20Erode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%]"
              ></iframe>
            </div>
          </div>
        </section>

        {/* FLOATING CALL + WHATSAPP BUTTONS (Right side on desktop, bottom bar on mobile) */}
        <div className="hidden lg:flex fixed right-6 bottom-8 z-40 flex-col gap-3">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20enquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-[4px] bg-[#181c22] text-[#cab988] border border-[#cab988]/50 flex items-center justify-center hover:bg-black transition-transform duration-200 hover:scale-105 shadow-md"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <span className="material-symbols-outlined text-2xl">chat</span>
          </a>
          <a
            href={`tel:${cleanPhoneTel}`}
            className="w-12 h-12 rounded-[4px] bg-[#6a5d34] text-white flex items-center justify-center hover:bg-[#7e6f3e] transition-transform duration-200 hover:scale-105 shadow-md"
            title={`Call Workshop: ${cleanPhone}`}
            aria-label="Call Workshop"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
          </a>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 p-3 flex items-center gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
          <a
            href={`tel:${cleanPhoneTel}`}
            className="flex-1 text-center py-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            <span>Call Workshop</span>
          </a>
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20requirement.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 rounded-[4px] bg-[#181c22] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>WhatsApp</span>
          </a>
        </div>

        <CtaBand
          title="Have an emergency breakdown part?"
          subtitle="Bring your worn physical part to our Perundurai Road workshop or call our supervisor for quick breakdown assistance."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
