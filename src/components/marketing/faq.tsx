"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ease, Reveal, SectionHeading } from "@/components/motion";
import { faqs } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell grid gap-8 lg:grid-cols-12">
        <SectionHeading
          className="lg:col-span-4"
          label="FAQ"
          title={
            <>
              Quick <span className="text-ink-faint">answers.</span>
            </>
          }
          body="What hosts and guests usually ask before their first match."
        />

        <Reveal delay={0.1} className="lg:col-span-8">
          <ul className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <li key={faq.q} className="rounded-3xl bg-surface shadow-e1 ring-1 ring-line/70">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
                  >
                    <span className="text-[16px] font-semibold tracking-[-0.01em] text-ink sm:text-[18px]">{faq.q}</span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-ink text-white" : "bg-subtle text-ink"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[66ch] px-6 pb-6 text-[15.5px] leading-relaxed text-ink-soft sm:px-8">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
