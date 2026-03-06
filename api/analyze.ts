import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const PlantAnalysisSchema = z.object({
  plantName: z.string().describe('Common name of the plant'),
  scientificName: z.string().describe('Scientific Latin name'),
  healthStatus: z
    .enum(['Healthy', 'Needs Attention', 'Critical', 'Unknown'])
    .describe('General health condition category'),
  healthScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 representing health (100 is perfect)'),
  diagnosis: z.string().describe('A concise 1-sentence diagnosis'),
  detailedDescription: z
    .string()
    .describe(
      'A detailed paragraph explaining the condition, visible symptoms, and potential causes.',
    ),
  careInstructions: z
    .array(z.string())
    .describe('Step-by-step actionable advice to fix the issue or maintain health.'),
  preventativeMeasures: z
    .array(z.string())
    .describe('Tips to prevent this issue from recurring.'),
});

const SYSTEM_PROMPT = `You are an expert botanist and plant pathologist.
Analyze the provided image of a plant.
Identify the plant, diagnose its health, and provide actionable care instructions.
Be encouraging but realistic. If you cannot identify the plant or the image does not show a plant, set healthStatus to "Unknown" and explain in the diagnosis field.`;

type Provider = 'groq' | 'google' | 'anthropic' | 'openai';

interface RequestBody {
  image: string;
  provider?: Provider;
  apiKey?: string;
  model?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { image, provider = 'groq', apiKey, model } = req.body as RequestBody;

  if (!image) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing image in request body' }));
    return;
  }

  // Ensure the image has a data URL prefix — the AI SDK uses it to detect MIME type
  const imageDataUrl = image.startsWith('data:')
    ? image
    : `data:image/jpeg;base64,${image}`;

  try {
    let aiModel: any;

    if (provider === 'groq') {
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Server is not configured with a Groq API key.' }));
        return;
      }
      const groq = createGroq({ apiKey: groqKey });
      aiModel = groq(model ?? 'meta-llama/llama-4-scout-17b-16e-instruct');
    } else if (provider === 'google') {
      if (!apiKey) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API key required for Google provider' }));
        return;
      }
      const google = createGoogleGenerativeAI({ apiKey });
      aiModel = google(model ?? 'gemini-2.5-flash');
    } else if (provider === 'anthropic') {
      if (!apiKey) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API key required for Anthropic provider' }));
        return;
      }
      const anthropic = createAnthropic({ apiKey });
      aiModel = anthropic(model ?? 'claude-sonnet-4-20250514');
    } else if (provider === 'openai') {
      if (!apiKey) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API key required for OpenAI provider' }));
        return;
      }
      const openai = createOpenAI({ apiKey });
      aiModel = openai(model ?? 'gpt-4o');
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Unknown provider: ${provider}` }));
      return;
    }

    const { object } = await generateObject({
      model: aiModel,
      schema: PlantAnalysisSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: imageDataUrl,
            },
            {
              type: 'text',
              text: SYSTEM_PROMPT,
            },
          ],
        },
      ],
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(object));
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error?.message ?? 'Failed to analyze image. Please try again.' }));
  }
}
