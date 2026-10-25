import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { ensureAccount } from "@/lib/db/data";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const account = await ensureAccount();
  if (!account) redirect("/login");

  return (
    <DashboardShell
      email={account.user.email ?? ""}
      profile={{
        displayName: account.profile.displayName,
        username: account.profile.username,
        role: account.profile.role,
        plan: account.profile.plan,
        photoKey: account.profile.photoKey,
      }}
    >
      {children}
    </DashboardShell>
  );
}
