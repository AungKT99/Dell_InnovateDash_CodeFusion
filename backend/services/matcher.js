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
