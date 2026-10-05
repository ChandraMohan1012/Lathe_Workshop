'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  num: string;
  name: string;
  line: string;
  image: string;
  scope: string;
}

const services: ServiceItem[] = [
  {
    id: 'turning',
    num: '01',
    name: 'Turning',
    line: 'Precision lathe turning for pump shafts, motor rotors, sleeves, and brass collars up to 750mm length.',
    image: '/images/hero-macro-cnc.png',
    scope: 'Submersible pumps • Textile spindles • Flanged sleeves',
  },
  {
    id: 'threading',
    num: '02',
    name: 'Threading',
    line: 'Internal and external single-point threading: metric standard, fine pitch, ACME leadscrews, and multi-start threads.',
    image: '/images/brass-components.png',
    scope: 'Brass bushings • Tie rods • Tension screws',
  },
  {
    id: 'boring',
    num: '03',
    name: 'Boring',
    line: 'Heavy 4-jaw chuck internal boring, precision bearing housing seat machining, and deep hole alignment.',
    image: '/images/lathe-chuck.png',
    scope: 'Motor end flanges • Bearing blocks • Cast iron housings',
  },
  {
    id: 'repair-batch',
    num: '04',
    name: 'Repair and Batch work',
    line: 'Shaft rebuilds, sleeve replacements, emergency factory breakdown machining, and repeat industrial batch contracts.',
    image: '/images/precision-craft.png',
    scope: 'Emergency breakdown repairs • 10 to 5,000 unit batch runs',
  },
];

export default function HomeServicesInteractive() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/40 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
              Core Capabilities
            </span>
            <h2 className="font-display-xl text-3xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
              Workshop Services
            </h2>
          </div>
          <Link
            href="/services"
            className="font-label-technical text-xs uppercase tracking-wider text-primary font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <span>All Services & Equipment</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Numbered Rows + Photo Reveal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Numbered Rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
            {services.map((service, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`py-6 sm:py-7 px-3 sm:px-4 cursor-pointer transition-colors editorial-row ${
                    isActive ? 'bg-[#cab988]/10' : 'hover:bg-surface-container-low/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-label-technical text-sm sm:text-base font-bold text-primary">
                        {service.num}
                      </span>
                      <h3 className="font-headline-sm text-xl sm:text-2xl uppercase tracking-tight text-on-surface font-bold">
                        {service.name}
                      </h3>
                    </div>
                    <span className="font-label-technical text-[11px] text-on-surface-variant uppercase tracking-wider hidden sm:inline">
                      {service.scope}
                    </span>
                  </div>

                  <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-2 pl-8 sm:pl-12 max-w-xl leading-relaxed">
                    {service.line}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Hover Photo Reveal on Desktop */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-outline-variant/60 shadow-sm bg-surface-container">
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    activeIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <span className="font-label-technical text-xs uppercase tracking-wider text-[#cab988] font-bold block">
                        {service.num} {service.name}
                      </span>
                      <span className="font-body-md text-xs text-white/90">
                        {service.scope}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
