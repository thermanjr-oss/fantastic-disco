import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/apiAuth";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subs = await db.subscription.findMany({
    where: { userId },
    orderBy: { renewalDate: "asc" },
  });
  return NextResponse.json(subs);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.serviceName || typeof body.serviceName !== "string") {
    return NextResponse.json({ error: "serviceName is required" }, { status: 400 });
  }

  const sub = await db.subscription.create({
    data: {
      userId,
      serviceName: body.serviceName,
      plan: body.plan ?? null,
      cost: typeof body.cost === "number" ? body.cost : null,
      renewalDate: body.renewalDate ? new Date(body.renewalDate) : null,
      remindDaysBefore: typeof body.remindDaysBefore === "number" ? body.remindDaysBefore : 3,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(sub, { status: 201 });
}
