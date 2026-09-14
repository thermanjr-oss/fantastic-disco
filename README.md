# Productivity OS

A Next.js (App Router) PWA that combines tasks, a calendar, projects, and
subscription tracking, plus a Reminder Bot that nudges you when things go
overdue and an AI copilot that turns a rough idea into a task list.

## Stack

- **Frontend/PWA:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes + PostgreSQL via Prisma
- **Auth:** NextAuth (Google, GitHub, optional email magic link)
- **Notifications:** Web Push (VAPID) + a cron-triggered reminder sweep
- **AI:** Anthropic + OpenAI SDKs (per-user API keys, entered in Settings)

## Getting started

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, OAuth creds, VAPID keys
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000, sign in with Google or GitHub, and start adding tasks.

## Project structure

```
app/
  page.tsx                 landing + sign-in
  dashboard/page.tsx        focus mode + inbox
  tasks/page.tsx            full task list
  calendar/page.tsx         month view
  projects/page.tsx         project board + AI breakdown
  subscriptions/page.tsx    subscription tracker
  settings/page.tsx         AI keys + push notifications
  api/
    tasks/                  task CRUD
    projects/               project CRUD
    subscriptions/          subscription CRUD
    reminders/              in-app nudges polled by <ReminderBot/>
    cron/reminders/         cross-user push sweep (call on a schedule)
    ai/breakdown/           AI task breakdown
    push/                   store a browser's push subscription
    auth/[...nextauth]/     NextAuth handler
components/                 TaskList, CalendarMonth, ReminderBot, ProjectBoard,
                             SubscriptionTable, FocusMode, NavShell, ...
lib/                        db.ts, auth.ts, ai.ts, notifications.ts, reminderEngine.ts
prisma/schema.prisma        User, Task, Project, Subscription, PushSubscription
```

## Wiring up the reminder sweep

`POST /api/cron/reminders` with header `Authorization: Bearer $CRON_SECRET`
finds tasks whose `reminderAt` just fired and subscriptions renewing soon, and
sends a Web Push notification for each. Point any scheduler at it — a Vercel
Cron Job, a GitHub Actions workflow on a schedule, or a small server-side
cron — running every 1-5 minutes.

## AI keys

Users paste their own Anthropic and/or OpenAI key under **Settings**; "Break
it down" on a project calls whichever is configured (Claude preferred) to
turn a one-line idea into 5-10 tasks. No app-wide AI key is required.
