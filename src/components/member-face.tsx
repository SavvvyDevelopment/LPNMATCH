import { cn } from "cn";

import { initials } from "@/lib/labels";
import { avatarSrc } from "@/lib/media";

const gradients = [
  "from-lilac to-peach",
  "from-brand-soft to-lilac",
  "from-peach to-sun",
  "from-sun to-lilac",
  "from-mint to-brand-soft",
];

function gradientFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return gradients[hash % gradients.length];
}

export function Face({
  name,
  photoKey,
  className,
}: {
  name: string;
  photoKey?: string | null;
  className?: string;
}) {
  const src = avatarSrc(photoKey);
  return (
    <span
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br text-[14px] font-semibold text-ink",
        gradientFor(name),
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function MemberFace({
  name,
  photoKey,
  subtitle,
  className,
}: {
  name: string;
  photoKey?: string | null;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <Face name={name} photoKey={photoKey} />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">{name}</p>
        {subtitle ? <p className="truncate text-[13px] text-ink-soft">{subtitle}</p> : null}
      </div>
    </div>
  );
}
