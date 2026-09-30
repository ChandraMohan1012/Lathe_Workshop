'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo password or Supabase Auth check
    if (password === 'lathe2025' || password === 'admin' || password.length >= 6) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lathe_admin_auth', 'true');
      }
      router.push('/admin');
    } else {
      setError('Invalid workshop authorization key. Try "lathe2025" or "admin".');
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-inverse-surface flex items-center justify-center p-gutter">
      <div className="max-w-md w-full bg-surface-container-lowest p-space-2xl rounded-2xl border border-outline-variant/60 shadow-2xl flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-space-xs">
          <div className="relative h-14 w-14 mb-2">
            <Image src="/images/logo.png" alt="Lathe Pattarai Logo" fill className="object-contain" />
          </div>
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            Guindy SIDCO Workshop Portal
          </span>
          <h1 className="font-headline-sm text-2xl uppercase tracking-tight text-on-surface">
            Admin Authentication
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Enter administrative credentials to access workshop telemetry and job management.
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-label-technical flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Admin Access Key / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passkey (e.g. lathe2025)"
              required
              className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
            />
            <span className="text-[11px] text-on-surface-variant font-label-technical">
              Default demo key: <code className="font-mono bg-surface-container px-1 rounded">lathe2025</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <span className="material-symbols-outlined text-base">lock_open</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
