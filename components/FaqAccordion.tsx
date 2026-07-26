"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 rounded-4xl border border-ink/10">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-base text-ink">{item.question}</span>
              <span className={`shrink-0 text-xl text-sage-dark transition-transform ${open ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {open && (
              <div className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
