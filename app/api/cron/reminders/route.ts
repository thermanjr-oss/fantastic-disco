import { NextRequest, NextResponse } from "next/server";
import { runReminderSweep } from "@/lib/reminderEngine";

/**
 * Cron entry point — call this on an interval (Vercel Cron, GitHub Actions,
 * or any external scheduler) with header `Authorization: Bearer $CRON_SECRET`.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runReminderSweep();
  return NextResponse.json(result);
}
