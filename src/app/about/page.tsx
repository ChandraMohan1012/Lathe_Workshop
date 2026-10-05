import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import StatsBanner from '@/components/StatsBanner';
import { getWorkshopSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'About Our Workshop & Facility | Lathe Pattarai Erode',
  description: 'Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work for textile and pump industries.',
  alternates: {
    canonical: '/about',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AboutPage() {
  const settings = await getWorkshopSettings();

  const machines = [
    {
      name: 'Heavy Duty Center Lathe (12-Foot)',
      capacity: 'Swing 650mm • Center distance 2,500mm',
      use: 'Heavy 4-jaw chucking, motor end shields, large pulleys, and coupling flange facing',
    },
    {
      name: 'Precision Engine Lathe (8-Foot)',
      capacity: 'Swing 400mm • Center distance 1,500mm',
      use: 'Stepped pump motor shafts, long drive axles, and ground bearing journals',
    },
    {
      name: 'High-Speed Precision Lathe (4.5-Foot)',
      capacity: 'Spindle bore 52mm • Center distance 750mm',
      use: 'Brass and phosphor bronze bushings, textile spindles, and micro-grooving',
    },
    {
      name: 'Geared Threading & Boring Setup',
      capacity: 'Bore range 25mm - 300mm • Internal pitch M12 - M48',
      use: 'Fine metric threading, ACME leadscrews, and internal bearing seat boring',
    },
  ];

  const milestones = [
    {
      year: '2008',
      title: 'Workshop Established in Erode',
      desc: 'Founded on Perundurai Road corridor to provide dependable turning job work for local agriculture pump and motor repairers.',
    },
    {
      year: '2014',
      title: 'Heavy Bed & Textile Tooling Addition',
      desc: 'Added 8-foot and 12-foot lathe beds equipped with calibrated steady rests for long submersible pump shafts and loom rollers.',
    },
    {
      year: '2019',
      title: 'Bronze & Brass Bushing Expansion',
      desc: 'Expanded high-speed spindle bays for fine metric threading and internal helical oil grooving for textile weaving mills in Tiruppur and Erode.',
    },
    {
      year: '2024',
      title: 'Digital Metrology & 16-Bay Calibration',
      desc: 'Standardized digital micrometer and bore gauge inspection across all active turning bays with strict tolerance logging.',
    },
  ];

  const values = [
    {
      label: 'Dimensional Integrity',
      text: 'Every turned diameter, keyway, and thread is verified with calibrated micrometers and bore gauges before dispatch.',
    },
    {
      label: 'Regional Commitment',
      text: 'Located directly on the industrial corridor, we provide quick dispatch and direct communication for factories across Erode, Tiruppur, Coimbatore, and Salem.',
    },
    {
      label: 'Practical Machinist Discipline',
      text: 'Whether working from a CAD blueprint or an emergency worn physical sample, we understand metal behavior and deliver reliable fits.',
    },
  ];

  return (
    <>
      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow">
        {/* Header Section with thin line divider */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-2 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">About Workshop</span>
            </div>

            <h1 className="font-display-xl text-3xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
              Workshop Story & Facility
            </h1>

            <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Serving Western Tamil Nadu&apos;s industrial corridor with practical machinist discipline.
            </p>
          </div>
        </section>

        <StatsBanner settings={settings} />

        {/* STORY TEXT BESIDE LARGE WORKSHOP PHOTO */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Large Workshop Photo */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-outline-variant/60 bg-surface-container">
                <Image
                  src="/images/master-machinist.png"
                  alt="Lathe Pattarai machinist at work in Erode"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <span className="block font-label-technical text-[11px] text-on-surface-variant uppercase tracking-wider mt-2">
                Precision Lathe Turning Floor • Perundurai Road, Erode
              </span>
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                  Machining Heritage
                </span>
                <h2 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                  Serving Kongu Regional Industry Since 2008
                </h2>
              </div>

              <div className="flex flex-col gap-4 font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
                <p>
                  Started as a dedicated job-work facility in Erode district, Lathe Pattarai was founded with a single guiding standard: reliable dimensional accuracy on every part, delivered on schedule.
                </p>
                <p>
                  Our workshop serves textile spinning and weaving mills in Tiruppur and Erode, agricultural borewell pump manufacturers, and engineering factories across Coimbatore, Salem, and Namakkal.
                </p>
                <p>
                  From single emergency replacement drive shafts to batch production of brass threaded bushings, we combine hands-on turning experience with digital micrometer audit on every finished surface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSHOP VALUES: Three Short Lines Separated by Dividers, No Icons */}
        <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                Operating Principles
              </span>
              <h3 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                How We Stand Behind Our Work
              </h3>
            </div>

            {/* 3 Short Lines with Thin Dividers (No Icons) */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/40 border-y border-outline-variant/40 py-6 sm:py-8">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-2 py-4 md:py-0 ${
                    idx === 0 ? 'md:pr-8' : idx === 1 ? 'md:px-8' : 'md:pl-8'
                  }`}
                >
                  <span className="font-label-technical text-xs text-primary font-bold uppercase tracking-wider">
                    0{idx + 1} / {val.label}
                  </span>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    {val.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MACHINES: Plain Table with Type and Capacity (Not Cards) */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                Shop Floor Equipment
              </span>
              <h3 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                Machine Specifications & Capacities
              </h3>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                Our machinery is calibrated for steady rest turning, heavy chucking, and precision metric threading.
              </p>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse border-y border-outline-variant/40">
                <thead>
                  <tr className="border-b border-outline-variant/60 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
                    <th className="py-3 px-4">Machine Type</th>
                    <th className="py-3 px-4">Capacity & Swing</th>
                    <th className="py-3 px-4">Typical Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-body-md text-sm text-on-surface">
                  {machines.map((m, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-4 font-semibold">{m.name}</td>
                      <td className="py-4 px-4 font-mono text-xs text-primary">{m.capacity}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{m.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* MILESTONE TIMELINE: Clean Vertical / Horizontal Line Layout */}
        <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                Evolution
              </span>
              <h3 className="font-display-xl text-2xl sm:text-3xl uppercase tracking-tight text-on-surface font-bold">
                Workshop Milestones
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-outline-variant/50 -z-0" />

              {milestones.map((m, idx) => (
                <div key={idx} className="relative z-10 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-[4px] bg-[#181c22] text-[#cab988] font-label-technical text-xs font-bold flex items-center justify-center border border-[#cab988]/40 mb-1">
                    {idx + 1}
                  </div>
                  <span className="font-display-xl text-lg font-bold text-primary">
                    {m.year}
                  </span>
                  <h4 className="font-headline-sm text-base uppercase tracking-tight text-on-surface font-bold">
                    {m.title}
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Note: Certificates carousel is intentionally hidden because no real certificates are provided */}

        <CtaBand
          title="Have a custom job work requirement?"
          subtitle="Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Call our workshop or message us on WhatsApp."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
