import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/apiAuth";
import { getPendingNudgesForUser } from "@/lib/reminderEngine";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const nudges = await getPendingNudgesForUser(userId);
  return NextResponse.json(nudges);
}
