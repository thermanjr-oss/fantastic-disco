"use client";

import type { Task } from "@/types";

interface Props {
  task: Task;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggleDone, onDelete }: Props) {
  const isDone = task.status === "done";
  const isOverdue = !isDone && task.dueAt && new Date(task.dueAt) < new Date();

  return (
    <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface px-3 py-2">
      <input
        type="checkbox"
        checked={isDone}
        onChange={() => onToggleDone(task)}
        className="h-4 w-4 accent-accent"
        aria-label={`Mark "${task.title}" as done`}
      />
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm ${isDone ? "line-through text-white/40" : "text-white"}`}>
          {task.title}
        </p>
        {task.dueAt && (
          <p className={`text-xs ${isOverdue ? "text-red-400" : "text-white/50"}`}>
            Due {new Date(task.dueAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(task)}
        className="text-xs text-white/40 hover:text-red-400"
        aria-label={`Delete "${task.title}"`}
      >
        Delete
      </button>
    </li>
  );
}
