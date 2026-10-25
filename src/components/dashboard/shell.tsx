"use client";

import { ArrowUpRight, EllipsisIcon, LogOut, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "cn";

import { LogoMark } from "@/components/logo";
import { Face } from "@/components/member-face";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/client";
import type { MemberRole, PlanTier } from "@/lib/db/schema";
import { planLabels, roleLabels } from "@/lib/labels";
import { dashboardNav, isNavActive } from "@/lib/navigation";

type ShellProfile = {
  displayName: string;
  username: string;
  role: MemberRole;
  plan: PlanTier;
  photoKey: string | null;
};

const menuButtonClass =
  "h-10 rounded-2xl px-3 text-[14px] font-medium text-ink-soft transition-all hover:bg-surface/70 hover:text-ink data-active:bg-surface data-active:text-ink data-active:shadow-e1 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-3! [&_svg]:size-[18px]";

export function DashboardShell({
  profile,
  email,
  children,
}: {
  profile: ShellProfile;
  email: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-none">
        <SidebarHeader className="px-3 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-11 rounded-2xl px-1.5 hover:bg-transparent group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:p-1.5!"
                render={<Link href="/dashboard" />}
              >
                <LogoMark />
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
                  LPN <span className="text-brand">Match</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-1.5">
          <NavGroup label="Workspace" group="main" />
          <NavGroup label="Grow" group="grow" />
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="rounded-3xl bg-surface p-4 shadow-e1 group-data-[collapsible=icon]:hidden">
            <p className="text-[12px] font-medium text-ink-soft">
              {roleLabels[profile.role]} · {planLabels[profile.plan]}
            </p>
            <p className="mt-1 text-[14px] leading-snug font-semibold text-ink">Share your public page</p>
            <Link
              href={`/profile/${profile.username}`}
              className="pill group mt-3 h-9 w-full bg-ink text-[13px] text-white hover:bg-ink-hover"
            >
              View profile
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-canvas">
        <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-2 px-5 sm:px-10 lg:px-12">
            <SidebarTrigger className="size-10 rounded-full bg-surface shadow-e1 hover:bg-surface" />
            <div className="flex items-center gap-2 md:hidden">
              <LogoMark />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/dashboard/explore"
                className="pill hidden h-10 border border-line bg-surface px-4 text-[14px] text-ink hover:bg-subtle sm:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Find {profile.role === "guest" ? "shows" : "guests"}
              </Link>
              <UserMenu profile={profile} email={email} />
            </div>
          </div>
        </header>
        <div className="mx-auto flex w-full min-w-0 max-w-[1440px] flex-1 flex-col gap-4 px-5 pt-2 pb-28 sm:px-10 md:pb-10 lg:px-12">
          {children}
        </div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}

function NavGroup({ label, group }: { label: string; group: "main" | "grow" }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[12px] text-ink-faint">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {dashboardNav
            .filter((item) => item.group === group)
            .map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isNavActive(pathname, item.href)}
                  tooltip={item.label}
                  className={menuButtonClass}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function UserMenu({ profile, email }: { profile: ShellProfile; email: string }) {
  const router = useRouter();

  async function signOut() {
    const result = await authClient.signOut();
    if (result.error) {
      toast.error(result.error.message ?? "Could not sign out.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full bg-surface py-1 pr-1 pl-1 shadow-e1 outline-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-brand/50 sm:pr-4">
        <Face name={profile.displayName} photoKey={profile.photoKey} className="h-8 w-8 text-[12px]" />
        <span className="hidden max-w-40 truncate text-[14px] font-medium text-ink sm:block">{profile.displayName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-2">
            <p className="text-[14px] font-semibold text-ink">{profile.displayName}</p>
            <p className="truncate text-[12px] font-normal text-ink-soft">{email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="rounded-xl px-2.5 py-2" render={<Link href="/dashboard/profile" />}>
            <UserRound />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl px-2.5 py-2" render={<Link href={`/profile/${profile.username}`} />}>
            <ArrowUpRight />
            Public page
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl px-2.5 py-2" onClick={signOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const items = dashboardNav.filter((item) => item.mobile);

  return (
    <nav className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden">
      <ul className="grid grid-cols-5 rounded-full bg-surface/95 p-1.5 shadow-e2 ring-1 ring-line/60 backdrop-blur">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-full px-1 py-2 text-[10.5px] font-medium transition-colors",
                  active ? "bg-ink text-white" : "text-ink-soft",
                )}
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex w-full flex-col items-center gap-0.5 rounded-full px-1 py-2 text-[10.5px] font-medium text-ink-soft"
          >
            <EllipsisIcon className="size-[18px]" />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
