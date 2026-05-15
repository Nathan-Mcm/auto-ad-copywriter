require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3001;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());

app.post('/api/messages', async (req, res) => {
  const { model, max_tokens, messages, system } = req.body;

  try {
    const response = await client.messages.create({
      model: model || 'claude-opus-4-7',
      max_tokens: max_tokens || 1024,
      ...(system && { system }),
      messages,
    });
    res.json(response);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API proxy server running on http://localhost:${PORT}`);
});
