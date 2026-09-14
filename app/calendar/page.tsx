import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { CalendarPageClient } from "@/components/CalendarPageClient";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <CalendarPageClient />
    </NavShell>
  );
}
