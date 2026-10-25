import { ArrowLeft, ArrowUp, ArrowUpRight, ShieldOff } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { ToastForm } from "@/components/dashboard/toast-form";
import { Face, MemberFace } from "@/components/member-face";
import { sendMessage, updateConversation } from "@/lib/db/actions";
import { ensureAccount, getThread, listConversations } from "@/lib/db/data";
import { conversationStatus, type ConversationStatus } from "@/lib/db/schema";
import { conversationLabels, hostsShows, roleLabels } from "@/lib/labels";

const timeFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const account = await ensureAccount();
  if (!account) return null;
  const params = await searchParams;
  const conversations = await listConversations(account.profile.id);
  const selectedId = params.c ?? conversations[0]?.conversation.id;
  const thread = selectedId ? await getThread(account.profile.id, selectedId) : null;
  const showThreadOnMobile = Boolean(thread && params.c);

  return (
    <>
      <PageHeader
        eyebrow="Messages"
        title={
          <>
            Talk directly. <span className="text-ink-faint">Book faster.</span>
          </>
        }
        description="Every thread is just you and the other person. Track the booking status on the right."
        className={showThreadOnMobile ? "hidden lg:flex" : undefined}
      />

      <div className="grid min-h-[36rem] gap-3 lg:h-[calc(100svh-15rem)] lg:grid-cols-[20rem_1fr] xl:grid-cols-[20rem_1fr_19rem]">
        <aside className={`lift flex-col p-2 ${showThreadOnMobile ? "hidden lg:flex" : "flex"}`}>
          <p className="px-3 pt-3 pb-2 text-[13px] font-medium text-ink-soft">
            {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
          </p>
          {conversations.length === 0 ? (
            <p className="m-2 rounded-2xl bg-canvas p-4 text-[14px] text-ink-soft">Accept a match to start a thread.</p>
          ) : (
            <ul className="flex-1 space-y-1 overflow-y-auto">
              {conversations.map((row) => {
                const active = row.conversation.id === selectedId;
                return (
                  <li key={row.conversation.id}>
                    <Link
                      href={`/dashboard/messages?c=${row.conversation.id}`}
                      className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${active ? "bg-canvas" : "hover:bg-canvas/60"}`}
                    >
                      <Face name={row.profile?.displayName ?? "Member"} photoKey={row.profile?.photoKey} className="h-11 w-11" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[14.5px] font-semibold text-ink">{row.profile?.displayName}</p>
                          <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10.5px] font-medium text-ink-soft shadow-e1">
                            {conversationLabels[row.conversation.status]}
                          </span>
                        </div>
                        <p className="truncate text-[13px] text-ink-soft">{row.last?.body ?? "No messages yet"}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className={`lift min-h-0 flex-col ${thread ? (showThreadOnMobile ? "flex" : "hidden lg:flex") : "hidden lg:flex"}`}>
          {thread?.profile ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-subtle p-4">
                <div className="flex min-w-0 items-center gap-2">
                  <Link
                    href="/dashboard/messages"
                    aria-label="Back to conversations"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-ink lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <MemberFace
                    name={thread.profile.displayName}
                    photoKey={thread.profile.photoKey}
                    subtitle={hostsShows(thread.profile.role) && thread.profile.showName ? thread.profile.showName : roleLabels[thread.profile.role]}
                  />
                </div>
                <Link
                  href={`/profile/${thread.profile.username}`}
                  className="pill group h-9 shrink-0 bg-subtle px-3.5 text-[13px] text-ink hover:bg-ink hover:text-white"
                >
                  Profile
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-canvas/50 p-4 sm:p-6">
                <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-e1">
                  <ShieldOff className="h-3 w-3" />
                  Direct thread. No one else can read this.
                </p>
                {thread.messages.map((message) => {
                  const mine = message.senderProfileId === account.profile.id;
                  return (
                    <div key={message.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <p
                        className={`max-w-[80%] rounded-3xl px-4 py-3 text-[14.5px] leading-relaxed ${
                          mine ? "rounded-br-lg bg-ink text-white" : "rounded-bl-lg bg-surface text-ink shadow-e1"
                        }`}
                      >
                        {message.body}
                      </p>
                      <span className="mt-1 px-2 text-[11px] text-ink-faint">{timeFormat.format(message.createdAt)}</span>
                    </div>
                  );
                })}
              </div>

              <ToastForm action={sendMessage} success="Message sent" className="border-t border-subtle p-3">
                <input type="hidden" name="conversationId" value={thread.conversation.id} />
                <div className="flex items-center gap-2 rounded-full bg-canvas p-1.5 pl-5 focus-within:ring-2 focus-within:ring-brand/50">
                  <input
                    name="body"
                    placeholder={`Message ${thread.profile.displayName.split(" ")[0]}...`}
                    required
                    autoComplete="off"
                    className="h-10 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink-hover"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </ToastForm>
            </>
          ) : (
            <div className="stage-soft m-2 flex flex-1 items-center justify-center rounded-[20px] p-8 text-center">
              <p className="text-[15px] text-ink-soft">Pick a conversation to start talking.</p>
            </div>
          )}
        </section>

        {thread && (
          <aside className={`flex-col gap-3 lg:col-span-2 xl:col-span-1 ${showThreadOnMobile ? "flex" : "hidden xl:flex"}`}>
            <BookingPanel
              conversationId={thread.conversation.id}
              status={thread.conversation.status}
              nextStep={thread.conversation.nextStep}
            />
          </aside>
        )}
      </div>
    </>
  );
}

function BookingPanel({
  conversationId,
  status,
  nextStep,
}: {
  conversationId: string;
  status: ConversationStatus;
  nextStep: string;
}) {
  const currentIndex = conversationStatus.enumValues.indexOf(status);
  return (
    <div className="lift p-5">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">Booking status</h2>
      <p className="mt-1 text-[13.5px] text-ink-soft">Move the thread along as you go.</p>

      <ol className="mt-5 space-y-2">
        {conversationStatus.enumValues.map((value, index) => (
          <li
            key={value}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium ${
              index === currentIndex ? "bg-ink text-white" : index < currentIndex ? "bg-canvas text-ink" : "bg-canvas text-ink-faint"
            }`}
          >
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                index === currentIndex ? "bg-sun text-ink" : index < currentIndex ? "bg-ink text-white" : "bg-surface text-ink-faint"
              }`}
            >
              {index + 1}
            </span>
            {conversationLabels[value]}
          </li>
        ))}
      </ol>

      <ToastForm action={updateConversation} success="Booking updated" className="mt-5 border-t border-subtle pt-5">
        <input type="hidden" name="conversationId" value={conversationId} />
        <label htmlFor="status" className="mb-1.5 block text-[13px] font-medium text-ink">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="h-11 w-full rounded-2xl bg-canvas px-4 text-[14.5px] text-ink outline-none focus:ring-2 focus:ring-brand/50"
        >
          {conversationStatus.enumValues.map((value) => (
            <option key={value} value={value}>
              {conversationLabels[value]}
            </option>
          ))}
        </select>
        <label htmlFor="nextStep" className="mt-3 mb-1.5 block text-[13px] font-medium text-ink">
          Next step
        </label>
        <textarea
          id="nextStep"
          name="nextStep"
          defaultValue={nextStep}
          rows={3}
          className="w-full rounded-2xl bg-canvas px-4 py-3 text-[14.5px] text-ink outline-none focus:ring-2 focus:ring-brand/50"
        />
        <button type="submit" className="pill mt-3 h-11 w-full bg-ink text-[14px] text-white hover:bg-ink-hover">
          Update booking
        </button>
      </ToastForm>
    </div>
  );
}
