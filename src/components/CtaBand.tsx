import { initialSettings } from '@/lib/mockData';

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  phone?: string;
  whatsapp?: string;
}

export default function CtaBand({
  title = "Have a part to make?",
  subtitle = "Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Send your drawing or call our workshop directly.",
  phone = initialSettings.phone,
  whatsapp = initialSettings.whatsapp,
}: CtaBandProps) {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

  return (
    <section className="w-full bg-[#181c22] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#2d3037]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
        <div className="flex flex-col gap-3 max-w-3xl">
          <span className="font-label-technical text-xs uppercase tracking-widest text-[#cab988] font-bold">
            Direct Job-Work Desk
          </span>
          <h2 className="font-display-xl text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight font-bold">
            {title}
          </h2>
          <p className="font-body-md text-base sm:text-lg text-[#c5c7d0] mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
          >
            <span className="material-symbols-outlined text-base">call</span>
            <span>Call Workshop</span>
          </a>
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20part%20to%20make.%20Can%20I%20share%20the%20drawing%20for%20a%20quote?`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[4px] bg-white/10 text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-white/20 transition-colors border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>WhatsApp Drawing</span>
          </a>
        </div>
      </div>
    </section>
  );
}
