const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Updated imports
const getBestMatch = require("../services/matcher");
const generateNaturalResponse = require("../services/openai");
const { getUserProfileForChat, generatePersonalizedRecommendations } = require("../services/userProfileBuilder");

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Optional auth middleware for chat
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const User = require('../models/User');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Chat endpoint with optional authentication
router.post("/", optionalAuth, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Missing or empty message." });
  }

  try {
    // Get user profile if authenticated
    let userProfile = null;
    let personalizedRecommendations = [];
    
    if (req.user) {
      console.log('User authenticated:', req.user._id);
      userProfile = await getUserProfileForChat(req.user._id);
      console.log('User profile:', userProfile);
      
      if (userProfile) {
        personalizedRecommendations = generatePersonalizedRecommendations(userProfile);
      }
    } else {
      console.log('No user authentication found');
    }

    // Match best articles with user context
    const { topics, facts, confidence } = getBestMatch(message, userProfile);

    // Out-of-scope handling
    if (topics.includes("Out of Scope")) {
      return res.json({
        reply: "I'm here to help with topics related to cancer awareness and SCS services.",
        topic: "Out of Scope",
        original_fact: "",
        confidence,
        personalized: false
      });
    }

    // Generate personalized response with OpenAI
    const combinedFact = facts[0];
    const openaiReply = await generateNaturalResponse(message, combinedFact, userProfile);

    res.json({
      reply: openaiReply,
      topic: topics.join(", "),
      original_fact: combinedFact,
      confidence,
      personalized: !!userProfile,
      recommendations: personalizedRecommendations
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: "Sorry, I'm having trouble processing your request right now."
    });
  }
});

module.exports = router;
