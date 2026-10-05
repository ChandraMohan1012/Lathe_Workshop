'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { ToastProvider } from '@/components/AdminToast';

interface AdminShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({
  title,
  subtitle,
  backHref,
  action,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
      document.cookie = 'lathe_admin_demo_session=; path=/; max-age=0';
    } catch (err) {
      console.error(err);
    }
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard', shortLabel: 'Home' },
    { label: 'Works', href: '/admin/work', icon: 'inventory_2', shortLabel: 'Works' },
    { label: 'Add Work', href: '/admin/work/new', icon: 'add_circle', shortLabel: 'Add', isSpecial: true },
    { label: 'Enquiries', href: '/admin/enquiries', icon: 'chat', shortLabel: 'Enquiries' },
    { label: 'Settings', href: '/admin/settings', icon: 'settings', shortLabel: 'Settings' },
  ];

  const isTabActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface flex flex-col lg:flex-row text-on-surface">
        {/* ========================================================= */}
        {/* DESKTOP SLIM SIDEBAR (1024px+)                            */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex w-60 bg-[#1e2126] text-white flex-col justify-between flex-shrink-0 border-r border-[#2d3037] sticky top-0 h-screen py-6 px-4">
          <div className="flex flex-col gap-8">
            {/* Workshop Brand Header */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative h-8 w-8 bg-white/10 rounded-[4px] p-1 border border-white/10 flex-shrink-0">
                <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm uppercase text-white font-bold tracking-tight">
                  Lathe Pattarai
                </span>
                <span className="font-label-technical text-[10px] uppercase tracking-widest text-[#cab988]">
                  Owner Portal
                </span>
              </div>
            </div>

            {/* Navigation links (Slim text links with small active indicator) */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const active = isTabActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[4px] font-label-technical text-xs uppercase tracking-wider transition-colors ${
                      active
                        ? 'text-white font-bold bg-white/10'
                        : 'text-[#c5c7d0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#cab988] rounded-r" />
                    )}
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Footer Actions */}
          <div className="pt-4 border-t border-[#2d3037] flex flex-col gap-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-label-technical uppercase tracking-wider text-[#c5c7d0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              <span>View Public Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-label-technical uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MOBILE TOP BAR (<1024px)                                  */}
        {/* ========================================================= */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#1e2126] text-white border-b border-[#2d3037] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6 bg-white/10 rounded-[2px] p-0.5 border border-white/10">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-headline-sm text-sm uppercase text-white font-bold tracking-tight">
              Lathe Pattarai
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="p-2 text-[#c5c7d0] hover:text-white text-xs"
              title="View Public Site"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:text-red-300 text-xs"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA                                         */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Page Header */}
          <div className="sticky top-14 lg:top-0 z-30 bg-surface/95 backdrop-blur-xs border-b border-outline-variant/40 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {backHref && (
                  <Link
                    href={backHref}
                    className="p-1.5 -ml-1.5 rounded-[4px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex-shrink-0"
                    aria-label="Go back"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                  </Link>
                )}
                <div className="flex flex-col min-w-0">
                  <h1 className="font-display-xl text-xl sm:text-2xl uppercase tracking-tight text-on-surface font-bold truncate">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {action && <div className="flex-shrink-0">{action}</div>}
            </div>
          </div>

          {/* Page Body with bottom padding for mobile tab bar */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>

        {/* ========================================================= */}
        {/* MOBILE BOTTOM TAB BAR (<1024px)                           */}
        {/* ========================================================= */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1e2126] text-white border-t border-[#2d3037] h-16 px-2 flex items-center justify-around shadow-lg">
          {navLinks.map((tab) => {
            const active = isTabActive(tab.href);
            if (tab.isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center justify-center -mt-5"
                  aria-label="Add new work"
                >
                  <div className="w-12 h-12 rounded-full bg-[#6a5d34] text-white border-2 border-[#1e2126] flex items-center justify-center shadow-md active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-2xl">add</span>
                  </div>
                  <span className="text-[10px] font-label-technical uppercase tracking-wider text-[#cab988] font-bold mt-0.5">
                    {tab.shortLabel}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-[4px] min-w-[56px] transition-colors ${
                  active ? 'text-[#cab988] font-bold' : 'text-[#c5c7d0] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                <span className="text-[10px] font-label-technical uppercase tracking-wider mt-0.5">
                  {tab.shortLabel}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
