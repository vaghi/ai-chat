import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY not configured" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response from Groq API");
    }

    res.json({
      reply: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({
      error: "Failed to process chat request",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Groq API endpoint: http://localhost:${PORT}/api/chat`);
});
