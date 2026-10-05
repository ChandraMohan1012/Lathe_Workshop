'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqAccordion({
  items,
  title = "Frequently Asked Questions",
  subtitle = "Common questions regarding job work scope, materials, tolerances, and dispatch across Erode and western Tamil Nadu.",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="font-display-xl text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-on-surface font-bold">
            {title}
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Accordion Items - Thin Line Divider Layout */}
        <div className="flex flex-col divide-y divide-outline-variant/40 border-y border-outline-variant/40">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 sm:py-6 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-4 text-left group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-4 font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    <span className="font-label-technical text-xs text-primary font-bold flex-shrink-0">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 text-xl flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-4 pl-8 sm:pl-9 pr-4 text-on-surface-variant font-body-md text-sm sm:text-base leading-relaxed animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
