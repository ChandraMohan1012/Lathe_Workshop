'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface LightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export default function Lightbox({ isOpen, src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-primary p-2 focus:outline-none z-10"
        aria-label="Close Lightbox"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>

      <div
        className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[75vh] rounded-lg overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-3 text-white/80 font-label-technical text-xs uppercase tracking-widest text-center">
          {alt}
        </p>
      </div>
    </div>
  );
}
