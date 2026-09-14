import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/apiAuth";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.project.findMany({
    where: { userId },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const project = await db.project.create({
    data: {
      userId,
      name: body.name,
      description: body.description ?? null,
      linkedRepos: Array.isArray(body.linkedRepos) ? body.linkedRepos : [],
      linkedAiContext: body.linkedAiContext ?? undefined,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
