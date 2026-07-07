# Deployment Guide

## Environment Variables (required)

The client never holds secrets — it signs in through `/api/login` and calls
the `/api/gemini` serverless proxy. Both read server-side env vars:

- `GEMINI_API_KEY` — the Google AI key used by the proxy.
- `APP_USERNAME` / `APP_PASSWORD` — the console login. `/api/login` verifies
  them server-side and issues a signed session token; `/api/gemini` rejects
  requests without a valid token, so the key can't be used anonymously.
- `AUTH_SECRET` (optional) — a separate token-signing secret; defaults to
  deriving from `APP_PASSWORD`.

Set them in **Vercel** → Project → Settings → Environment Variables. For
**local dev**, put them in `.env` and run `vercel dev` (plain `npm run dev`
serves the UI but not the `/api` functions).

Do NOT use `VITE_`-prefixed names for any of these — Vite inlines those values
into the public client bundle where anyone can extract them.

## Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides excellent support for Vite apps.

1. **Create a Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up.
2. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```
3. **Deploy**:
   Run the following command in your terminal:
   ```bash
   vercel
   ```
   Follow the prompts. It will automatically detect your Vite settings.

4. **Production Deployment**:
   For a production deployment (not a preview), run:
   ```bash
   vercel --prod
   ```

## Static-only hosts (Netlify drag-and-drop, GitHub Pages)

**Not supported as-is.** The app depends on the `/api/login` and `/api/gemini`
serverless functions, which static hosting doesn't run — deploying only the
`dist` folder produces a UI where login and generation always fail.

- **Netlify**: possible only if you port the two functions in `api/` to
  Netlify Functions (different handler signature) and keep all env vars
  server-side.
- **GitHub Pages**: no serverless option; not usable for this app.
