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
    window.addEventListener('scroll', handleScroll);
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface-container-lowest/98 backdrop-blur-md shadow-md border-b border-outline-variant/40 nav-scrolled'
          : 'bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-space-md group">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Lathe Pattarai Brand Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
              Lathe Pattarai
            </span>
            <span className="font-label-technical text-[10px] uppercase tracking-widest text-primary font-medium">
              Precision Machining Workshop
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
                className={`font-label-technical text-[12px] uppercase tracking-wider transition-all py-2 px-3 rounded-DEFAULT ${
                  active
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-space-sm">
          <a
            href={`https://wa.me/${(settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-space-xs px-space-md py- space-xs py-2 rounded-full bg-surface-container text-on-surface font-label-technical text-[11px] uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-all border border-outline-variant"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Call / WhatsApp</span>
          </a>

          <Link
            href="/contact"
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary/90 transition-colors shadow-xs"
            title="Request Quotation"
          >
            <span className="material-symbols-outlined text-[18px]">build_circle</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface hover:text-primary rounded-lg focus:outline-none"
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
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant px-gutter py-4 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-label-technical text-sm uppercase tracking-wider ${
                  active
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`https://wa.me/${(settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full text-center py-3 rounded-full bg-primary text-on-primary font-label-technical text-xs uppercase tracking-wider font-semibold"
          >
            Contact via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
