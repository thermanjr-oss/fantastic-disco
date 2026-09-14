import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <h1 className="mb-4 text-xl font-semibold text-white">Settings</h1>
      <SettingsForm />
    </NavShell>
  );
}
