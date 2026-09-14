import { db } from "./db";
import { sendPushToUser } from "./notifications";

export interface Nudge {
  id: string;
  taskTitle: string;
  overdueDays: number;
}

/** In-app nudges for one user — polled by <ReminderBot/> every minute. */
export async function getPendingNudgesForUser(userId: string): Promise<Nudge[]> {
  const now = new Date();
  const tasks = await db.task.findMany({
    where: {
      userId,
      status: { not: "done" },
      dueAt: { lte: now, not: null },
    },
    orderBy: { dueAt: "asc" },
    take: 5,
  });

  return tasks.map((task) => {
    const dueAt = task.dueAt as Date;
    const overdueDays = Math.max(0, Math.floor((now.getTime() - dueAt.getTime()) / 86_400_000));
    return { id: task.id, taskTitle: task.title, overdueDays };
  });
}

/**
 * Cross-user sweep for a server cron / hosted worker to call periodically.
 * Sends a push notification for each task whose reminderAt has just come due
 * and hasn't been pushed yet, and for subscriptions renewing within their
 * configured reminder window.
 */
export async function runReminderSweep() {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 5 * 60_000); // last 5 minutes

  const dueTasks = await db.task.findMany({
    where: {
      status: { not: "done" },
      reminderAt: { isEmpty: false },
    },
  });

  const results: { taskId: string; userId: string }[] = [];
  for (const task of dueTasks) {
    const justFired = task.reminderAt.some((r) => r >= windowStart && r <= now);
    if (!justFired) continue;
    await sendPushToUser(task.userId, {
      title: "Task reminder",
      body: task.title,
      url: "/tasks",
    });
    results.push({ taskId: task.id, userId: task.userId });
  }

  const dueSubs = await db.subscription.findMany({ where: { renewalDate: { not: null } } });
  for (const sub of dueSubs) {
    if (!sub.renewalDate) continue;
    const remindAt = new Date(sub.renewalDate.getTime() - sub.remindDaysBefore * 86_400_000);
    if (remindAt >= windowStart && remindAt <= now) {
      await sendPushToUser(sub.userId, {
        title: "Subscription renewing soon",
        body: `${sub.serviceName} renews on ${sub.renewalDate.toISOString().slice(0, 10)}`,
        url: "/subscriptions",
      });
    }
  }

  return { tasksNotified: results.length };
}
