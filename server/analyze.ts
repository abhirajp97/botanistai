import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const plantAnalysisSchema = z.object({
  plantName: z.string().describe("Common name of the plant"),
  scientificName: z.string().describe("Scientific Latin name"),
  healthStatus: z.enum(["Healthy", "Needs Attention", "Critical", "Unknown"])
    .describe("General health condition category"),
  healthScore: z.number().int().min(0).max(100)
    .describe("A score from 0 to 100 representing health (100 is perfect)"),
  diagnosis: z.string().describe("A concise 1-sentence diagnosis"),
  detailedDescription: z.string()
    .describe("A detailed paragraph explaining the condition, visible symptoms, and potential causes."),
  careInstructions: z.array(z.string())
    .describe("Step-by-step actionable advice to fix the issue or maintain health."),
  preventativeMeasures: z.array(z.string())
    .describe("Tips to prevent this issue from recurring."),
});

const SYSTEM_PROMPT = `You are an expert botanist and plant pathologist.
Analyze the provided image of a plant.
Identify the plant, diagnose its health, and provide actionable care instructions.
Be encouraging but realistic.`;

const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  google: 'gemini-2.5-flash',
  anthropic: 'claude-sonnet-4-20250514',
};

function getModel(provider: string, apiKey: string, modelId?: string) {
  const model = modelId || DEFAULT_MODELS[provider];
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })(model);
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(model);
    case 'anthropic':
      return createAnthropic({ apiKey })(model);
    default:
      throw new Error(`Unknown AI provider: "${provider}". Use openai, google, or anthropic.`);
  }
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

export function analyzePlugin(env: Record<string, string>): Plugin {
  const provider = env.AI_PROVIDER;
  const apiKey = env.AI_API_KEY;
  const modelId = env.AI_MODEL;

  return {
    name: 'botanist-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/analyze', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        if (!provider || !apiKey) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'AI provider not configured. Set AI_PROVIDER and AI_API_KEY in .env.local' }));
          return;
        }

        try {
          const { image } = await parseBody(req);
          if (!image) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing "image" field in request body' }));
            return;
          }

          const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

          const model = getModel(provider, apiKey, modelId);
          const { object } = await generateObject({
            model,
            schema: plantAnalysisSchema,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'image', image: Buffer.from(cleanBase64, 'base64') },
                  { type: 'text', text: SYSTEM_PROMPT },
                ],
              },
            ],
            temperature: 0.4,
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(object));
        } catch (err: any) {
          console.error('Analysis error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Analysis failed' }));
        }
      });
    },
  };
}
