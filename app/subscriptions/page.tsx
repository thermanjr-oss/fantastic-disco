import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavShell } from "@/components/NavShell";
import { SubscriptionTable } from "@/components/SubscriptionTable";

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <NavShell>
      <h1 className="mb-4 text-xl font-semibold text-white">Subscriptions</h1>
      <SubscriptionTable />
    </NavShell>
  );
}
