const express = require("express");
const router = express.Router();

// Updated imports
const getBestMatch = require("../services/matcher"); // enhanced matcher with multi-topic support
const generateNaturalResponse = require("../services/openai"); // switched from ollama to openai

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Chat endpoint
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Missing or empty message." });
  }

  //  Match best articles
  const { topics, facts, confidence } = getBestMatch(message);

  // Out-of-scope handling
  if (topics.includes("Out of Scope")) {
    return res.json({
      reply: "I'm here to help with topics related to cancer awareness and SCS services.",
      topic: "Out of Scope",
      original_fact: "",
      confidence
    });
  }

  // Generate response with OpenAI
  const combinedFact = facts[0]; // facts is an array with 1 combined string
  const openaiReply = await generateNaturalResponse(message, combinedFact);

  res.json({
    reply: openaiReply,
    topic: topics.join(", "),
    original_fact: combinedFact,
    confidence
  });
});

module.exports = router;
