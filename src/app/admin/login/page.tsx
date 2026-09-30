'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        // Pure Supabase Auth signInWithPassword
        const supabase = createSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !data.user) {
          setError(authError?.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }
      } else {
        // Fallback for offline demo mode without Supabase env credentials
        if (!email || !password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }
        document.cookie = 'lathe_admin_demo_session=true; path=/; max-age=86400';
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
      setLoading(false);
    }
  };

  return (
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
          Sign in with registered Supabase Owner credentials.
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
            Admin Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lathepattarai.com"
            className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
            Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-body-md text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to Admin Portal</span>
              <span className="material-symbols-outlined text-base">lock_open</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="w-full min-h-screen bg-inverse-surface flex items-center justify-center p-gutter">
      <Suspense fallback={<div className="text-white font-label-technical text-xs uppercase">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
