// server.js - Deciduel Backend with Groq AI
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files

// Groq API configuration (free, fast Llama 3)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ""; // Optional - we'll add fallback
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Personality-specific configurations (token limits and prompts)
const PERSONALITY_CONFIG = {
  logical: {
    tokens: 50,
    prompt: "MAXIMUM 2 sentences. Analytical comparison with facts. Be concise."
  },
  savage: {
    tokens: 35,
    prompt: "MAXIMUM 2 sentences. Roast these options. Funny, brutal, BRIEF."
  },
  zen: {
    tokens: 40,
    prompt: "MAXIMUM 2 sentences. Calm comparison. Help them trust their gut."
  },
  dramatic: {
    tokens: 40,
    prompt: "MAXIMUM 2 sentences. EPIC with CAPS but BRIEF! Theatrical, not lengthy."
  },
  chaotic: {
    tokens: 35,
    prompt: "MAXIMUM 2 sentences. Weird comparison. Brief and wild."
  },
  corporate: {
    tokens: 45,
    prompt: "MAXIMUM 2 sentences. Business jargon. Professional, absurd, BRIEF."
  }
};

// AI commentary endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { optionA, optionB, personality = 'logical' } = req.body;

    // Fallback witty comparisons if no API key
    if (!GROQ_API_KEY) {
      const fallbacks = [
        `${optionA} vs ${optionB}: A classic showdown. Both have their merits, but only one can advance.`,
        `The eternal battle between ${optionA} and ${optionB}. Choose what speaks to your soul.`,
        `${optionA} brings comfort, ${optionB} brings excitement. What do you need right now?`,
        `Tough choice: ${optionA} or ${optionB}? There's no wrong answer, only your answer.`,
        `${optionA} and ${optionB} face off. Trust your gut on this one.`
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({ commentary: randomFallback });
    }

    // Get personality config
    const config = PERSONALITY_CONFIG[personality] || PERSONALITY_CONFIG.logical;

    // Call Groq API
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: config.prompt
          },
          {
            role: "user",
            content: `Compare these two options: "${optionA}" vs "${optionB}"`
          }
        ],
        max_tokens: config.tokens,
        temperature: personality === 'chaotic' ? 1.2 : 0.9
      })
    });

    const data = await response.json();
    let commentary = data.choices?.[0]?.message?.content || "Make your choice!";

    // Hard character limit to prevent overflow (about 1-2 sentences)
    const MAX_CHARS = 100;
    if (commentary.length > MAX_CHARS) {
      // Cut at last complete sentence before limit
      const truncated = commentary.substring(0, MAX_CHARS);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastExclaim = truncated.lastIndexOf('!');
      const lastQuestion = truncated.lastIndexOf('?');
      const lastSentence = Math.max(lastPeriod, lastExclaim, lastQuestion);

      if (lastSentence > 50) {
        commentary = truncated.substring(0, lastSentence + 1);
      } else {
        // No sentence break found, hard cut and add ellipsis
        commentary = truncated.substring(0, MAX_CHARS - 3) + '...';
      }
    }

    res.json({ commentary });

  } catch (err) {
    console.error("AI Error:", err);
    // Return fallback on error
    const { optionA, optionB } = req.body;
    res.json({
      commentary: `${optionA} vs ${optionB}: The choice is yours. What feels right?`
    });
  }
});

const PORT = process.env.PORT || 4000;

// For serverless (Vercel)
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🎮 Deciduel running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}\n`);
    if (!GROQ_API_KEY) {
      console.log("⚠️  No GROQ_API_KEY found - using fallback commentary");
      console.log("   Get free API key at: https://console.groq.com\n");
    }
  });
}
