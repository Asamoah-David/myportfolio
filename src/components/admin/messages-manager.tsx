"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Reply, Inbox, Loader2, Circle } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/lib/actions/messages";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types/database";

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const list = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  function open(m: ContactMessage) {
    setSelected(m);
    if (!m.is_read) {
      start(async () => {
        await markMessageRead(m.id, true);
        router.refresh();
      });
    }
  }

  function toggleRead(m: ContactMessage) {
    start(async () => {
      await markMessageRead(m.id, !m.is_read);
      router.refresh();
    });
  }

  function remove(id: string) {
    start(async () => {
      await deleteMessage(id);
      if (selected?.id === id) setSelected(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            Messages
          </h1>
          <p className="mt-1 text-sm text-ink-400">Inquiries from your contact form.</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 p-1">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                filter === f ? "bg-[var(--accent)] text-black" : "text-ink-300 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <Inbox className="h-10 w-10 text-ink-600" />
          <p className="text-sm text-ink-400">No messages.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="overflow-hidden rounded-xl border border-white/8">
            <ul className="divide-y divide-white/5">
              {list.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => open(m)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] ${
                      selected?.id === m.id ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <Circle
                      className={`mt-1.5 h-2 w-2 shrink-0 ${
                        m.is_read ? "fill-ink-700 text-ink-700" : "fill-[var(--accent)] text-[var(--accent)]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${m.is_read ? "text-ink-300" : "font-semibold text-white"}`}>
                          {m.name}
                        </p>
                        <span className="shrink-0 text-xs text-ink-500">{formatDate(m.created_at)}</span>
                      </div>
                      <p className="truncate text-xs text-ink-500">{m.subject || m.email}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-600">{m.message}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card h-fit p-6">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-[var(--accent-soft)] hover:underline">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleRead(selected)}
                      disabled={pending}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 hover:bg-white/5 hover:text-white"
                      aria-label="Toggle read"
                    >
                      {selected.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => remove(selected.id)}
                      disabled={pending}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Delete"
                    >
                      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {selected.subject && (
                  <p className="mt-4 text-sm font-medium text-ink-200">{selected.subject}</p>
                )}
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-300">
                  {selected.message}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-ink-500">
                    Received {formatDate(selected.created_at)}
                  </span>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-soft)] hover:underline"
                  >
                    <Reply className="h-4 w-4" /> Reply
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Mail className="h-10 w-10 text-ink-600" />
                <p className="text-sm text-ink-400">Select a message to read it.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
