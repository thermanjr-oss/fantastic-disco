import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/apiAuth";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, aiOpenAIKey: true, aiClaudeKey: true },
  });
  return NextResponse.json({
    name: user?.name ?? "",
    email: user?.email ?? "",
    hasOpenAIKey: Boolean(user?.aiOpenAIKey),
    hasClaudeKey: Boolean(user?.aiClaudeKey),
  });
}

export async function PATCH(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.aiOpenAIKey === "string") data.aiOpenAIKey = body.aiOpenAIKey || null;
  if (typeof body.aiClaudeKey === "string") data.aiClaudeKey = body.aiClaudeKey || null;

  await db.user.update({ where: { id: userId }, data });
  return NextResponse.json({ ok: true });
}
