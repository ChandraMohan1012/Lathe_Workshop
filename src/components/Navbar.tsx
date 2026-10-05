'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { WorkshopSettings } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface NavbarProps {
  settings?: WorkshopSettings;
}

export default function Navbar({ settings = initialSettings }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Ongoing', href: '/ongoing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const cleanPhone = (settings.phone || initialSettings.phone).replace(/[^0-9]/g, '');
  const cleanWhatsapp = (settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-250 ${
        isScrolled
          ? 'bg-surface/98 backdrop-blur-md border-b border-outline-variant/60 shadow-[0_2px_12px_-2px_rgba(24,28,34,0.08)]'
          : 'bg-surface/90 backdrop-blur-sm border-b border-outline-variant/30'
      }`}
    >
      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt={`${settings.workshopName} Logo`}
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
              {settings.workshopName}
            </span>
            <span className="font-label-technical text-[10px] uppercase tracking-widest text-primary font-medium">
              Erode, Tamil Nadu
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-path={item.label.toLowerCase()}
                aria-current={active ? 'page' : undefined}
                className={`font-label-technical text-[12px] uppercase tracking-wider py-2 px-3 rounded-[4px] transition-colors ${
                  active
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20requirement.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-surface-container text-on-surface font-label-technical text-[11px] uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-colors border border-outline-variant/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-primary text-on-primary font-label-technical text-[11px] uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">call</span>
            <span>Call</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface hover:text-primary rounded-[4px] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-[4px] font-label-technical text-xs uppercase tracking-wider transition-colors ${
                  active
                    ? 'bg-primary-container/60 text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-outline-variant/30 flex gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="flex-1 text-center py-2.5 rounded-[4px] bg-primary text-on-primary font-label-technical text-xs uppercase tracking-wider font-semibold"
            >
              Call Workshop
            </a>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20requirement.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-[4px] bg-surface-container text-on-surface border border-outline-variant font-label-technical text-xs uppercase tracking-wider font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
