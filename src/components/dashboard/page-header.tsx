import { cn } from "cn";

import { Rise } from "@/components/motion";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Rise className={cn("flex flex-col gap-4 pt-2 pb-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-1 text-[32px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink sm:text-[44px]">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </Rise>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("lift p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>}
            {description && <p className="mt-1 text-[14px] text-ink-soft">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone = "surface",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "surface" | "sun" | "ink" | "stage";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5 sm:p-6",
        tone === "sun" && "bg-sun text-ink",
        tone === "ink" && "bg-ink text-white",
        tone === "surface" && "bg-surface text-ink",
        tone === "stage" && "stage-soft text-ink",
      )}
    >
      <p className={cn("text-[13.5px] font-medium", tone === "ink" ? "text-white/60" : tone === "sun" ? "text-ink/70" : "text-ink-soft")}>
        {label}
      </p>
      <p className="mt-3 text-[36px] leading-none font-semibold tracking-[-0.045em] tabular-nums sm:text-[44px]">{value}</p>
      {hint && (
        <p className={cn("mt-2 text-[13px]", tone === "ink" ? "text-white/60" : tone === "sun" ? "text-ink/60" : "text-ink-faint")}>{hint}</p>
      )}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="stage-soft flex flex-col items-center rounded-3xl px-6 py-14 text-center">
      <p className="text-[20px] font-semibold tracking-[-0.03em] text-ink">{title}</p>
      <p className="mt-2 max-w-md text-[15px] text-ink-soft">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
