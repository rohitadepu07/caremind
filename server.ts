import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Gemini AI Endpoint for Companion / Adaptive insights
app.post('/api/ai/companion', async (req, res) => {
  try {
    const { prompt, context, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are 'Sneh', a warm, loving, and extremely gentle AI cognitive companion for an elderly dementia patient (e.g. Grandma Lakshmi, 72). 
Your tone must be exceptionally comforting, patient, respectful, and encouraging. Never use medical jargon or intimidating language. Always use supportive and uplifting words. 
Language requested: ${language || 'English'}.
Context: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser says/asks: ${prompt}` }] }
      ]
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI response' });
  }
});

// Serve static files in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Application build not found. Please run npm run build.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Sneh server running on port ${PORT}`);
});
