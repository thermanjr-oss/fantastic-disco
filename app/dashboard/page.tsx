import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { FocusMode } from "@/components/FocusMode";
import { TaskList } from "@/components/TaskList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <div className="space-y-8">
        <FocusMode />
        <section>
          <h2 className="mb-3 text-lg font-semibold text-white">Inbox</h2>
          <TaskList list="Inbox" />
        </section>
      </div>
    </NavShell>
  );
}
