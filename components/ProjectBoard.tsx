"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types";
import { TaskList } from "./TaskList";

export function ProjectBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const [ideaByProject, setIdeaByProject] = useState<Record<string, string>>({});
  const [breakingDown, setBreakingDown] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const addProject = async () => {
    const name = newName.trim();
    if (!name) return;
    setNewName("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) await load();
  };

  const breakdown = async (projectId: string) => {
    const idea = (ideaByProject[projectId] ?? "").trim();
    if (!idea) return;
    setBreakingDown(projectId);
    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, projectId }),
      });
      if (res.ok) {
        setIdeaByProject((prev) => ({ ...prev, [projectId]: "" }));
        await load();
      }
    } finally {
      setBreakingDown(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addProject()}
          placeholder="New project name…"
          className="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          onClick={addProject}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
        >
          New project
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-white/10 bg-surface p-4">
            <h3 className="mb-1 text-base font-semibold text-white">{project.name}</h3>
            {project.description && <p className="mb-3 text-xs text-white/50">{project.description}</p>}

            <div className="mb-3 flex gap-2">
              <input
                value={ideaByProject[project.id] ?? ""}
                onChange={(e) =>
                  setIdeaByProject((prev) => ({ ...prev, [project.id]: e.target.value }))
                }
                placeholder="Describe what you're building — AI will break it into tasks"
                className="flex-1 rounded-md border border-white/10 bg-background px-2 py-1 text-xs text-white placeholder:text-white/30"
              />
              <button
                onClick={() => breakdown(project.id)}
                disabled={breakingDown === project.id}
                className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent/80 disabled:opacity-50"
              >
                {breakingDown === project.id ? "Thinking…" : "Break it down"}
              </button>
            </div>

            <TaskList projectId={project.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
