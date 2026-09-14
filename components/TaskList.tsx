"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types";
import { TaskItem } from "./TaskItem";

interface Props {
  list?: string;
  projectId?: string;
}

export function TaskList({ list, projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams();
  if (list) query.set("list", list);
  if (projectId) query.set("project", projectId);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks?${query.toString()}`);
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, projectId]);

  const addTask = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, list, projectId }),
    });
    if (res.ok) {
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
    }
  };

  const toggleDone = async (task: Task) => {
    const status = task.status === "done" ? "pending" : "done";
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    }
  };

  const deleteTask = async (task: Task) => {
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task…"
          className="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          onClick={addTask}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
        >
          Add
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-white/40">Nothing here yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleDone={toggleDone} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </div>
  );
}
