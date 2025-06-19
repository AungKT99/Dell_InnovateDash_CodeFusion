const axios = require("axios");
require("dotenv").config();

async function generateNaturalResponse(userQuestion, fact) {
  const messages = [
    {
      role: "system",
      content: `
You are a warm, helpful assistant for the Singapore Cancer Society.
Your role is to clearly and kindly explain information about cancer and screening to the general public.
Always stay on-topic. Be especially supportive and reassuring if the user's question shows fear, doubt, or confusion.
Never make up new information — only use what's provided.
      `.trim()
    },
    {
      role: "user",
      content: `
Question: ${userQuestion}

Here is some background info you can use:
${fact}
      `.trim()
    }
  ];

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.6
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const output = response.data.choices[0].message.content.trim();
    return output;

  } catch (error) {
    console.error("OpenAI API error:", error.message);
    return "[Sorry, I couldn't generate a response right now.]";
  }
}

module.exports = generateNaturalResponse;

