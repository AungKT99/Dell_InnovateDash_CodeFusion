const axios = require("axios");
require("dotenv").config();

async function generateNaturalResponse(userQuestion, fact) {
  const messages = [
    {
      role: "system",
      content: `
You are a warm, supportive assistant for the Singapore Cancer Society.
Always answer in a friendly, concise, and factual way. Only use the information provided.
If the user is anxious, start with a short word of encouragement.
      `.trim()
    },
    {
      role: "user",
      content: `Q: ${userQuestion}\n\nFact: ${fact}`
    }
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.5,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 8000 // 8 seconds
      }
    );

    let output = response.data.choices[0].message.content.trim();
    output = output.replace(/^here('|')s.*?:/i, '').trim();
    return output;

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return "[Sorry, the reply is taking too long. Please try again.]";
    }
    console.error("OpenAI API error:", error.message);
    return "[Sorry, I couldn't generate a response right now.]";
  }
}

module.exports = generateNaturalResponse;
