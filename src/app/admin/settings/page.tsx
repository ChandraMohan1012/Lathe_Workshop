'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { initialSettings } from '@/lib/mockData';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.assign(initialSettings, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        <div className="flex flex-col gap-1 border-b border-outline-variant/40 pb-space-md">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            WORKSHOP CONFIGURATION
          </span>
          <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
            Facility & Operational Settings
          </h1>
        </div>

        {saved && (
          <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-space-md rounded-xl font-label-technical text-xs uppercase font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Workshop settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl bg-surface-container-lowest p-space-xl rounded-xl border border-outline-variant/60 shadow-xs flex flex-col gap-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Workshop Name
              </label>
              <input
                type="text"
                value={settings.workshopName}
                onChange={(e) => setSettings({ ...settings, workshopName: e.target.value })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Calibrated Tolerance Standard
              </label>
              <input
                type="text"
                value={settings.standardTolerance}
                onChange={(e) => setSettings({ ...settings, standardTolerance: e.target.value })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Active Turning Bays
              </label>
              <input
                type="number"
                value={settings.activeBays}
                onChange={(e) => setSettings({ ...settings, activeBays: parseInt(e.target.value) || 0 })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Total Workshop Bays
              </label>
              <input
                type="number"
                value={settings.totalBays}
                onChange={(e) => setSettings({ ...settings, totalBays: parseInt(e.target.value) || 0 })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                Direct Phone / Call
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
                WhatsApp Contact
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Engineering Desk Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Full Workshop Address
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-md text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md mt-2"
          >
            Save Workshop Settings
          </button>
        </form>
      </main>
    </div>
  );
}
