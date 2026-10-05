import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import JsonLd from '@/components/JsonLd';
import { mockFaqs, initialSettings } from '@/lib/mockData';
import { getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Lathe Turning, Threading & Boring Services | Erode',
  description: 'Precision lathe turning, internal/external threading, heavy boring, and machinery repair job work in Erode, serving Tiruppur, Coimbatore, and Salem.',
  alternates: {
    canonical: '/services',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function ServicesPage() {
  const settings = await getWorkshopSettings();
  const cleanWhatsapp = (settings.whatsapp || initialSettings.whatsapp).replace(/[^0-9]/g, '');

  const servicesList = [
    {
      id: 'turning',
      num: '01',
      title: 'Turning',
      image: '/images/hero-macro-cnc.png',
      alt: 'Precision lathe shaft turning in Erode',
      description: 'Precision lathe turning for solid steel bar stock, forged blanks, and cast rods up to 95mm outer diameter and 750mm center-to-center length. Calibrated steady rests ensure zero deflection and concentricity down to 0.005mm.',
      points: [
        'Stepped shafts for agricultural borewell and submersible pump motors',
        'Textile machine spinning spindles, loom collars, and precision sleeves',
        'Turned diameters held strictly to specified engineering tolerances',
        'Fine bearing journal finishes with precision tolerance limits',
      ],
    },
    {
      id: 'threading',
      num: '02',
      title: 'Threading',
      image: '/images/brass-components.png',
      alt: 'Brass component threading and bushings',
      description: 'Single-point internal and external threading across brass, phosphor bronze, mild steel, and stainless steel. Geared leadscrew control ensures accurate pitch engagement for continuous textile machinery and pump tie rods.',
      points: [
        'Internal threads from M12 up to M48 in standard metric and fine pitches',
        'ACME leadscrews, square threads, and multi-start power transmission screws',
        'Threaded brass bushings and sleeve inserts for textile looms',
        '100% thread ring and plug gauge verification before dispatch',
      ],
    },
    {
      id: 'boring',
      num: '03',
      title: 'Boring',
      image: '/images/lathe-chuck.png',
      alt: 'Heavy 4-jaw chuck lathe boring',
      description: 'Heavy duty 4-jaw chuck setup for concentric internal boring, counterboring, and facing of motor flanges, pulleys, and cast bearing housings. Rigid boring bars maintain bore parallelism along deep internal depths.',
      points: [
        'Internal diameter boring from 25mm to 300mm diameter',
        'Precision bearing seat counterbores with H7 interference fit',
        'Motor end-shield flanges, sprockets, and flanged couplings',
        'Facing of uneven cast iron parts with single-point alignment',
      ],
    },
    {
      id: 'repair-batch',
      num: '04',
      title: 'Repair and Batch work',
      image: '/images/precision-craft.png',
      alt: 'Lathe machinery repair and batch work',
      description: 'Emergency breakdown turning and repeat production runs for factories across Erode, Tiruppur, Coimbatore, and Salem. From single one-off breakdown replacement shafts to 5,000-piece batch production.',
      points: [
        'Worn shaft journal sleeving and re-turning to original specs',
        'Emergency fast turnaround for local textile and paper mill breakdowns',
        'Repeat batch job-work contracts with dedicated bay scheduling',
        'Micrometer and bore gauge inspection logged for batch deliveries',
      ],
    },
  ];

  const processSteps = [
    { num: '01', title: 'Enquiry', desc: 'Call or WhatsApp your part requirement or visit our Erode shop.' },
    { num: '02', title: 'Drawing or Sample', desc: 'Share your CAD drawing, PDF blueprint, or worn physical sample.' },
    { num: '03', title: 'Production', desc: 'Lathe setup, turning, threading, or boring in calibrated bays.' },
    { num: '04', title: 'Inspection', desc: 'Dimensional audit with digital micrometers and bore gauges.' },
    { num: '05', title: 'Delivery', desc: 'Packed and dispatched across Erode, Tiruppur, Salem & Coimbatore.' },
  ];

  const materialsTable = [
    { type: 'Alloy & Carbon Steels', grades: 'EN8, EN19, EN24, Mild Steel IS2062', use: 'Pump drive shafts, motor axles, flanged couplings, machine studs' },
    { type: 'Stainless Steels', grades: 'SS304, SS316, SS316L, 410', use: 'Submersible pump shafts, chemical sleeves, corrosion-resistant parts' },
    { type: 'Non-Ferrous Metals', grades: 'Brass CW614N/C36000, Phosphor Bronze PB2', use: 'Textile loom bushings, wear collars, threaded guide nuts' },
    { type: 'Castings & Aluminum', grades: 'CI Grades, AL 6061-T6 Aluminum', use: 'Motor end flanges, pulleys, sheaves, custom bearing blocks' },
  ];

  return (
    <>
      <JsonLd settings={settings} />
      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow">
        {/* Header Section */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-2 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Services</span>
            </div>

            <div className="max-w-3xl flex flex-col gap-3">
              <h1 className="font-display-xl text-3xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
                Workshop Services
              </h1>
              <p className="font-body-md text-base sm:text-lg text-on-surface-variant leading-relaxed">
                Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Serving machine builders and textile factories with calibrated precision.
              </p>
            </div>

            {/* Top Jump List: Simple Text Links with Numbers (Not a Card Grid) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 border-t border-outline-variant/40">
              <span className="font-label-technical text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Jump To:
              </span>
              {servicesList.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="font-label-technical text-xs uppercase tracking-wider text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-primary font-bold">{service.num}</span>
                  <span className="font-semibold">{service.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <StatsBanner settings={settings} />

        {/* FULL-WIDTH ALTERNATING ROWS FOR EACH SERVICE */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-20 sm:gap-28">
            {servicesList.map((service, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                >
                  {/* Photo Side */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-outline-variant/60 bg-surface-container">
                      <Image
                        src={service.image}
                        alt={service.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className={`lg:col-span-6 flex flex-col gap-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex flex-col gap-2">
                      <span className="font-label-technical text-xs text-primary font-bold uppercase tracking-widest">
                        Service {service.num}
                      </span>
                      <h2 className="font-display-xl text-2xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
                        {service.title}
                      </h2>
                      <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed mt-1">
                        {service.description}
                      </p>
                    </div>

                    {/* Plain Checklist with Dividers (No Box) */}
                    <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
                      {service.points.map((pt, pIdx) => (
                        <div key={pIdx} className="py-2.5 flex items-baseline gap-3 text-sm font-body-md text-on-surface">
                          <span className="text-primary font-bold text-xs">―</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Get a Quote on WhatsApp Link */}
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20need%20a%20quote%20for%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-label-technical text-xs uppercase tracking-wider text-primary font-bold hover:underline"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>Get a quote on WhatsApp for {service.title}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MATERIALS SECTION: Simple Table, Not Chips-In-Cards */}
        <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                Machining Metallurgy
              </span>
              <h3 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                Stock Materials We Machine
              </h3>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                We handle client-supplied bar stock as well as sourced raw materials with test certification.
              </p>
            </div>

            {/* Clean Table with Thin Lines */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse border-y border-outline-variant/40">
                <thead>
                  <tr className="border-b border-outline-variant/60 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    <th className="py-3 px-4">Material Category</th>
                    <th className="py-3 px-4">Typical Grades</th>
                    <th className="py-3 px-4">Workshop Applications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-body-md text-sm text-on-surface">
                  {materialsTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold">{row.type}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-primary">{row.grades}</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE: Horizontal Line with Numbered Steps that Stacks Vertically on Mobile */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-2 text-left sm:text-center sm:items-center">
              <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                How We Work
              </span>
              <h3 className="font-display-xl text-2xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
                From Drawing to Dispatch
              </h3>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                A disciplined five-step workflow ensuring dimensional accuracy down to 0.005mm.
              </p>
            </div>

            {/* Horizontal Timeline on Desktop / Vertical Stack on Mobile */}
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
              {/* Desktop Horizontal Line */}
              <div className="hidden md:block absolute top-7 left-8 right-8 h-0.5 bg-outline-variant/50 -z-0" />

              {processSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col gap-2">
                  <div className="w-9 h-9 rounded-[4px] bg-[#181c22] text-[#cab988] font-label-technical text-xs font-bold flex items-center justify-center border border-[#cab988]/40 mb-2">
                    {step.num}
                  </div>
                  <h4 className="font-headline-sm text-base uppercase tracking-tight text-on-surface font-bold">
                    {step.title}
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqAccordion items={mockFaqs} />

        <CtaBand
          title="Have a drawing or part for lathe job work?"
          subtitle="Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Call our shop or send details on WhatsApp."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
