import { Check, Plus } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { ToastForm } from "@/components/dashboard/toast-form";
import { Reveal } from "@/components/motion";
import { addWorkflow, toggleStep } from "@/lib/db/actions";
import { ensureAccount, listWorkflows } from "@/lib/db/data";

export default async function WorkflowsPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const rows = await listWorkflows(account.profile.id);

  return (
    <>
      <PageHeader
        eyebrow="Workflows"
        title={
          <>
            Checklists that keep <span className="text-ink-faint">every episode moving.</span>
          </>
        }
        description="Prep, recording and promotion steps, tracked without a side spreadsheet."
      />

      <Reveal>
        <ToastForm action={addWorkflow} success="Checklist added">
          <div className="flex flex-col gap-2 rounded-3xl bg-surface p-2 sm:flex-row sm:rounded-full">
            <input
              name="name"
              required
              placeholder="Name a new checklist, like “Episode 143 with Marcus”"
              className="h-12 flex-1 rounded-full bg-canvas px-5 text-[15px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-brand/50"
            />
            <button type="submit" className="pill h-12 bg-ink px-6 text-[15px] text-white hover:bg-ink-hover">
              <Plus className="h-4 w-4" />
              Add checklist
            </button>
          </div>
        </ToastForm>
      </Reveal>

      {rows.length === 0 ? (
        <EmptyState title="No checklists yet" body="Add one above. We'll fill in the usual steps for your role." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {rows.map(({ workflow, steps }, i) => {
            const done = steps.filter((step) => step.done).length;
            const percent = steps.length === 0 ? 0 : Math.round((done / steps.length) * 100);
            return (
              <Reveal key={workflow.id} delay={(i % 3) * 0.06} className="h-full">
                <article className="lift flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-medium text-ink-soft capitalize">{workflow.kind}</p>
                      <h2 className="mt-1 text-[19px] font-semibold tracking-[-0.03em] text-ink">{workflow.name}</h2>
                    </div>
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-[14px] font-semibold tabular-nums ${
                        percent === 100 ? "bg-mint text-ink" : "bg-sun text-ink"
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas">
                    <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-[12.5px] text-ink-soft">
                    {done} of {steps.length} done
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {steps.map((step) => (
                      <li key={step.id}>
                        <ToastForm action={toggleStep} success={step.done ? "Step reopened" : "Step done"}>
                          <input type="hidden" name="stepId" value={step.id} />
                          <button
                            type="submit"
                            className="group flex w-full items-center gap-3 rounded-2xl bg-canvas px-3 py-3 text-left transition-colors hover:bg-subtle"
                          >
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${
                                step.done ? "bg-ink text-white" : "bg-surface text-transparent ring-1 ring-line group-hover:text-ink-faint"
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>
                            <span className={`text-[14.5px] ${step.done ? "text-ink-faint line-through" : "text-ink"}`}>
                              {step.title}
                            </span>
                          </button>
                        </ToastForm>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
