import type { LucideIcon } from "lucide-react";
import {
  ChartColumnIcon,
  CompassIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MessagesSquareIcon,
  MicIcon,
  SparklesIcon,
  TrophyIcon,
  UserRoundIcon,
} from "lucide-react";

export const dashboardNav: {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "main" | "grow";
  mobile?: boolean;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, group: "main", mobile: true },
  { href: "/dashboard/matches", label: "Matches", icon: SparklesIcon, group: "main", mobile: true },
  { href: "/dashboard/explore", label: "Explore", icon: CompassIcon, group: "main", mobile: true },
  { href: "/dashboard/messages", label: "Messages", icon: MessagesSquareIcon, group: "main", mobile: true },
  { href: "/dashboard/interviews", label: "Interviews", icon: MicIcon, group: "main" },
  { href: "/dashboard/workflows", label: "Workflows", icon: ListChecksIcon, group: "main" },
  { href: "/dashboard/profile", label: "Profile", icon: UserRoundIcon, group: "grow" },
  { href: "/dashboard/stats", label: "Stats", icon: ChartColumnIcon, group: "grow" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: TrophyIcon, group: "grow" },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
