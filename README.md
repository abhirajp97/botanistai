<div align="center">

# 🌿 BotanistAI

**Snap a photo of your plant. Get an instant AI diagnosis.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Made with Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-black.svg?logo=vercel)](#)

[Live Demo](https://botanistai.vercel.app) · [Read the Story](https://half-baked-website.vercel.app/blog/botanistai.html) · [Half-Baked](https://github.com/abhirajp97/half-baked-website)

</div>

---

## Try It Out

**→ [botanistai.vercel.app](https://botanistai.vercel.app)**

No sign-up. No API key. Open it, upload a plant photo, get an AI diagnosis in ~3 seconds. Works on mobile too — take a photo directly from the camera.

Want to use a different model? Hit the **⚙️ gear icon** in the header and paste in your own Gemini, Claude, or GPT-4o key.

---

## The Idea

Point your camera at a plant, get back: what it is, how healthy it is (scored 0–100), what's wrong, and exactly what to do about it.

No account. No subscription. Works out of the box with a free Groq API key as the server-side default — users can also bring their own Gemini, Claude, or GPT-4o key via the UI.

---

## Quick Start

**Prerequisites:** Node.js 18+ and a [Groq API key](https://console.groq.com) (free)

```bash
git clone https://github.com/abhirajp97/botanistai.git
cd botanistai
npm install

# Create .env.local with your Groq key
echo "GROQ_API_KEY=your_key_here" > .env.local

# Start Vite frontend + Vercel serverless functions together
vercel dev
```

Open [http://localhost:3000](http://localhost:3000) — upload a plant photo and get an instant analysis.

> **Why `vercel dev` instead of `npm run dev`?** The app routes image analysis through a Vercel serverless function (`api/analyze.ts`). `vercel dev` runs both the Vite frontend and the API function locally. `npm run dev` runs only the frontend, so the `/api/analyze` call will fail.

---

## Architecture

All AI calls happen server-side — no API keys are exposed to the browser.

```
Browser → POST /api/analyze { image, provider, apiKey? }
                    ↓
         api/analyze.ts (Vercel serverless function)
                    ↓
         Vercel AI SDK → Groq (default) / Gemini / Claude / GPT-4o
                    ↓
         PlantAnalysis JSON → Browser
```

The frontend sends a base64-encoded image. The server picks a provider, calls the AI, and returns a typed `PlantAnalysis` object validated by a Zod schema.

---

## Multi-Model Support

The **⚙️ gear icon** in the header opens a model selector:

| Provider | Model | Cost |
|----------|-------|------|
| **Groq (default)** | Llama 4 Scout | Free tier |
| Google | Gemini 2.5 Flash | Bring your own key |
| Anthropic | Claude Sonnet | Bring your own key |
| OpenAI | GPT-4o | Bring your own key |

For the default Groq model, only the server needs a key (`GROQ_API_KEY`). For other providers, users paste their own key in the UI — it's sent to the server per-request and never stored.

---

## How It Works

1. **ImageUploader** captures a photo or file and converts it to a base64 data URL
2. **App.tsx** POSTs it to `/api/analyze` with the chosen `provider` and optional `apiKey`
3. **api/analyze.ts** selects the right provider via the Vercel AI SDK and calls `generateObject` with a Zod schema
4. The AI returns structured JSON matching `PlantAnalysis` — plant name, health score, diagnosis, care instructions
5. **AnalysisResult** renders the result with a recharts health gauge

---

## What's "Half-Baked" About It?

### What works ✅
- Plant identification (common + scientific name)
- Health score (0–100) with visual gauge
- Specific care instructions (not generic advice)
- Scan history in localStorage (last 10 scans)
- Multi-provider model switching in the UI

### What's left to build 🚧
- Cloud sync / user accounts — history is localStorage-only
- Reminders — tells you to water in 3 days, won't remind you
- Progress tracking — no way to compare scans over time
- Expert verification — AI can be wrong, no confidence scoring

---

## Ideas for Extending This

### Make it a real product
- Add auth (Supabase, Firebase)
- Cloud storage for scan history
- Push notification reminders

### Make it smarter
- Fine-tune on plant disease datasets
- Multi-image health trend tracking
- Confidence scoring per diagnosis

### Make it B2B
- Nursery / greenhouse inventory
- Agricultural pest detection at scale

---

## Tech Stack

| Tech | Why |
|------|-----|
| React 19 + Vite | Fast dev, lightweight bundle |
| TypeScript | Type-safe PlantAnalysis across frontend and backend |
| [Vercel AI SDK](https://ai-sdk.dev) | Unified interface for Groq/Gemini/Anthropic/OpenAI |
| Zod | Schema validation for AI-generated JSON |
| Tailwind CSS (CDN) | Quick styling, no build step |
| Recharts | Health score radial gauge |
| Lucide React | Icons |

---

## Deploying Your Own

1. Fork this repo
2. Connect to Vercel (`vercel` CLI or [vercel.com/new](https://vercel.com/new))
3. Add `GROQ_API_KEY` to your Vercel project's Environment Variables (Project → Settings → Environment Variables)
4. Deploy — the public demo will work immediately with Llama 4 via Groq's free tier

---

## License

MIT — do whatever you want with it.

---

## Credits

Built as part of [Half-Baked](https://github.com/abhirajp97/half-baked-website), a weekly series of open-source prototypes by [Abhiraj Parikh](https://github.com/abhirajp97).
