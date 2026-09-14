import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignInButtons } from "@/components/SignInButtons";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold text-white">Productivity OS</h1>
      <p className="max-w-md text-white/60">
        Tasks, calendar, projects and subscriptions in one place — with an AI copilot that
        breaks big ideas into concrete steps and a Reminder Bot that won&apos;t let you forget them.
      </p>
      <SignInButtons />
    </main>
  );
}
