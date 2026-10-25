import Link from "next/link";

import { Logo } from "@/components/logo";
import { HeaderBar } from "@/components/marketing/header-bar";
import { marketingNav, site } from "@/lib/content";
import { getSessionUser } from "@/lib/db/data";

export async function SiteHeader() {
  const user = await getSessionUser().catch(() => null);
  return <HeaderBar signedIn={Boolean(user)} />;
}

const accountLinks = [
  { href: "/signup", label: "Join free" },
  { href: "/login", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="shell pt-4 pb-3 sm:pb-4">
      <div className="rounded-3xl bg-surface px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              {site.tagline} No assistants, no booking agents, no forwarded email chains. Just the host, the guest and
              the interview.
            </p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-3 space-y-2.5">
              {marketingNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] font-medium text-ink transition-colors hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Account</p>
            <ul className="mt-3 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] font-medium text-ink transition-colors hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="text-[15px] text-ink-soft transition-colors hover:text-ink">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-subtle pt-6 text-[13px] text-ink-soft md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} LPN Match. All rights reserved.</p>
          <p>Built for podcast hosts and guests.</p>
        </div>
      </div>
    </footer>
  );
}
