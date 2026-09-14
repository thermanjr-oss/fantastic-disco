"use client";

import { useEffect, useState } from "react";
import type { Nudge } from "@/lib/reminderEngine";

export function ReminderBot() {
  const [messages, setMessages] = useState<Nudge[]>([]);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch("/api/reminders");
      if (res.ok) setMessages(await res.json());
    };
    poll();
    const interval = setInterval(poll, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (messages.length === 0) return null;

  const msg = messages[0];
  const text =
    msg.overdueDays > 0
      ? `You're ${msg.overdueDays} day(s) late on "${msg.taskTitle}". What's blocking you?`
      : `Time to move on "${msg.taskTitle}". Take one concrete step right now.`;

  const markDone = async () => {
    await fetch(`/api/tasks/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  };

  const dismiss = () => setMessages((prev) => prev.filter((m) => m.id !== msg.id));

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-white/10 bg-surface p-4 shadow-xl">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Reminder Bot</p>
      <p className="mb-3 text-sm text-white">{text}</p>
      <div className="flex gap-2">
        <button
          onClick={markDone}
          className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent/80"
        >
          Mark done
        </button>
        <button
          onClick={dismiss}
          className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
        >
          Later
        </button>
      </div>
    </div>
  );
}
