import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/apiAuth";
import { generateTaskBreakdown } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.idea || typeof body.idea !== "string") {
    return NextResponse.json({ error: "idea is required" }, { status: 400 });
  }

  try {
    const tasks = await generateTaskBreakdown(userId, body.idea, body.projectId);
    return NextResponse.json(tasks, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI breakdown failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
