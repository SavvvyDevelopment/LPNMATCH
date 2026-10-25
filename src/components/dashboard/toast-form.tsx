"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export function ToastForm({
  action,
  success = "Saved",
  className,
  children,
}: {
  action: (formData: FormData) => Promise<{ error?: string; ok?: true }>;
  success?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          const result = await action(data);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          form.reset();
          toast.success(success);
        });
      }}
    >
      <fieldset disabled={pending} aria-busy={pending} className="min-w-0 transition-opacity disabled:opacity-60">
        {children}
      </fieldset>
    </form>
  );
}
