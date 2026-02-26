# BotanistAI 🌿

AI-powered plant health diagnosis. Upload a photo of your plant to identify it, diagnose health issues, and get expert care instructions.

**No account or API key required to try it out** — the app runs in demo mode by default.

---

## Quick Start

**Prerequisites:** Node.js v18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app loads instantly in **Demo Mode**, returning sample plant analyses so you can explore the full UI right away.

---

## Enable Real AI Analysis (Optional)

To use a real LLM for analysis, create a `.env.local` file in the project root:

```bash
AI_PROVIDER=openai        # openai | google | anthropic
AI_API_KEY=your-key-here  # API key for the chosen provider
AI_MODEL=gpt-4o           # optional — sensible defaults are used if omitted
```

Then restart the dev server (`npm run dev`). The Demo Mode banner will disappear and all plant analyses will use your chosen model.

### Provider Setup

| Provider | `AI_PROVIDER` | Get an API Key | Default Model |
|---|---|---|---|
| OpenAI | `openai` | [platform.openai.com](https://platform.openai.com/api-keys) | `gpt-4o` |
| Google Gemini | `google` | [aistudio.google.com](https://aistudio.google.com/apikey) | `gemini-2.5-flash` |
| Anthropic Claude | `anthropic` | [console.anthropic.com](https://console.anthropic.com/settings/keys) | `claude-sonnet-4-20250514` |

You can override the model by setting `AI_MODEL` to any vision-capable model your provider supports.

---

## Tech Stack

- React 19 + TypeScript
- Vite
- [Vercel AI SDK](https://ai-sdk.dev) — unified interface for OpenAI, Google, and Anthropic
- Tailwind CSS
- Recharts (health score visualization)
- Lucide React (icons)
