"use client";

import type { Task } from "@/types";

interface Props {
  tasks: Task[];
  year: number;
  month: number; // 0-11
}

export function CalendarMonth({ tasks, year, month }: Props) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay: Record<number, Task[]> = {};
  for (const task of tasks) {
    if (!task.dueAt) continue;
    const d = new Date(task.dueAt);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      (byDay[day] ??= []).push(task);
    }
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-white">{monthLabel}</h2>
      <div className="grid grid-cols-7 gap-1 text-xs text-white/50 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const dayTasks = day ? byDay[day] ?? [] : [];
          return (
            <div
              key={i}
              className="min-h-[72px] rounded-md border border-white/10 bg-surface p-1"
            >
              {day && <div className="text-xs text-white/60">{day}</div>}
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="truncate rounded bg-accent/80 px-1 py-0.5 text-[10px] text-white"
                  >
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-white/40">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
