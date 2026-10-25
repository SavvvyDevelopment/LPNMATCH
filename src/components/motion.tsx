"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

export const ease = [0.22, 1, 0.36, 1] as const;

export function rise(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div className={className} {...rise(delay)}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  body,
  className,
  align = "left",
}: {
  label: string;
  title: React.ReactNode;
  body?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{label}</p>
      <h2 className="mt-2 text-[34px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink sm:text-[48px] lg:text-[56px]">
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-4 max-w-[58ch] text-[17px] leading-relaxed text-pretty text-ink-soft",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}

export function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return <span ref={ref}>{value.toLocaleString("en-US")}</span>;
}

export function PingDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-brand opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
    </span>
  );
}

export function Waveform({ className, bars = 5 }: { className?: string; bars?: number }) {
  return (
    <span className={cn("flex h-4 items-center gap-[3px]", className)} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="h-full w-[3px] origin-center animate-wave rounded-full bg-current"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}
