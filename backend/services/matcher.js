<<<<<<< Updated upstream
// backend/services/matcher.js

const scs_articles = require("../data/scs_articles");

function getBestMatch(query) {
  const loweredQuery = query.toLowerCase().trim();
  let bestTopic = "Out of Scope";
  let bestFact = "";
  let bestScore = 0;

  for (const [topic, fact] of Object.entries(scs_articles)) {
    const loweredTopic = topic.toLowerCase();
    const topicWords = loweredTopic.split(/\s+/);
    const matchCount = topicWords.filter(word => loweredQuery.includes(word)).length;

    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestTopic = topic;
      bestFact = fact;
    }
  }

  const confidence = bestScore / 3;
  return confidence >= 0.3
    ? { topic: bestTopic, fact: bestFact, confidence }
    : { topic: "Out of Scope", fact: "", confidence: 0 };
}

module.exports = getBestMatch;
=======
const scs_articles = require("../data/scs_articles");

function getBestMatch(query) {
  const lowered = query.toLowerCase().replace(/[^\w\s]/g, ""); // remove punctuation
  let bestTopic = "Out of Scope";
  let bestFact = "";
  let bestScore = 0;

  for (const [topic, fact] of Object.entries(scs_articles)) {
    const topicWords = topic.toLowerCase().split(" ");
    const queryWords = lowered.split(" ");
    let score = topicWords.filter(word => queryWords.includes(word)).length;

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
      bestFact = fact;
    }
  }

  const confidence = bestScore / 5;
  return confidence >= 0.2
    ? { topic: bestTopic, fact: bestFact, confidence }
    : { topic: "Out of Scope", fact: "", confidence: 0 };
}

module.exports = getBestMatch;
>>>>>>> Stashed changes
