"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import { ReminderBot } from "./ReminderBot";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/calendar", label: "Calendar" },
  { href: "/projects", label: "Projects" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/settings", label: "Settings" },
];

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-1 border-b border-white/10 px-4 py-3">
        <span className="mr-4 text-sm font-bold text-white">Productivity OS</span>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm ${
              pathname === link.href ? "bg-accent text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="ml-auto text-sm text-white/40 hover:text-white"
        >
          Sign out
        </button>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <ReminderBot />
    </div>
  );
}
