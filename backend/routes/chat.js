
const express = require("express");
const router = express.Router();

// 正确路径：
const getBestMatch = require("../services/matcher");
const generateNaturalResponse = require("../services/ollama");

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Missing or empty message." });
  }

  const { topic, fact, confidence } = getBestMatch(message);

  if (topic === "Out of Scope") {
    return res.json({
      reply: "I'm here to help with topics related to cancer awareness and SCS services.",
      topic,
      original_fact: "",
      confidence: Number(confidence.toFixed(4)),
    });
  }

  const ollamaReply = await generateNaturalResponse(fact);

  res.json({
    reply: ollamaReply,
    topic,
    original_fact: fact,
    confidence: Number(confidence.toFixed(4)),
  });
});

module.exports = router;