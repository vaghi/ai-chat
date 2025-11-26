import { Router } from "express";
import { createChat } from "../services/groq-client.js";
import { classifyIntent } from "../services/intent.js";
import { getCvSummary } from "../services/context.js";
import { BASE_PROMPT_DIRECTIONS } from "../consts.js";

const router = Router();

/**
 * POST /api/chat
 * Body: { prompt: string }
 */
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 1) First, determine intent with a tiny/cheap call
    const { intent, subAction, confidence } = await classifyIntent(prompt);

    // Optional: guardrail if classifier is uncertain, you can treat as CV_QUERY:
    const needsCv =
      intent === "CV_QUERY" || (intent === "UNCERTAIN" && confidence < 0.7);

    let reply;
    let usedTwoStage = false;

    if (intent === "UI_COMMAND") {
      // Example: let the frontend handle side-effects based on action payload.
      // We return a friendly text message, while the frontend acts on meta.subAction.
      reply = "Sure, I can help with that.";
    } else if (needsCv) {
      usedTwoStage = true;

      // 2) Ensure a compact CV summary is cached/ready
      const cvSummary = await getCvSummary();

      // 3) Second call with directions + compact summary + user prompt
      const messages = [
        { role: "system", content: `DIRECTIONS:\n${BASE_PROMPT_DIRECTIONS}` },
        {
          role: "system",
          content: `CV_SUMMARY (use only if relevant to answer user's question):\n${cvSummary}`,
        },
        { role: "user", content: `USER PROMPT:\n${prompt}` },
      ];

      const data = await createChat({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      reply = data.choices?.[0]?.message?.content ?? "(No response)";
    } else {
      // SMALLTALK / OTHER → single call, no CV
      const messages = [
        { role: "system", content: `DIRECTIONS:\n${BASE_PROMPT_DIRECTIONS}` },
        { role: "user", content: `USER PROMPT:\n${prompt}` },
      ];

      const data = await createChat({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      reply = data.choices?.[0]?.message?.content ?? "(No response)";
    }

    return res.json({
      reply,
      meta: {
        intent,
        subAction,
        confidence,
        used_two_stage: usedTwoStage,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({
      error: "Failed to process chat request",
      details: err.message,
    });
  }
});

export default router;
