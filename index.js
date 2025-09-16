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
  apiKey: process.env.OPENAI_API_KEY // from Render env variables
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 🟢 UPDATED AI endpoint – use POST /api/submit_idea
app.post('/api/submit_idea', async (req, res) => {
  const { idea } = req.body || {};
  if (!idea) {
    return res.status(400).json({ error: 'No idea provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful market research assistant. Provide the market overview, trends, and potential competitors for a given idea." },
        { role: "user", content: `Analyze this idea: ${idea}` }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ analysis: reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
