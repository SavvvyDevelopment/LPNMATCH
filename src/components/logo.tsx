import Link from "next/link";
import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-8 w-8 place-items-center overflow-hidden rounded-xl bg-ink text-white transition-transform duration-300 group-hover:-rotate-6",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M5 10v4" />
        <path d="M9 7v10" />
        <path d="M13 4v16" className="text-sun" stroke="var(--color-sun)" />
        <path d="M17 8v8" />
        <path d="M21 11v2" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", className, inverted = false }: { href?: string; className?: string; inverted?: boolean }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2", className)} aria-label="LPN Match, home">
      <LogoMark />
      <span className={cn("text-[17px] font-semibold tracking-[-0.03em]", inverted ? "text-white" : "text-ink")}>
        LPN <span className="text-brand">Match</span>
      </span>
    </Link>
  );
}
