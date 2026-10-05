'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminShell from '@/components/AdminShell';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/AdminToast';
import { getEnquiries, updateEnquiryStatus } from '@/lib/supabase';
import { Enquiry } from '@/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<'All' | 'New' | 'Read'>('All');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const { showToast } = useToast();

  const fetchEnquiries = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch {
      showToast('Failed to load enquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (filter === 'New') return e.status === 'New';
      if (filter === 'Read') return e.status !== 'New';
      return true;
    });
  }, [enquiries, filter]);

  const handleMarkAsRead = async (enquiry: Enquiry) => {
    const nextStatus = enquiry.status === 'New' ? 'In Review' : 'Closed';
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiry.id ? { ...e, status: nextStatus } : e))
    );
    if (selectedEnquiry?.id === enquiry.id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: nextStatus });
    }

    try {
      await updateEnquiryStatus(enquiry.id, nextStatus);
      showToast(`Marked as ${nextStatus.toLowerCase()}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    if (selectedEnquiry?.id === deleteTarget.id) {
      setSelectedEnquiry(null);
    }
    showToast('Enquiry removed', 'success');
    setDeleteTarget(null);
  };

  return (
    <AdminShell
      title="Customer Enquiries"
      subtitle="Direct quote requests, part drawings, and RFQs."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT / MAIN: Filter Tabs & List Rows                      */}
        {/* ========================================================= */}
        <div className={`flex flex-col gap-4 ${selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {/* Filter Tabs */}
          <div className="flex items-center gap-6 border-b border-outline-variant/40 pb-3">
            {(['All', 'New', 'Read'] as const).map((tab) => {
              const active = filter === tab;
              const count =
                tab === 'All'
                  ? enquiries.length
                  : tab === 'New'
                  ? enquiries.filter((e) => e.status === 'New').length
                  : enquiries.filter((e) => e.status !== 'New').length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`relative pb-2 font-label-technical text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container font-mono">
                    {count}
                  </span>
                  {active && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#cab988]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* List Content */}
          {loading ? (
            <div className="flex flex-col divide-y divide-outline-variant/30 border-y border-outline-variant/40">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 flex items-center justify-between gap-4 animate-pulse">
                  <div className="w-36 h-4 bg-surface-container rounded" />
                  <div className="w-24 h-4 bg-surface-container rounded" />
                </div>
              ))}
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant font-body-md text-sm">
              No enquiries found under {filter.toLowerCase()} filter.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
              {filteredEnquiries.map((enq) => {
                const isNew = enq.status === 'New';
                const isSelected = selectedEnquiry?.id === enq.id;

                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`py-4 px-3 flex flex-col gap-1.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#cab988]/15 border-l-2 border-primary'
                        : 'hover:bg-surface-container-low/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isNew ? 'bg-primary' : 'bg-outline-variant'
                          }`}
                        />
                        <span className="font-headline-sm text-sm uppercase text-on-surface font-bold truncate">
                          {enq.name}
                        </span>
                        {enq.company && (
                          <span className="text-xs text-on-surface-variant truncate hidden sm:inline">
                            • {enq.company}
                          </span>
                        )}
                      </div>

                      <span className="font-label-technical text-[11px] text-on-surface-variant flex-shrink-0">
                        {enq.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pl-4">
                      <p className="font-body-md text-xs text-on-surface-variant line-clamp-1">
                        <strong className="text-on-surface font-semibold">{enq.serviceType}:</strong> {enq.message}
                      </p>

                      <span
                        className={`text-[10px] font-label-technical uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] flex-shrink-0 ${
                          isNew
                            ? 'bg-primary-container text-on-primary-container font-bold'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT / DETAIL PANEL: Desktop Side / Mobile Full Modal    */}
        {/* ========================================================= */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 fixed inset-0 lg:static z-50 lg:z-auto bg-black/60 lg:bg-transparent flex items-end lg:items-start justify-center p-0 lg:p-0">
            <div
              className="w-full max-h-[85vh] lg:max-h-none overflow-y-auto bg-surface rounded-t-xl lg:rounded-[6px] border border-outline-variant/60 shadow-xl lg:shadow-xs p-6 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-outline-variant/40 pb-4">
                <div className="flex flex-col">
                  <span className="font-label-technical text-xs text-primary uppercase font-bold tracking-wider">
                    {selectedEnquiry.serviceType}
                  </span>
                  <h3 className="font-headline-sm text-lg sm:text-xl uppercase text-on-surface font-bold mt-0.5">
                    {selectedEnquiry.name}
                  </h3>
                  {selectedEnquiry.company && (
                    <span className="text-xs text-on-surface-variant font-body-md">
                      {selectedEnquiry.company}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1.5 -mr-1.5 rounded-[4px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  aria-label="Close details"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Call & WhatsApp Quick Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedEnquiry.phone.replace(/[^0-9+]/g, '')}`}
                  className="py-3 px-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.name)},%20thank%20you%20for%20enquiring%20with%20Lathe%20Pattarai%20Erode%20regarding%20${encodeURIComponent(selectedEnquiry.serviceType)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-[4px] bg-emerald-700 text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Specifications Message */}
              <div className="flex flex-col gap-2">
                <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Customer Message & Dimensions:
                </span>
                <p className="font-body-md text-sm text-on-surface leading-relaxed p-3 bg-surface-container-low rounded-[4px] border border-outline-variant/40">
                  {selectedEnquiry.message}
                </p>
              </div>

              {/* Attached Blueprint */}
              {selectedEnquiry.drawingUrl && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-technical text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Attached CAD / Blueprint:
                  </span>
                  <a
                    href={selectedEnquiry.drawingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 p-3 rounded-[4px] border border-primary/50 bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-label-technical text-xs uppercase tracking-wider font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="truncate">Download / Open Attached Drawing</span>
                  </a>
                </div>
              )}

              {/* Metadata Details */}
              <div className="flex flex-col divide-y divide-outline-variant/30 text-xs font-label-technical uppercase text-on-surface-variant border-y border-outline-variant/40">
                <div className="py-2 flex justify-between">
                  <span>Phone:</span>
                  <span className="font-mono font-bold text-on-surface">{selectedEnquiry.phone}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Email:</span>
                  <span className="font-normal normal-case text-on-surface">{selectedEnquiry.email}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Submitted:</span>
                  <span>{selectedEnquiry.createdAt}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span>Status:</span>
                  <span className="font-bold text-primary">{selectedEnquiry.status}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedEnquiry)}
                  className="px-3 py-2 text-xs font-label-technical uppercase text-error hover:bg-red-50 rounded-[4px] transition-colors"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkAsRead(selectedEnquiry)}
                  className="px-4 py-2 rounded-[4px] border border-outline-variant hover:bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider font-bold transition-colors min-h-[40px]"
                >
                  {selectedEnquiry.status === 'New' ? 'Mark as In Review' : 'Mark as Closed'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete this enquiry?"
        message={`Are you sure you want to remove the enquiry from "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
