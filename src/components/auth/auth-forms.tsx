"use client";

import { ArrowRight, Building2, Eye, EyeOff, Headphones, LoaderCircle, Mic, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "cn";

import { authClient } from "@/lib/auth/client";
import { claimProfile } from "@/lib/db/actions";
import type { MemberRole } from "@/lib/db/schema";

const roles: { id: MemberRole; label: string; hint: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "host", label: "Host", hint: "I run a podcast", icon: Mic },
  { id: "guest", label: "Guest", hint: "I want to be on shows", icon: Headphones },
  { id: "both", label: "Both", hint: "I host and guest", icon: Users },
  { id: "agency", label: "Agency", hint: "I book clients", icon: Building2 },
];

const inputClass =
  "h-12 w-full rounded-2xl bg-canvas px-4 text-base text-ink ring-1 ring-transparent transition-shadow outline-none placeholder:text-ink-faint hover:ring-line focus:bg-surface focus:ring-2 focus:ring-brand/50";

function Field({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13.5px] font-medium text-ink">
        {label}
      </label>
      <input id={name} name={name} className={inputClass} {...props} />
    </div>
  );
}

function PasswordField({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13.5px] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input id={name} name={name} type={visible ? "text" : "password"} className={`${inputClass} pr-12`} {...props} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-faint transition-colors hover:bg-subtle hover:text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[16px] font-medium text-white transition-colors hover:bg-ink-hover disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    const result = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (result.error) {
      toast.error(result.error.message ?? "Could not sign in.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <PasswordField label="Password" name="password" autoComplete="current-password" required />
      <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in..." />
    </form>
  );
}

export function SignupForm({ initialRole }: { initialRole: MemberRole }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [role, setRole] = useState<MemberRole>(initialRole);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      setPending(false);
      toast.error(result.error.message ?? "Could not create the account.");
      return;
    }
    const claimed = await claimProfile({ role, name });
    setPending(false);
    if ("error" in claimed && claimed.error) {
      toast.message(claimed.error);
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset>
        <legend className="mb-1.5 block text-[13.5px] font-medium text-ink">I&apos;m joining as</legend>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              aria-pressed={role === item.id}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl p-3 text-left transition-all",
                role === item.id ? "bg-ink text-white shadow-e1" : "bg-canvas text-ink hover:ring-1 hover:ring-line",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                  role === item.id ? "bg-sun text-ink" : "bg-surface text-ink",
                )}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">{item.label}</span>
                <span className={cn("block truncate text-[12px]", role === item.id ? "text-white/60" : "text-ink-soft")}>
                  {item.hint}
                </span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Name" name="name" autoComplete="name" placeholder="Your name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <PasswordField label="Password" name="password" autoComplete="new-password" minLength={8} required />
      <p className="-mt-2 text-[12.5px] text-ink-faint">At least 8 characters.</p>
      <SubmitButton pending={pending} label="Create account" pendingLabel="Creating account..." />
    </form>
  );
}
