const scs_articles = require("../data/scs_articles");

function getBestMatch(query) {
  const lowered = query.toLowerCase().replace(/[^\w\s]/g, "");
  const queryWords = lowered.split(" ");

  const scoredTopics = [];

  for (const [topic, fact] of Object.entries(scs_articles)) {
    const topicWords = topic.toLowerCase().split(" ");
    const factWords = fact.toLowerCase().split(/\W+/);

    // Match overlap in topic title and fact body
    const matchInTitle = topicWords.filter(word => queryWords.includes(word)).length;
    const matchInBody = factWords.filter(word => queryWords.includes(word)).length;

    const totalScore = matchInTitle * 2 + matchInBody * 0.5; // weighted scoring

    if (totalScore > 0) {
      scoredTopics.push({ topic, fact, score: totalScore });
    }
  }

  // Sort by descending score
  scoredTopics.sort((a, b) => b.score - a.score);

  if (scoredTopics.length === 0 || scoredTopics[0].score < 1) {
    return {
      topics: ["Out of Scope"],
      facts: [],
      confidence: 0
    };
  }

  // Select top 1–3 matches with similar scores
  const topScore = scoredTopics[0].score;
  const selected = scoredTopics.filter(t => t.score >= topScore - 1).slice(0, 3);

  const combinedFacts = selected.map(t => t.fact).join("\n\n");
  const combinedTopics = selected.map(t => t.topic);
  const averageConfidence = selected.reduce((sum, t) => sum + t.score, 0) / (5 * selected.length);

  return {
    topics: combinedTopics,
    facts: [combinedFacts],
    confidence: Number(averageConfidence.toFixed(4))
  };
}

module.exports = getBestMatch;



