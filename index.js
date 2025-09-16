const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API endpoint the frontend uses
app.post('/api/submit_idea', (req, res) => {
  const { idea } = req.body || {};
  // Placeholder behavior: echo back the idea.
  // Replace this block with actual OpenAI calls if/when you add your API key and logic.
  res.json({ received: idea || 'no idea provided' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
