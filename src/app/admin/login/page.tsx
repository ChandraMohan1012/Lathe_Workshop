'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        const supabase = createSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !data.user) {
          setError(authError?.message || 'Invalid email or password. Please check your credentials.');
          setLoading(false);
          return;
        }
      } else {
        // Fallback for offline demo mode without Supabase env credentials
        if (!email.trim() || !password.trim()) {
          setError('Please enter both your admin email and password.');
          setLoading(false);
          return;
        }
        document.cookie = 'lathe_admin_demo_session=true; path=/; max-age=86400';
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to the authentication server. Please check your network.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-surface p-6 sm:p-8 rounded-[6px] border border-outline-variant/60 shadow-xs flex flex-col gap-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative h-12 w-12 bg-surface-container rounded-[4px] p-1 border border-outline-variant/50">
          <Image src="/images/logo.png" alt="Lathe Pattarai Logo" fill className="object-contain p-0.5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display-xl text-xl uppercase tracking-tight text-on-surface font-bold">
            Admin Sign In
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Workshop management portal for Lathe Pattarai
          </p>
        </div>
      </div>

      {/* Error message banner */}
      {error && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-[4px] text-xs font-body-md flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-base text-red-700 flex-shrink-0 mt-0.5">
            error
          </span>
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lathepattarai.com"
            className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/40"
          />
        </div>

        {/* Password with show/hide toggle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-technical text-xs uppercase tracking-wider text-on-surface font-semibold">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="font-label-technical text-[11px] text-primary uppercase font-bold hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-transparent border-b border-outline-variant/80 focus:border-primary px-0 py-2.5 font-body-md text-base text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/40 pr-8"
            />
          </div>
        </div>

        {/* Sign In Button with loading spinner */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-4 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="w-full min-h-screen bg-[#181c22] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-white font-label-technical text-xs uppercase">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
