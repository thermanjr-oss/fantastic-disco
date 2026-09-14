"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types";
import { CalendarMonth } from "./CalendarMonth";

export function CalendarPageClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cursor, setCursor] = useState(() => new Date());

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tasks");
      if (res.ok) setTasks(await res.json());
    })();
  }, []);

  const shiftMonth = (delta: number) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button onClick={() => shiftMonth(-1)} className="text-white/60 hover:text-white">
          ← Prev
        </button>
        <button onClick={() => shiftMonth(1)} className="text-white/60 hover:text-white">
          Next →
        </button>
      </div>
      <CalendarMonth tasks={tasks} year={cursor.getFullYear()} month={cursor.getMonth()} />
    </div>
  );
}
