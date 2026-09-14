"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function SettingsForm() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const [hasClaudeKey, setHasClaudeKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setHasOpenAIKey(data.hasOpenAIKey);
        setHasClaudeKey(data.hasClaudeKey);
      }
    })();
  }, []);

  const save = async () => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiOpenAIKey: openAIKey, aiClaudeKey: claudeKey }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const enablePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    setPushEnabled(true);
  };

  return (
    <div className="max-w-md space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-white">AI keys</h2>
        <p className="mb-3 text-xs text-white/50">
          Bring your own key to use "Break it down" on projects. Claude is preferred when both are set.
        </p>
        <div className="space-y-2">
          <input
            type="password"
            value={claudeKey}
            onChange={(e) => setClaudeKey(e.target.value)}
            placeholder={hasClaudeKey ? "Anthropic key saved — enter to replace" : "Anthropic API key"}
            className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
          <input
            type="password"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            placeholder={hasOpenAIKey ? "OpenAI key saved — enter to replace" : "OpenAI API key"}
            className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
          <button
            onClick={save}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80"
          >
            {saved ? "Saved!" : "Save keys"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-white">Notifications</h2>
        <button
          onClick={enablePush}
          disabled={pushEnabled}
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
        >
          {pushEnabled ? "Push enabled" : "Enable push notifications"}
        </button>
      </section>
    </div>
  );
}
