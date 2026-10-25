import { ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { authPanel } from "@/lib/content";

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh grid-cols-[minmax(0,1fr)] gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <BrandPanel />

      <main className="flex min-w-0 flex-col px-1 py-2 sm:px-6 sm:py-4 lg:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center py-4 lg:items-center lg:py-8">
          <div className="w-full max-w-[440px]">
            <div className="rounded-3xl bg-surface p-5 shadow-e2 ring-1 ring-line/60 sm:p-8">
              <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">{title}</h1>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>
              <div className="mt-7">{children}</div>
            </div>
            <div className="mt-5 text-center text-[14px] text-ink-soft">{footer}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className="stage relative hidden animate-drift flex-col overflow-hidden rounded-[28px] p-8 lg:sticky lg:top-3 lg:flex lg:h-[calc(100svh-1.5rem)] xl:p-12">
      <Logo />

      <div className="my-auto max-w-[32rem] py-6 tall:py-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-e1">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {authPanel.eyebrow}
        </p>
        <h2 className="mt-5 text-[48px] leading-[1] font-semibold tracking-[-0.05em] text-balance text-ink xl:text-[60px]">
          {authPanel.title}
        </h2>
        <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-pretty text-ink-soft">{authPanel.text}</p>

        <div className="mt-7 hidden rounded-3xl bg-surface p-3 shadow-e2 ring-1 ring-line/60 tall:block">
          <div className="flex items-center gap-3 px-2 pt-1 pb-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-lilac to-peach text-ink">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
              New match <span className="ml-1 rounded-full bg-sun px-2 py-0.5 text-[11px]">96%</span>
            </p>
          </div>
          <div className="space-y-2 rounded-[20px] bg-canvas p-3">
            <p className="max-w-[90%] rounded-2xl bg-surface px-4 py-3 text-[14px] leading-relaxed text-ink shadow-e1">
              Your story is exactly what my listeners ask about. Want to come on the show?
            </p>
            <p className="ml-auto max-w-[80%] rounded-2xl bg-ink px-4 py-3 text-[14px] leading-relaxed text-white">
              I&apos;d love to. Tuesday works for me.
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5">
          {authPanel.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-[14.5px] font-medium text-ink">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[13px] text-ink-soft">Podcast hosts and guests, matched directly.</p>
    </aside>
  );
}
