# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server (also serves /api/analyze locally)
npm run build        # production build
npm run lint         # ESLint
npm test             # run all unit tests (vitest run)
npm run convert:districts  # regenerate districts.json + metricQuestions.json from Excel
npm run fill:coords  # fill missing lat/lng in districts.json via geocoding script
```

Run a single test file:
```bash
npx vitest run src/utils/scoring.test.js
```

## Local AI Setup

Copy `.env.example` to `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

The Vite dev server intercepts `POST /api/analyze` via `vite-groq-api-plugin.js` and routes it to the same handler used in production, so no separate backend process is needed.

## Architecture

### Routing

`App.jsx` implements a minimal manual router using `window.history.pushState` — there is no React Router. Two routes exist: `/` (home) renders `IdealDistrictWizard`, and `/veri` or `/metodoloji` renders `MethodologyPage`. Vercel is configured (`vercel.json`) to rewrite all non-`/api/` paths to `index.html`.

### Wizard Flow (`src/pages/IdealDistrictWizard.jsx`)

The core page orchestrates a 4-step wizard: `start → region → questions → results`. State (step, answers, selectedRegions, currentQuestionIndex) is persisted to `sessionStorage` on every results view and encoded into the URL as a base64 `?s=` param for sharing. On load, URL state takes priority over sessionStorage.

### Scoring (`src/utils/scoring.js`)

Districts are ranked by a weighted average of metric scores. Each metric has a score column (e.g. `social_culture_score_20`) holding a value 0–20 in `districts.json`. The user's answer (1–5) for each question is used as its weight. The final `user_score_100` is `(Σ score_i × weight_i / Σ weight_i) × 5`. Region filtering is done before scoring; if fewer than 5 districts remain after filtering, the filter is progressively relaxed.

### Questions Config

Questions are driven by `src/data/metricQuestions.json`, which is generated from the `metric_config` sheet in the Excel file by `npm run convert:districts`. If that JSON is empty, `FALLBACK_QUESTIONS` hardcoded in `IdealDistrictWizard.jsx` is used instead. Icons are bound to question keys in `ICON_BY_KEY` within the wizard — when adding a new metric, a matching icon entry is required there.

### District Data

`src/data/districts.json` is generated from `src/data/ideal_ilce_genisletilmis.son.xlsx` (sheet: `districts_app`) via `scripts/convertDistrictExcelToJson.js`. The JSON wraps a `districts` array with `generatedAt` and `rowCount` metadata. Numeric columns are coerced; all others remain strings.

### AI Integration

- **Frontend** (`src/services/aiService.js`): calls `POST /api/analyze` with a `prompt` string and optional `cacheKey`. Never touches `GROQ_API_KEY`.
- **Backend** (`api/analyze.js` → `api/lib/handleAnalyze.js`): Vercel serverless function. Uses `llama-3.1-8b-instant` via Groq. Has in-memory insight cache (keyed by `cacheKey`) and in-memory rate limiter (20 req/60s per IP). The rate limiter resets between cold starts in production.
- **Security**: Vite loads only `GROQ_*`-prefixed env vars server-side; they are never injected into the client bundle.

### Prompt Construction (`src/utils/aiPrompt.js`)

Two prompt builders exist: `buildInsightPrompt` (one-shot analysis on the results screen) and `buildChatSystemPrompt` (ongoing chat panel). Both receive the user's profile, answers, question list, and recommended districts, and produce Turkish-language prompts instructing the model to avoid markdown and algorithm jargon.

### Lazy-Loaded Components

`DistrictMap`, `AIInsightCard`, `AIChatPanel`, and `ComparisonModal` are all `React.lazy`-loaded inside `ResultScreen` to keep the initial bundle small.

### Persistence

- `sessionStorage` (`ilceradar_wizard_v1`): wizard progress, cleared on restart.
- `localStorage` (`ilceradar_favorites`): bookmarked districts, persisted across sessions.
- URL `?s=` param: base64url-encoded `{ a: answers, r: selectedRegions }`, written on results view, read on page load.

### Tests

Tests live at `src/**/*.test.js` and run in a Node environment via Vitest. Current test files cover `scoring.js`, `shareUrl.js`, and `profile.js`.
