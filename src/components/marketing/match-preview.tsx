"use client";

import { CalendarCheck, Check, Mic, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { ease, Waveform } from "@/components/motion";
import { Face } from "@/components/member-face";

const pairs = [
  {
    host: { name: "Dana Brooks", show: "The Bootstrapped Hour" },
    guest: { name: "Marcus Hale", role: "Founder & author" },
    score: 96,
    topic: "Pricing without investors",
    messages: [
      { from: "host", text: "Your bootstrapping story is exactly what my listeners ask about. Want to come on?" },
      { from: "guest", text: "Love that. Sept 2nd at noon works, and I'll send a few stories ahead." },
    ],
    date: "Sep 2 · 12:00 PM",
  },
  {
    host: { name: "Renée Foster", show: "Well Within" },
    guest: { name: "Aisha Okafor", role: "Sleep researcher" },
    score: 94,
    topic: "Sleep that survives a busy week",
    messages: [
      { from: "host", text: "Our audience keeps asking about sleep. Would you join us for an episode?" },
      { from: "guest", text: "Absolutely. I can do video and bring a few practical habits." },
    ],
    date: "Nov 4 · 10:00 AM",
  },
  {
    host: { name: "Kai Nakamura", show: "Shipping Daily" },
    guest: { name: "Leo Martins", role: "Growth marketer" },
    score: 91,
    topic: "Launching dev tools in 2026",
    messages: [
      { from: "host", text: "Saw your launch playbook. Thirty minutes on what moved signups?" },
      { from: "guest", text: "Count me in. Thursday afternoons are wide open." },
    ],
    date: "Oct 30 · 3:30 PM",
  },
] as const;

export function MatchPreview() {
  const [index, setIndex] = useState(0);
  const pair = pairs[index];

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % pairs.length), 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-3xl bg-surface p-3 shadow-e2 ring-1 ring-line/60 sm:p-4">
      <div className="flex items-center justify-between px-2 pt-1 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-lilac to-peach text-ink">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">New match</p>
        </div>
        <div className="flex gap-1">
          {pairs.map((item, i) => (
            <button
              key={item.host.name}
              type="button"
              aria-label={`Show match ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-ink" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pair.host.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease }}
          className="rounded-[20px] bg-canvas p-3 sm:p-4"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-e1">
              <Face name={pair.host.name} className="h-9 w-9 text-[12px]" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{pair.host.name}</p>
                <p className="truncate text-[11.5px] text-ink-soft">{pair.host.show}</p>
              </div>
            </div>
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4, ease }}
              className="grid h-12 w-12 place-items-center rounded-full bg-sun text-[13px] font-semibold text-ink tabular-nums shadow-e1"
            >
              {pair.score}%
            </motion.span>
            <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-e1">
              <Face name={pair.guest.name} className="h-9 w-9 text-[12px]" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{pair.guest.name}</p>
                <p className="truncate text-[11.5px] text-ink-soft">{pair.guest.role}</p>
              </div>
            </div>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-ink-soft">
            <Mic className="h-3 w-3" />
            Topic: {pair.topic}
          </p>

          <div className="mt-3 space-y-2">
            {pair.messages.map((message, i) => (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 1.1, duration: 0.4, ease }}
                className={`flex ${message.from === "guest" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${
                    message.from === "guest" ? "bg-ink text-white" : "bg-surface text-ink shadow-e1"
                  }`}
                >
                  {message.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.2, duration: 0.4, ease }}
            className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-surface px-3.5 py-3 shadow-e1"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-brand">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">Interview booked</p>
                <p className="text-[12px] text-ink-soft">{pair.date}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/70 px-2.5 py-1 text-[11.5px] font-medium text-ink">
              <Check className="h-3 w-3" strokeWidth={3} />
              No middlemen
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2 px-2 pt-3 pb-1 text-[12px] text-ink-soft">
        <Waveform className="text-brand" />
        Hosts and guests messaging directly right now
      </div>
    </div>
  );
}
