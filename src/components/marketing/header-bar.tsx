"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "cn";

import { Logo } from "@/components/logo";
import { ease } from "@/components/motion";
import { marketingNav } from "@/lib/content";

export function HeaderBar({ signedIn }: { signedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  const cta = signedIn
    ? { href: "/dashboard", label: "Open dashboard" }
    : { href: "/signup", label: "Join free" };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-canvas/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {marketingNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors hover:bg-surface hover:text-ink",
                pathname === link.href ? "bg-surface text-ink" : "text-ink-soft",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          {!signedIn && (
            <Link
              href="/login"
              className="pill h-9 px-4 text-[14px] text-ink-soft hover:bg-surface hover:text-ink"
            >
              Sign in
            </Link>
          )}
          <Link href={cta.href} className="pill group h-9 bg-ink px-4 text-[14px] text-white hover:bg-ink-hover">
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink shadow-e1 lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className="shell pb-4 lg:hidden"
          >
            <div className="rounded-3xl bg-surface p-3 shadow-e2">
              <ul className="flex flex-col">
                {marketingNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-[16px] font-medium text-ink transition-colors hover:bg-canvas"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 grid gap-2 border-t border-subtle pt-3 sm:grid-cols-2">
                {!signedIn && (
                  <Link href="/login" className="pill h-12 border border-line text-[15px] text-ink hover:bg-subtle">
                    Sign in
                  </Link>
                )}
                <Link
                  href={cta.href}
                  className={cn("pill h-12 bg-ink text-[15px] text-white hover:bg-ink-hover", signedIn && "sm:col-span-2")}
                >
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
