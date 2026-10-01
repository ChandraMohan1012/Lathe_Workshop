import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import { mockFaqs, initialSettings } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Precision Lathe & Subtractive Tooling Services',
  description: 'Explore Lathe Pattarai specialized machining capabilities: high-precision lathe turning, brass component milling, shaft threading, and emergency prototype retooling.',
};

export default function ServicesPage() {
  const servicesList = [
    {
      id: 'heavy-turning',
      title: 'Heavy Duty & Long Shaft Turning',
      icon: 'precision_manufacturing',
      description: 'Handling heavy alloy steel stock up to 95mm outer diameter and 650mm length. Calibrated steady rests eliminate shaft chatter and taper distortion during deep metal removal.',
      features: [
        'Stepped drive shafts for marine & industrial pumps',
        'EN19, EN24, SS316L, and Mild Steel IS2062 capability',
        'Concentricity runout held under 0.003mm',
        'Fine surface grinding down to Ra 0.4 µm',
      ],
    },
    {
      id: 'brass-components',
      title: 'Precision Brass turned Components & Sleeves',
      icon: 'settings_input_component',
      description: 'High-speed precision turning for brassCW614N/C36000 stock. Specialized in internal micro-grooving, fine metric threading, and flanged bushings for hydraulic assemblies.',
      features: [
        'Internal threads from M12 up to M48 pitch',
        'Micro-grooved oil seals and retention rings',
        'Zero heat distortion diamond turning',
        '100% batch thread gauge verification',
      ],
    },
    {
      id: 'prototype-retooling',
      title: 'Emergency Prototype Retooling & Dies',
      icon: 'build_circle',
      description: 'Fast 24-48 hour turnaround for single-piece emergency repair, hardened D2 tool steel punch dies, replacement bushings, and custom lathe tooling fixtures.',
      features: [
        'Direct CBN hard turning on HRC 60+ tool steel',
        'Punch die retooling and radius polishing',
        'Custom collet fixtures and holding mandrels',
        'Emergency rapid dispatch to SIDCO industrial clients',
      ],
    },
    {
      id: 'quality-inspection',
      title: 'CMM Optical & Micrometer Quality Inspection',
      icon: 'verified',
      description: 'Every finished job undergoes dimensional audit using calibrated digital micrometers, height gauges, and optical profile projectors under standard DIN EN ISO 14253 protocols.',
      features: [
        '±0.005mm dimensional certificate included on request',
        'Surface roughness Ra measurement logs',
        'Hardness testing (Rockwell HRC / Brinell)',
        'Full material test certificate (MTC) traceability',
      ],
    },
  ];

  return (
    <>
      <Navbar />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Precision Lathe <span className="text-primary italic font-editorial-accent">Services</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Subtractive precision manufacturing, single-piece prototype retooling, and high-tolerance batch component production in Guindy SIDCO. Calibrated down to {initialSettings.standardTolerance} dimensional integrity.
            </p>
          </div>
        </section>

        <StatsBanner />

        {/* SERVICES LIST */}
        <section className="w-full px-gutter py-space-2xl bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
            {servicesList.map((service, idx) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant/50 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center interactive-card"
              >
                <div className="lg:col-span-4 flex flex-col gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-2xl uppercase tracking-tight text-on-surface">
                    {service.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant">
                    {service.description}
                  </p>
                </div>

                <div className="lg:col-span-8 bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/30 flex flex-col gap-space-md">
                  <h4 className="font-headline-sm text-sm uppercase tracking-wider text-on-surface border-b border-outline-variant/30 pb-2">
                    Key Specifications & Scope
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                        <span className="font-body-md text-sm text-on-surface font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FaqAccordion items={mockFaqs} />

        <CtaBand />
      </main>

      <Footer />
    </>
  );
}
