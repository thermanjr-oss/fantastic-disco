"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types";

/** Shows just the single highest-priority open task — for procrastinators who need one clear next step. */
export function FocusMode() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tasks?status=pending");
      if (res.ok) {
        const tasks: Task[] = await res.json();
        const sorted = [...tasks].sort((a, b) => {
          if (a.priority !== b.priority) return b.priority - a.priority;
          if (a.dueAt && b.dueAt) return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
          if (a.dueAt) return -1;
          if (b.dueAt) return 1;
          return 0;
        });
        setTask(sorted[0] ?? null);
      }
      setLoading(false);
    })();
  }, []);

  const complete = async () => {
    if (!task) return;
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    setTask(null);
  };

  if (loading) return null;

  return (
    <div className="rounded-xl border border-accent/40 bg-surface p-6 text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Focus</p>
      {task ? (
        <>
          <p className="mb-4 text-lg font-semibold text-white">{task.title}</p>
          <button
            onClick={complete}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
          >
            Done — give me the next one
          </button>
        </>
      ) : (
        <p className="text-white/60">Nothing pending. Add a task to get started.</p>
      )}
    </div>
  );
}
