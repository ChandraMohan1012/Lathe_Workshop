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
  title = "Technical Questions & Calibration Standards",
  subtitle = "Clarifications on tolerances, raw material options, batch turnaround times, and blueprint submittals.",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-surface-container-low px-gutter py-space-2xl border-t border-outline-variant/30">
      <div className="max-w-4xl mx-auto flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-col gap-space-xs text-center">
          <h2 className="font-display-xl text-headline-lg uppercase tracking-tight text-on-surface">
            {title}
          </h2>
          <p className="font-body-lg text-body-md text-on-surface-variant max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Accordion Items */}
        <div className="flex flex-col gap-space-sm mt-space-md">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-space-lg py-space-md flex items-center justify-between gap-space-md text-left focus:outline-none hover:bg-surface-container-low/50 transition-colors"
                >
                  <span className="font-headline-sm text-base uppercase tracking-tight text-on-surface flex items-center gap-space-sm">
                    <span className="font-label-technical text-xs text-primary font-semibold">
                      0{index + 1}.
                    </span>
                    {item.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-space-lg pb-space-lg pt-0 text-on-surface-variant font-body-md border-t border-outline-variant/30 animate-in fade-in duration-200">
                    <p className="mt- space-md pt-3">{item.answer}</p>
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
