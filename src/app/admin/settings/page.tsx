'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { initialSettings } from '@/lib/mockData';
import { getWorkshopSettings, updateWorkshopSettings } from '@/lib/supabase';
import { WorkshopSettings } from '@/types';
import { useToast } from '@/components/AdminToast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WorkshopSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await getWorkshopSettings();
        if (res) {
          // Clean double spaces in phone if any
          setSettings({
            ...res,
            phone: (res.phone || '').replace(/\s+/g, ' ').trim(),
            whatsapp: (res.whatsapp || '').replace(/\s+/g, ' ').trim(),
          });
        }
      } catch {
        showToast('Failed to load current settings.', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Clean phone numbers
    const cleanedSettings: WorkshopSettings = {
      ...settings,
      phone: settings.phone.replace(/\s+/g, ' ').trim(),
      whatsapp: settings.whatsapp.replace(/\s+/g, ' ').trim(),
    };

    try {
      const res = await updateWorkshopSettings(cleanedSettings);
      if (res.success) {
        setSettings(cleanedSettings);
        showToast('Settings saved! Updates are now live on the website.', 'success');
      } else {
        showToast(res.error || 'Failed to update settings.', 'error');
      }
    } catch {
      showToast('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Workshop Settings"
      subtitle="Update phone numbers, working hours, and operational capacity."
    >
      <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-10">
        {/* Live Website Notification Notice */}
        <div className="p-3.5 bg-surface-container-low border border-primary/30 rounded-[4px] flex items-center gap-2.5 text-xs font-body-md text-on-surface">
          <span className="material-symbols-outlined text-base text-primary flex-shrink-0">
            info
          </span>
          <span>
            Changes saved here appear immediately across the public website, including the header, footer, contact page, and JSON-LD schema.
          </span>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: CONTACT DETAILS                                */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 border-b border-outline-variant/40 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
              1. Contact Information
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Phone and WhatsApp numbers used by clients for instant job quotes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Phone Number (Direct Call) *
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 63694 31485"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+91 63694 31485"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Engineering Desk Email *
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="chandruselvam1012@gmail.com"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: WORKSHOP LOCATION & HOURS                      */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 border-b border-outline-variant/40 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
              2. Workshop Location & Hours
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Address on Perundurai Road and operating schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Workshop Address *
              </label>
              <textarea
                rows={2}
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Perundurai Road, Erode Industrial Area, Erode, Tamil Nadu 638011"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2 font-body-md text-base text-on-surface focus:outline-none transition-colors resize-y"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Working Hours *
              </label>
              <input
                type="text"
                required
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                placeholder="Mon - Sat: 8:30 AM - 7:30 PM"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: WORKSHOP OPERATIONAL NUMBERS                   */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-display-xl text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
              3. Operational Numbers & Standards
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Lathe turning bay capacity and standard tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Active Turning Bays
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.activeBays}
                onChange={(e) => setSettings({ ...settings, activeBays: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Total Bays
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.totalBays}
                onChange={(e) => setSettings({ ...settings, totalBays: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Standard Calibrated Tolerance
              </label>
              <input
                type="text"
                value={settings.standardTolerance}
                onChange={(e) => setSettings({ ...settings, standardTolerance: e.target.value })}
                placeholder="±0.005mm"
                className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STICKY BOTTOM BAR ON MOBILE / STANDARD ON DESKTOP         */}
        {/* ========================================================= */}
        <div className="fixed lg:static bottom-0 left-0 right-0 z-40 bg-surface/98 backdrop-blur-md border-t border-outline-variant/60 lg:border-none p-3 lg:p-0 flex items-center justify-end gap-3 shadow-lg lg:shadow-none">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Workshop Settings</span>
            )}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
