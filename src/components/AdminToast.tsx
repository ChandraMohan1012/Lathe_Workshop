'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-[6px] text-xs font-label-technical uppercase tracking-wider shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
              t.type === 'error'
                ? 'bg-[#ba1a1a] text-white border-red-700'
                : t.type === 'info'
                ? 'bg-[#181c22] text-[#cab988] border-[#cab988]/40'
                : 'bg-[#1e4620] text-emerald-100 border-emerald-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {t.type === 'error' ? 'error' : t.type === 'info' ? 'info' : 'check_circle'}
              </span>
              <span className="font-semibold normal-case text-xs tracking-normal">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/70 hover:text-white p-1"
              aria-label="Close notification"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      showToast: (msg: string) => {
        if (typeof window !== 'undefined') console.log('[Toast]', msg);
      },
    };
  }
  return ctx;
}
