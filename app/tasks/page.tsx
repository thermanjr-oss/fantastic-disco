import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { TaskList } from "@/components/TaskList";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <h1 className="mb-4 text-xl font-semibold text-white">All tasks</h1>
      <TaskList />
    </NavShell>
  );
}
