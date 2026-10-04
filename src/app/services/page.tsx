import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import { mockFaqs, initialSettings } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Precision Lathe & Turning Services | Erode',
  description: 'Explore Lathe Pattarai specialized machining capabilities: high-precision lathe turning, brass component turning, pump & motor shafts, and textile machine job work in Erode.',
};

import { getWorkshopSettings } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function ServicesPage() {
  const settings = await getWorkshopSettings();
  const servicesList = [
    {
      id: 'pump-motor-turning',
      title: 'Pump & Motor Shaft Turning',
      icon: 'precision_manufacturing',
      description: 'Handling heavy alloy steel and stainless steel stock up to 95mm outer diameter and 750mm length. Calibrated steady rests eliminate shaft chatter and taper distortion during deep metal removal.',
      features: [
        'Stepped drive shafts for agricultural borewell & submersible pumps',
        'EN8, EN19, EN24, SS304, and SS316L stock capability',
        'Concentricity runout held under 0.005mm',
        'Precision milled keyways and fine ground bearing journals',
      ],
    },
    {
      id: 'textile-components',
      title: 'Textile Machinery Components & Bushings',
      icon: 'settings_input_component',
      description: 'High-speed precision turning for brass CW614N and phosphor bronze PB2 stock. Specialized in internal micro-grooving, fine metric threading, and flanged bushings for high-speed weaving and spinning looms.',
      features: [
        'Internal threads from M12 up to M48 fine pitch',
        'Figure-8 continuous internal lubrication channels',
        'Loom roller shafts, spindle collars, and guide bushings',
        '100% batch thread and bore gauge verification',
      ],
    },
    {
      id: 'boring-job-work',
      title: 'Boring, Threading & Heavy Lathe Work',
      icon: 'build_circle',
      description: 'Heavy duty 4-jaw chucking for motor couplings, pulleys, custom tooling dies, and emergency breakdown machinery repair for local factories.',
      features: [
        'Heavy flange facing and internal diameter boring',
        'Hard turning on D2 tool steel and case-hardened shafts',
        'Pulleys, sprockets, and flanged motor couplings',
        'Emergency fast turnaround for local industrial units',
      ],
    },
    {
      id: 'quality-inspection',
      title: 'Precision Metrology & Calibrated Quality Audit',
      icon: 'verified',
      description: 'Every finished job undergoes dimensional audit using calibrated digital micrometers, bore gauges, and optical measurement to guarantee precision fit before delivery.',
      features: [
        '±0.005mm dimensional verification across all critical diameters',
        'Fine surface finish measurement and runout checking',
        'Batch inspection logs for repeat production orders',
        'Careful dispatch packaging to prevent thread or bearing surface damage',
      ],
    },
  ];

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-28 bg-surface flex flex-col flex-grow">
        {/* HERO HEADER */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-2xl border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl text-on-surface uppercase tracking-tight">
              Precision Lathe <span className="text-primary italic font-editorial-accent">Services</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Precision lathe turning, pump shafts, textile machinery parts, and custom job work in Erode district. Calibrated down to {settings.standardTolerance} dimensional integrity.
            </p>
          </div>
        </section>

        <StatsBanner settings={settings} />

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

        <CtaBand phone={settings.phone} />
      </main>

      <Footer settings={settings} />
    </>
  );
}
