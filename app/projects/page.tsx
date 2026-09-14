import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { ProjectBoard } from "@/components/ProjectBoard";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <h1 className="mb-4 text-xl font-semibold text-white">Projects</h1>
      <ProjectBoard />
    </NavShell>
  );
}
