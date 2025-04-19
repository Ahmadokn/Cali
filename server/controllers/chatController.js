// server/controllers/chatController.js
const OpenAI = require("openai");
// Initialize OpenAI client with your key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat
async function chat(req, res) {
  try {
    // Debug logs for AI chat integration
    console.log("OpenAI API Key set:", Boolean(process.env.OPENAI_API_KEY));
    console.log("Incoming chat messages:", req.body.messages);
    // Expect an array of message objects in req.body.messages
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });
    // Send back the assistant’s reply
    res.json({ message: completion.choices[0].message });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "AI service error" });
  }
}

module.exports = { chat };