const axios = require('axios');



async function generateNaturalResponse(fact) {
  const prompt = `You're a helpful cancer awareness assistant. Rewrite this fact in a more conversational and kind tone:\n\n${fact}`;
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false
    });
    return response.data?.response?.trim() || "[No response generated]";
  } catch (err) {
    console.error("Ollama connection error:", err.message);
    return "[Failed to connect to Ollama]";
  }
}

module.exports = generateNaturalResponse;