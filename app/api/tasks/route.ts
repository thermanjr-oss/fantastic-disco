import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const list = searchParams.get("list") ?? undefined;
  const projectId = searchParams.get("project") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const tasks = await db.task.findMany({
    where: {
      userId,
      ...(list ? { list } : {}),
      ...(projectId ? { projectId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { dueAt: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const task = await db.task.create({
    data: {
      userId,
      title: body.title,
      description: body.description ?? null,
      list: body.list ?? "Inbox",
      projectId: body.projectId ?? null,
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
      reminderAt: Array.isArray(body.reminderAt) ? body.reminderAt.map((d: string) => new Date(d)) : [],
      priority: body.priority ?? 0,
      tags: Array.isArray(body.tags) ? body.tags : [],
    },
  });

  return NextResponse.json(task, { status: 201 });
}
