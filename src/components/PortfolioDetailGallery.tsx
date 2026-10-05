'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';

interface PortfolioDetailGalleryProps {
  primaryImage: string;
  title: string;
  additionalImages?: string[];
  phone: string;
  whatsapp: string;
}

export default function PortfolioDetailGallery({
  primaryImage,
  title,
  additionalImages = [],
  phone,
  whatsapp,
}: PortfolioDetailGalleryProps) {
  const allImages = [
    { src: primaryImage, alt: `${title} - Main View` },
    ...additionalImages.map((src, i) => ({ src, alt: `${title} - Detail View ${i + 1}` })),
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Display Image */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-outline-variant/60 bg-surface-container cursor-zoom-in group"
        >
          <Image
            src={allImages[activeImgIndex]?.src || primaryImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />

          <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-[4px] bg-black/60 text-white font-label-technical text-[10px] uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-xs">fullscreen</span>
            <span>View Fullscreen</span>
          </div>
        </div>

        {/* Thumbnails if multiple images exist */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImgIndex(idx)}
                className={`relative w-20 h-16 rounded-[4px] overflow-hidden border flex-shrink-0 transition-all ${
                  activeImgIndex === idx
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-outline-variant/60 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        currentIndex={activeImgIndex}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={setActiveImgIndex}
      />

      {/* Sticky Call/WhatsApp Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 p-3 flex items-center gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 text-center py-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          <span>Call Workshop</span>
        </a>
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20am%20enquiring%20about%20the%20${encodeURIComponent(title)}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-3 rounded-[4px] bg-[#181c22] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>WhatsApp Specs</span>
        </a>
      </div>
    </>
  );
}
