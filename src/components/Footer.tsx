import Link from 'next/link';
import Image from 'next/image';
import { WorkshopSettings } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface FooterProps {
  settings?: WorkshopSettings;
}

export default function Footer({ settings = initialSettings }: FooterProps) {
  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface border-t border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-gutter py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <Link href="/" className="flex items-center gap-space-md">
              <div className="relative h-10 w-10 flex-shrink-0 bg-surface rounded-md p-1">
                <Image
                  src="/images/logo.png"
                  alt="Lathe Pattarai Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-white">
                  Lathe Pattarai
                </span>
                <span className="font-label-technical text-[10px] uppercase tracking-widest text-primary-fixed-dim">
                  Precision Engineering Workshop
                </span>
              </div>
            </Link>
            <p className="font-body-md text-surface-dim max-w-sm">
              Dedicated to subtractive precision manufacturing, high-tolerance lathe turning, and custom industrial component tooling in Guindy SIDCO Industrial Estate.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <h4 className="font-headline-sm text-sm uppercase tracking-wider text-white border-b border-surface-variant/30 pb-2">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 font-body-md text-surface-dim">
              <li>
                <Link href="/" className="hover:text-primary-fixed transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-fixed transition-colors">
                  Precision Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-primary-fixed transition-colors">
                  Machining Portfolio
                </Link>
              </li>
              <li>
                <Link href="/ongoing" className="hover:text-primary-fixed transition-colors">
                  Live Bay Tracker
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-fixed transition-colors">
                  Heritage & Facility
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-fixed transition-colors">
                  Request Quotations
                </Link>
              </li>
            </ul>
          </div>

          {/* Industrial Capabilities Column */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h4 className="font-headline-sm text-sm uppercase tracking-wider text-white border-b border-surface-variant/30 pb-2">
              Capabilities
            </h4>
            <ul className="flex flex-col gap-2 font-label-technical text-xs text-surface-dim uppercase tracking-wider">
              <li>Heavy Lathe Turning</li>
              <li>Brass Component Turning</li>
              <li>Thread Grooving & Sleeves</li>
              <li>Hardened Steel Retooling</li>
              <li>Prototype Tooling Runs</li>
            </ul>
          </div>

          {/* Workshop Contact Details */}
          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <h4 className="font-headline-sm text-sm uppercase tracking-wider text-white border-b border-surface-variant/30 pb-2">
              Workshop Address
            </h4>
            <div className="flex flex-col gap-3 font-body-md text-surface-dim">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-lg mt-0.5">location_on</span>
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-lg">call</span>
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-lg">mail</span>
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-lg">schedule</span>
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-space-2xl pt-space-md border-t border-surface-variant/20 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-technical text-[11px] text-surface-dim uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {settings.workshopName}. All rights reserved.</p>
          <p>Guindy SIDCO Industrial Unit • Precision Machining Excellence</p>
        </div>
      </div>
    </footer>
  );
}
