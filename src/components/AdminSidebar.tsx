'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Manage Works', href: '/admin/work', icon: 'inventory_2' },
    { label: 'Add New Project', href: '/admin/work/new', icon: 'add_box' },
    { label: 'Enquiries / RFQs', href: '/admin/enquiries', icon: 'mark_email_unread' },
    { label: 'Workshop Settings', href: '/admin/settings', icon: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-inverse-surface text-inverse-on-surface min-h-screen p-space-md flex flex-col justify-between flex-shrink-0 border-r border-surface-container-highest">
      <div className="flex flex-col gap-space-lg">
        {/* Header */}
        <Link href="/admin" className="flex items-center gap-space-sm p-space-xs border-b border-surface-variant/30 pb-4">
          <div className="relative h-8 w-8 bg-surface rounded p-1">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm uppercase text-white tracking-wider">
              Lathe Pattarai
            </span>
            <span className="font-label-technical text-[9px] uppercase tracking-widest text-primary-fixed-dim">
              Admin Control Panel
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-surface-dim hover:text-white hover:bg-surface-variant/20'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="pt-space-md border-t border-surface-variant/20 flex flex-col gap-2 font-label-technical text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-surface-dim hover:text-white hover:bg-surface-variant/20"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          <span>View Public Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-error-container hover:bg-error/20 w-full text-left"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
