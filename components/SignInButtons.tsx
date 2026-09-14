"use client";

import { signIn } from "next-auth/react";

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black hover:bg-white/90"
      >
        Continue with Google
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="rounded-lg border border-white/20 px-6 py-2 text-sm font-medium text-white hover:bg-white/5"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
