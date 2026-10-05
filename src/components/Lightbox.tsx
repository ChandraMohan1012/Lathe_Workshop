'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface LightboxProps {
  isOpen: boolean;
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function Lightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onSelectIndex,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, currentIndex, images.length, onSelectIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

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
        onSelectIndex((currentIndex + 1) % images.length);
      } else {
        // swipe right -> prev
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-20 focus:outline-none"
        aria-label="Close Lightbox"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>

      {/* Prev / Next controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-20 focus:outline-none hidden sm:block"
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined text-3xl">west</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex((currentIndex + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-20 focus:outline-none hidden sm:block"
            aria-label="Next image"
          >
            <span className="material-symbols-outlined text-3xl">east</span>
          </button>
        </>
      )}

      {/* Main Container */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[75vh] overflow-hidden flex items-center justify-center">
          <Image
            src={currentImg.src}
            alt={currentImg.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="mt-4 flex items-center justify-between w-full px-4 text-white/80 font-label-technical text-xs uppercase tracking-wider">
          <span>{currentImg.alt}</span>
          {images.length > 1 && (
            <span>
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
