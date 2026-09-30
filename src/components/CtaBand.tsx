import Link from 'next/link';

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CtaBand({
  title = "Ready for High-Tolerance Lathe Manufacturing?",
  subtitle = "Send us your CAD drawings or technical blueprints for a detailed engineering evaluation and itemized quotation within 4 hours.",
  buttonText = "Request Workshop Quotation",
  buttonHref = "/contact",
}: CtaBandProps) {
  return (
    <section className="w-full bg-primary-container text-on-primary-container px-gutter py-space-2xl border-y border-outline-variant/40 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#181c22_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs max-w-3xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center lg:self-start bg-primary/10 px-3 py-1 rounded-full text-on-primary-container font-label-technical text-xs uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Guindy SIDCO Machining Facility
          </div>
          <h2 className="font-display-xl text-display-xl-mobile sm:text-headline-lg uppercase tracking-tight text-on-primary-container mt-2">
            {title}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/90">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-space-md flex-shrink-0">
          <Link
            href={buttonHref}
            className="inline-flex items-center gap-space-xs px-space-xl py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-sm uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>{buttonText}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <a
            href="tel:+919840012345"
            className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-full bg-surface-container-lowest text-on-surface font-label-technical text-xs uppercase tracking-wider hover:bg-surface-container transition-colors border border-outline-variant"
          >
            <span className="material-symbols-outlined text-primary text-lg">call</span>
            <span>Direct Call</span>
          </a>
        </div>
      </div>
    </section>
  );
}
