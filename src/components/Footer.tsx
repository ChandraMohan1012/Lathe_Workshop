import Link from 'next/link';
import Image from 'next/image';
import { WorkshopSettings } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface FooterProps {
  settings?: WorkshopSettings;
}

export default function Footer({ settings = initialSettings }: FooterProps) {
  const cleanPhone = (settings.phone || initialSettings.phone).replace(/\s+/g, ' ').trim();
  const cleanWhatsapp = (settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Ongoing', href: '/ongoing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="w-full bg-[#24272c] text-inverse-on-surface border-t border-[#3a3d45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-12 border-b border-[#3a3d45]">
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-9 w-9 flex-shrink-0 bg-white/10 rounded-[4px] p-1 border border-white/10">
                <Image
                  src="/images/logo.png"
                  alt={`${settings.workshopName} Logo`}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-headline-sm text-lg uppercase tracking-tight text-white">
                {settings.workshopName}
              </span>
            </Link>

            <p className="font-body-md text-sm text-[#c5c7d0] leading-relaxed max-w-sm">
              Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work for regional engineering, pump, and textile sectors.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${cleanPhone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#6a5d34] text-white text-xs font-label-technical uppercase tracking-wider hover:bg-[#7e6f3e] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Call {cleanPhone}</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20need%20a%20quote%20for%20lathe%20job%20work.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 text-white text-xs font-label-technical uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/15"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (identical to Navbar) */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-technical text-xs uppercase tracking-widest text-[#cab988] font-bold pb-2 border-b border-[#3a3d45]">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 font-body-md text-sm text-[#d7dae3]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#cab988] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Workshop Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-technical text-xs uppercase tracking-widest text-[#cab988] font-bold pb-2 border-b border-[#3a3d45]">
              Workshop Location
            </h4>
            <div className="flex flex-col gap-3 font-body-md text-sm text-[#d7dae3]">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#cab988] text-base mt-0.5 flex-shrink-0">location_on</span>
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#cab988] text-base flex-shrink-0">call</span>
                <a
                  href={`tel:${cleanPhone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {cleanPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#cab988] text-base flex-shrink-0">mail</span>
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#cab988] text-base flex-shrink-0">schedule</span>
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with thin divider */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-technical text-[11px] text-[#9a9da8] uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {settings.workshopName}. Lathe Workshop in Erode, Tamil Nadu.</p>
          <p>Erode • Tiruppur • Coimbatore • Salem • Namakkal • Karur</p>
        </div>
      </div>
    </footer>
  );
}
