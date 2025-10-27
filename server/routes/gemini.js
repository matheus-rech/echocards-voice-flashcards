import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { apiLimiter, strictLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Validate API key is configured
const validateApiKey = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Gemini API key is not configured on the server'
    });
  }
  next();
};

// Apply API key validation to all routes
router.use(validateApiKey);

/**
 * POST /api/gemini/generate-content
 * Proxy for Gemini generateContent API (TTS, explanations, analysis)
 * Body: { model, contents, config }
 */
router.post('/generate-content', apiLimiter, asyncHandler(async (req, res) => {
  const { model, contents, config } = req.body;

  if (!model || !contents) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'model and contents are required'
    });
  }

  // Make request to Gemini API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({ contents, generationConfig: config })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API error:', errorData);
    return res.status(response.status).json({
      error: 'Gemini API error',
      message: errorData.error?.message || 'Failed to generate content',
      details: errorData
    });
  }

  const data = await response.json();
  res.json(data);
}));

/**
 * POST /api/gemini/generate-image
 * Proxy for Imagen API (image generation)
 * Body: { prompt, config }
 */
router.post('/generate-image', strictLimiter, asyncHandler(async (req, res) => {
  const { prompt, config } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'prompt is required'
    });
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImages';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      prompt,
      numberOfImages: config?.numberOfImages || 1,
      aspectRatio: config?.aspectRatio || '1:1'
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Imagen API error:', errorData);
    return res.status(response.status).json({
      error: 'Imagen API error',
      message: errorData.error?.message || 'Failed to generate image',
      details: errorData
    });
  }

  const data = await response.json();
  res.json(data);
}));

/**
 * POST /api/gemini/tts
 * Dedicated endpoint for Text-to-Speech
 * Body: { text, voiceName }
 */
router.post('/tts', apiLimiter, asyncHandler(async (req, res) => {
  const { text, voiceName } = req.body;

  if (!text) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'text is required'
    });
  }

  const model = 'gemini-2.5-flash-preview-tts';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Zephyr'
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('TTS API error:', errorData);
    return res.status(response.status).json({
      error: 'TTS API error',
      message: errorData.error?.message || 'Failed to generate speech',
      details: errorData
    });
  }

  const data = await response.json();

  // Extract audio data from response
  const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioData) {
    return res.status(500).json({
      error: 'TTS error',
      message: 'No audio data in response'
    });
  }

  res.json({ audioData });
}));

/**
 * POST /api/gemini/deck-generation
 * Dedicated endpoint for AI deck generation (stricter rate limit)
 * Body: { topic, depth, numberOfCards } OR { deckName, documentText }
 */
router.post('/deck-generation', strictLimiter, asyncHandler(async (req, res) => {
  const { topic, depth, numberOfCards, deckName, documentText } = req.body;

  let prompt;
  if (topic && depth && numberOfCards) {
    // Form-based generation
    prompt = `Generate ${numberOfCards} flashcards for the topic "${topic}" at a "${depth}" level of complexity. Each card must have a clear question, a concise answer, and a brief, helpful explanation for context.`;
  } else if (deckName && documentText) {
    // Document-based generation
    prompt = `Analyze the following document text and generate a comprehensive deck of flashcards named "${deckName}". Identify the key concepts, definitions, and facts. For each, create a card with a clear question, a concise answer, and a brief, helpful explanation.\n\nDocument Text:\n---\n${documentText}\n---`;
  } else {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Either (topic, depth, numberOfCards) or (deckName, documentText) are required'
    });
  }

  const model = 'gemini-2.5-pro';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              answer: { type: 'STRING' },
              explanation: { type: 'STRING' }
            },
            required: ['question', 'answer', 'explanation']
          }
        }
      },
      safetySettings: [{
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE'
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Deck generation API error:', errorData);
    return res.status(response.status).json({
      error: 'Deck generation error',
      message: errorData.error?.message || 'Failed to generate deck',
      details: errorData
    });
  }

  const data = await response.json();

  // Extract and parse the generated cards
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    return res.status(500).json({
      error: 'Generation error',
      message: 'No content in response'
    });
  }

  try {
    const cards = JSON.parse(textContent.trim());
    res.json({ cards });
  } catch (parseError) {
    console.error('Failed to parse generated cards:', parseError);
    return res.status(500).json({
      error: 'Parse error',
      message: 'Failed to parse generated cards'
    });
  }
}));

/**
 * GET /api/gemini/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const isConfigured = process.env.GEMINI_API_KEY &&
                       process.env.GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY';

  res.json({
    status: 'ok',
    apiKeyConfigured: isConfigured,
    timestamp: new Date().toISOString()
  });
});

export default router;
