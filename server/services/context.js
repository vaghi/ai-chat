import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createChat } from "./groq-client.js";

// Load the raw CV (JSON text) once from curriculum.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const curriculumPath = path.join(__dirname, "..", "curriculum.json");

let curriculumText = "";
try {
  curriculumText = fs.readFileSync(curriculumPath, "utf-8");
  console.log(`📄 Loaded curriculum.json (${curriculumText.length} chars)`);
} catch (e) {
  console.error("Failed to load curriculum.json:", e);
}

// Cache for the compact summary (memory + optional disk)
let cachedSummary = null;
let cachedAt = 0;
// TTL for summary (ms). Adjust to your update frequency (e.g., 24h).
const SUMMARY_TTL = 24 * 60 * 60 * 1000;
const summaryCacheFile = path.join(__dirname, "..", ".cache_cv_summary.txt");

/**
 * Create or load a compact CV summary for repeated use.
 * Strategy:
 * - Summarize once (first time requested or after TTL)
 * - Store to memory and disk (.cache_cv_summary.txt)
 * - Use the summary in the second call whenever CV context is required
 */
export async function getCvSummary() {
  const now = Date.now();

  // 1) Return memory cache if fresh
  if (cachedSummary && now - cachedAt < SUMMARY_TTL) {
    return cachedSummary;
  }

  // 2) Try disk cache if exists and fresh
  try {
    const stats = fs.statSync(summaryCacheFile);
    if (now - stats.mtimeMs < SUMMARY_TTL) {
      const disk = fs.readFileSync(summaryCacheFile, "utf-8");
      if (disk && disk.length > 0) {
        cachedSummary = disk;
        cachedAt = now;
        return cachedSummary;
      }
    }
  } catch {
    // ignore
  }

  // 3) If no cache or expired, generate a concise summary via LLM (first-stage)
  //    Keep token budget small; we don't need every detail for retrieval-quality answers.
  const system = `
Summarize the following CV JSON into a compact, information-dense brief suitable for answering questions about roles, companies, dates, responsibilities, stack, and achievements.

Output constraints:
- 700–1000 tokens max.
- Prefer bullet points grouped by Company/Role with dates and 1–3 key achievements each.
- Include a short “Skills/Stack” consolidation at the end.
- NO PII beyond what is already present.
`.trim();

  const data = await createChat({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: system },
      { role: "user", content: curriculumText || "(CV missing)" },
    ],
    temperature: 0.2,
    max_tokens: 1200,
  });

  const summary =
    data.choices?.[0]?.message?.content ?? "(summary unavailable)";

  // 4) Update caches
  cachedSummary = summary;
  cachedAt = now;
  try {
    fs.writeFileSync(summaryCacheFile, summary, "utf-8");
  } catch (e) {
    console.warn("Could not persist CV summary to disk cache:", e.message);
  }

  return cachedSummary;
}
