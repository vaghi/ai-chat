import fetch from "node-fetch";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_HEADERS = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
});

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY not set — requests will fail.");
}

export async function createChat(
  body,
  { retries = 1, timeoutMs = 30000 } = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(GROQ_URL, {
      method: "POST",
      headers: DEFAULT_HEADERS(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Groq API ${resp.status} ${resp.statusText}: ${text}`);
    }

    return await resp.json();
  } catch (err) {
    if (retries > 0) {
      return await createChat(body, { retries: retries - 1, timeoutMs });
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
