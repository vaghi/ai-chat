import { createChat } from "./groq-client.js";

/**
 * Classify whether the prompt needs CV or is a UI command.
 * Returns: { intent: "CV_QUERY" | "UI_COMMAND" | "SMALLTALK" | "OTHER" | "UNCERTAIN", confidence: number }
 */
export async function classifyIntent(userPrompt) {
    const system = `
You are a router. Classify the user's message into one of:
- CV_QUERY: asking about the user's career/CV, experience, projects, companies, skills, dates, education, roles, technologies.
- UI_COMMAND: asking to change theme (light/dark), clear cache, reset chat, export, or other client-side app control (NOT CV-related).
- SMALLTALK: greetings or casual chat (no CV details requested).
- OTHER: anything that doesn't fit above.

If UI_COMMAND, also identify the subAction:
- "theme.toggle" (for light/dark mode switches)
- "cache.clear" (for clearing cache/storage)
- "chat.clear" (for resetting/clearing chat history)
- null (if unclear)

Return a compact JSON: {"intent":"...", "subAction": "..." | null, "confidence":0-1}.
Only output JSON.
`.trim();

  const data = await createChat({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    temperature: 0, // deterministic classifier
    max_tokens: 64,
  });

  const raw = data.choices?.[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw);
    const intent = String(parsed.intent || "UNCERTAIN");
    const subAction = parsed.subAction || null;
    const confidence = Math.max(
      0,
      Math.min(1, Number(parsed.confidence ?? 0.5))
    );
    return { intent, subAction, confidence };
  } catch {
    return { intent: "UNCERTAIN", confidence: 0.5 };
  }
}
