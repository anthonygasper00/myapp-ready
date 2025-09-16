const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Updated API endpoint — uses OpenAI for POST submit_idea
app.post('/api/submit_idea', async (req, res) => {
  const { idea } = req.body || {};
  if (!idea) {
    return res.status(400).json({ error: 'No idea provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful market research assistant. Analyze the given idea and describe its market potential."
        },
        { role: "user", content: idea }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error contacting OpenAI" });
  }
});

// 🟢 Updated GET /ai endpoint with sample listings
app.get('/ai', async (req, res) => {
  const prompt = req.query.prompt || "Tell me about this market.";
  try {
    // Ask OpenAI for a text description:
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful market research assistant." },
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.choices[0].message.content;

    // Temporary sample listings — replace with real data later
    const listings = [
      {
        title: "Sample Item 1",
        price: "$99",
        image: "https://via.placeholder.com/150",
        url: "https://example.com/item1"
      },
      {
        title: "Sample Item 2",
        price: "$199",
        image: "https://via.placeholder.com/150",
        url: "https://example.com/item2"
      },
      {
        title: "Sample Item 3",
        price: "$299",
        image: "https://via.placeholder.com/150",
        url: "https://example.com/item3"
      }
    ];

    // Send back text + listings
    res.json({
      reply,
      listings
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error contacting OpenAI");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
