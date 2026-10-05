'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HomeHeroSliderProps {
  phone: string;
  whatsapp: string;
}

const slides = [
  {
    image: '/images/hero-macro-cnc.png',
    alt: 'Precision Lathe Turning in Erode',
    tagline: 'Lathe Workshop • Erode, Tamil Nadu',
    title: 'Precision Lathe Turning & Component Job Work',
    subtitle: 'Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work.',
  },
  {
    image: '/images/workshop-floor.png',
    alt: 'Lathe Pattarai Workshop Floor',
    tagline: 'Western Tamil Nadu Industrial Corridor',
    title: 'Textile Machine Parts & Submersible Pump Shafts',
    subtitle: 'Serving machine builders, agricultural pump units, and spinning mills across Erode, Tiruppur, Coimbatore, and Salem.',
  },
  {
    image: '/images/lathe-chuck.png',
    alt: 'Heavy 4-Jaw Lathe Chucking in Erode',
    tagline: 'Reliable Turnaround • Quality Assured',
    title: 'Boring, Threading & Custom Industrial Repairs',
    subtitle: 'Calibrated down to ±0.005mm accuracy. Send drawings or sample parts for fast turnaround quotes.',
  },
];

export default function HomeHeroSlider({ phone, whatsapp }: HomeHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        // swipe left -> next
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // swipe right -> prev
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] bg-[#181c22] text-white flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />
          {/* Subtle industrial dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full flex flex-col justify-center">
        <div className="max-w-3xl flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#cab988]"></span>
            <span className="font-label-technical text-xs uppercase tracking-widest text-[#cab988] font-bold">
              {slides[currentSlide].tagline}
            </span>
          </div>

          <h1 className="font-display-xl text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white font-bold leading-[1.1]">
            {slides[currentSlide].title}
          </h1>

          <p className="font-body-md text-base sm:text-xl text-[#d7dae3] leading-relaxed max-w-2xl">
            {slides[currentSlide].subtitle}
          </p>

          {/* Action Buttons: Call & WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Call Workshop</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20lathe%20job%20work%20requirement%20in%20Erode.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[4px] bg-white/10 text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-white/20 transition-colors border border-white/25 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>WhatsApp Drawing</span>
            </a>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-label-technical uppercase tracking-wider text-[#cab988] hover:text-white transition-colors"
            >
              <span>Explore Services</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Slider Controls: Arrows and Dots */}
        <div className="flex items-center justify-between pt-12 sm:pt-16 border-t border-white/15 mt-10 max-w-3xl">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-[2px] transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-[#cab988]' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-9 h-9 rounded-[4px] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Previous slide"
            >
              <span className="material-symbols-outlined text-sm">west</span>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-9 h-9 rounded-[4px] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Next slide"
            >
              <span className="material-symbols-outlined text-sm">east</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
