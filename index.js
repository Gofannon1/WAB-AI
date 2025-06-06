const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let schoolInfo = "";
try {
  schoolInfo = fs.readFileSync('school_info.txt', 'utf-8');
  if (schoolInfo.length > 5000) {
    schoolInfo = schoolInfo.slice(-5000); // trim to last 5000 characters
  }
} catch (e) {
  console.error("Failed to load school info:", e);
}

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  const prompt = `${schoolInfo}\n\nUser: ${userMessage}\nAI:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    });

    res.json({ reply: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.json({ reply: "Sorry, something went wrong." });
  }
});

const path = require('path');

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
