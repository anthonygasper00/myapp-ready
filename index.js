const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 🟢 Add OpenAI import:
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 Configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // this will come from Render’s env variables
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

//Added
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API endpoint the frontend uses (your original)
app.post('/api/submit_idea', (req, res) => {
  const { idea } = req.body || {};
  // Placeholder behavior: echo back the idea.
  res.json({ received: idea || 'no idea provided' });
});

// 🟢 NEW AI endpoint
app.get('/ai', async (req, res) => {
  const prompt = req.query.prompt || "Tell me about this market.";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful market research assistant." },
        { role: "user", content: prompt }
      ]
    });
    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error contacting OpenAI");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
