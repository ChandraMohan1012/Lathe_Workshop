'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Works', href: '/admin/work', icon: 'inventory_2' },
    { label: 'Add Work', href: '/admin/work/new', icon: 'add_circle' },
    { label: 'Enquiries', href: '/admin/enquiries', icon: 'chat' },
    { label: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];

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

  return (
    <aside className="w-60 bg-[#1e2126] text-white min-h-screen p-4 flex flex-col justify-between flex-shrink-0 border-r border-[#2d3037]">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <Link href="/admin" className="flex items-center gap-3 px-2 border-b border-[#2d3037] pb-4">
          <div className="relative h-8 w-8 bg-white/10 rounded-[4px] p-1 border border-white/10 flex-shrink-0">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm uppercase text-white tracking-tight font-bold">
              Lathe Pattarai
            </span>
            <span className="font-label-technical text-[9px] uppercase tracking-widest text-[#cab988]">
              Owner Portal
            </span>
          </div>
        </Link>

        {/* Menu Links */}
        <nav className="flex flex-col gap-1 font-label-technical text-xs uppercase tracking-wider">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[4px] transition-colors ${
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

      {/* Footer / Actions */}
      <div className="pt-4 border-t border-[#2d3037] flex flex-col gap-1 font-label-technical text-xs uppercase tracking-wider">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-[#c5c7d0] hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          <span>View Public Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
