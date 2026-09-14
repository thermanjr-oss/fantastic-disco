"use client";

import { useEffect, useState } from "react";
import type { Subscription } from "@/types";

export function SubscriptionTable() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [form, setForm] = useState({ serviceName: "", cost: "", renewalDate: "" });

  const load = async () => {
    const res = await fetch("/api/subscriptions");
    if (res.ok) setSubs(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const addSub = async () => {
    if (!form.serviceName.trim()) return;
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceName: form.serviceName,
        cost: form.cost ? Number(form.cost) : null,
        renewalDate: form.renewalDate || null,
      }),
    });
    if (res.ok) {
      setForm({ serviceName: "", cost: "", renewalDate: "" });
      await load();
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  const totalMonthly = subs.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={form.serviceName}
          onChange={(e) => setForm((f) => ({ ...f, serviceName: e.target.value }))}
          placeholder="Service (e.g. ChatGPT Plus)"
          className="rounded-md border border-white/10 bg-surface px-2 py-1 text-sm text-white placeholder:text-white/40"
        />
        <input
          value={form.cost}
          onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
          placeholder="Cost / mo"
          type="number"
          className="w-28 rounded-md border border-white/10 bg-surface px-2 py-1 text-sm text-white placeholder:text-white/40"
        />
        <input
          value={form.renewalDate}
          onChange={(e) => setForm((f) => ({ ...f, renewalDate: e.target.value }))}
          type="date"
          className="rounded-md border border-white/10 bg-surface px-2 py-1 text-sm text-white"
        />
        <button
          onClick={addSub}
          className="rounded-md bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent/80"
        >
          Add
        </button>
      </div>

      <table className="w-full text-left text-sm text-white">
        <thead className="text-xs uppercase text-white/40">
          <tr>
            <th className="py-2">Service</th>
            <th className="py-2">Cost / mo</th>
            <th className="py-2">Renews</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.id} className="border-t border-white/10">
              <td className="py-2">{s.serviceName}</td>
              <td className="py-2">{s.cost != null ? `$${s.cost.toFixed(2)}` : "—"}</td>
              <td className="py-2">
                {s.renewalDate ? new Date(s.renewalDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-2 text-right">
                <button onClick={() => remove(s.id)} className="text-xs text-white/40 hover:text-red-400">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-white/50">Total: ${totalMonthly.toFixed(2)} / month</p>
    </div>
  );
}
