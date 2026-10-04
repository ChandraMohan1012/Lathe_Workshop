import Link from 'next/link';
import { initialSettings } from '@/lib/mockData';

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  phone?: string;
}

export default function CtaBand({
  title = "Need Precision Lathe Job Work or Component Machining?",
  subtitle = "Call or WhatsApp your drawing, sample part dimensions, or requirements for an instant quote and quick turnaround.",
  buttonText = "Call or WhatsApp for a Quote",
  buttonHref = "/contact",
  phone = initialSettings.phone,
}: CtaBandProps) {
  const whatsappClean = phone.replace(/[^0-9]/g, '');

  return (
    <section className="w-full bg-primary-container text-on-primary-container px-gutter py-space-2xl border-y border-outline-variant/40 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#181c22_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs max-w-3xl text-center lg:text-left">
          <h2 className="font-display-xl text-display-xl-mobile sm:text-headline-lg uppercase tracking-tight text-on-primary-container mt-2">
            {title}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/90">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-sm sm:gap-space-md flex-shrink-0">
          <a
            href={`https://wa.me/${whatsappClean}?text=Hello%20Lathe%20Pattarai,%20I%20need%20a%20quote%20for%20lathe%20job%20work.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-space-xl py-space-md rounded-full bg-[#25D366] text-white font-headline-sm text-sm uppercase tracking-wider hover:bg-[#1EBE5D] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>WhatsApp Quote</span>
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-full bg-surface-container-lowest text-on-surface font-label-technical text-xs uppercase tracking-wider hover:bg-surface-container transition-colors border border-outline-variant shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-lg">call</span>
            <span>Direct Call</span>
          </a>
        </div>
      </div>
    </section>
  );
}
