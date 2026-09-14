import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { db } from "./db";

interface ParsedTask {
  title: string;
}

function parseNumberedList(text: string): ParsedTask[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+[.)]/.test(line))
    .map((line) => ({ title: line.replace(/^\d+[.)]\s*/, "").slice(0, 120) }))
    .filter((t) => t.title.length > 0);
}

export async function generateTaskBreakdown(userId: string, idea: string, projectId?: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.aiClaudeKey && !user?.aiOpenAIKey) {
    throw new Error("No AI keys configured for this user");
  }

  const prompt = `You are a productivity coach. Break this project into concrete, actionable tasks:

"${idea}"

Return a numbered list of 5-10 tasks. One line per task, no descriptions.`;

  let text = "";

  if (user.aiClaudeKey) {
    const anthropic = new Anthropic({ apiKey: user.aiClaudeKey });
    const res = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });
    text = res.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  } else if (user.aiOpenAIKey) {
    const openai = new OpenAI({ apiKey: user.aiOpenAIKey });
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    text = res.choices[0]?.message?.content ?? "";
  }

  const parsed = parseNumberedList(text);
  if (parsed.length === 0) {
    throw new Error("AI response did not contain a parseable task list");
  }

  const tasks = await Promise.all(
    parsed.map((t) =>
      db.task.create({
        data: {
          userId,
          title: t.title,
          list: "AI Breakdown",
          projectId: projectId ?? null,
        },
      })
    )
  );

  return tasks;
}
