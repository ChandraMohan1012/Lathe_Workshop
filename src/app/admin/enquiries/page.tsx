'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { getEnquiries, updateEnquiryStatus } from '@/lib/supabase';
import { Enquiry } from '@/types';
import { mockEnquiries } from '@/lib/mockData';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnquiries().then((data) => {
      setEnquiries(data);
      setLoading(false);
    });
  }, []);

  const filteredEnquiries = enquiries.filter((e) => filter === 'All' || e.status === filter);

  const handleUpdateStatus = async (id: string, newStatus: Enquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    await updateEnquiryStatus(id, newStatus);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-grow p-space-xl overflow-y-auto flex flex-col gap-space-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border-b border-outline-variant/40 pb-space-md">
          <div className="flex flex-col">
            <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
              CUSTOMER INQUIRIES & BLUEPRINTS
            </span>
            <h1 className="font-display-xl text-headline-lg uppercase text-on-surface tracking-tight">
              Manage RFQ Enquiries
            </h1>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 font-label-technical text-xs uppercase font-semibold">
            {['All', 'New', 'Quoted', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  filter === st
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiries Grid */}
        <div className="flex flex-col gap-space-md">
          {filteredEnquiries.length === 0 ? (
            <div className="p-space-2xl text-center bg-surface-container-lowest rounded-xl border border-outline-variant/50 text-on-surface-variant font-label-technical text-xs uppercase">
              No enquiries match the selected filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-xs flex flex-col gap-space-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-headline-sm text-base uppercase text-on-surface font-semibold">
                      {enq.name}
                    </span>
                    {enq.company && (
                      <span className="bg-surface-container px-2.5 py-0.5 rounded font-label-technical text-xs text-on-surface-variant font-semibold">
                        {enq.company}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-label-technical text-xs text-on-surface-variant">
                      {enq.createdAt}
                    </span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                      className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-technical text-xs uppercase font-bold focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-label-technical text-xs text-on-surface-variant uppercase">
                  <div>
                    <span>Service: </span>
                    <strong className="text-on-surface">{enq.serviceType}</strong>
                  </div>
                  <div>
                    <span>Phone: </span>
                    <a href={`tel:${enq.phone}`} className="text-primary font-mono font-bold">
                      {enq.phone}
                    </a>
                  </div>
                  <div>
                    <span>Email: </span>
                    <a href={`mailto:${enq.email}`} className="text-primary underline">
                      {enq.email}
                    </a>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/30 text-on-surface font-body-md text-sm">
                  <span className="block font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Component Specifications / Message:
                  </span>
                  {enq.message}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
