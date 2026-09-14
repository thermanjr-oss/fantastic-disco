import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/apiAuth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.task.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ["title", "description", "list", "status", "priority", "projectId"] as const) {
    if (key in body) data[key] = body[key];
  }
  if ("dueAt" in body) data.dueAt = body.dueAt ? new Date(body.dueAt) : null;
  if ("reminderAt" in body && Array.isArray(body.reminderAt)) {
    data.reminderAt = body.reminderAt.map((d: string) => new Date(d));
  }
  if ("tags" in body && Array.isArray(body.tags)) data.tags = body.tags;

  const task = await db.task.update({ where: { id: params.id }, data });
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.task.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
