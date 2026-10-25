import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";
import { isMemberRole } from "@/lib/labels";

export const metadata: Metadata = { title: "Join" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  const initialRole = params.role && isMemberRole(params.role) ? params.role : "guest";

  return (
    <AuthShell
      title="Join LPN Match."
      subtitle="Free to start. Pick your side of the mic, and you can change it later."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm initialRole={initialRole} />
    </AuthShell>
  );
}
