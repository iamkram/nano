# Deployment Guide

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

## Option 2: Netlify

1. **Create a Netlify Account**: Go to [netlify.com](https://netlify.com).
2. **Drag and Drop**:
   - Run `npm run build` locally.
   - Drag the `dist` folder to the Netlify dashboard.
3. **CLI Method**:
   - Install CLI: `npm install netlify-cli -g`
   - Run `netlify deploy`

## Option 3: GitHub Pages

1. Update `vite.config.ts` to set the base URL:
   ```ts
   export default defineConfig({
     base: '/nano/', // Replace with your repo name
     plugins: [react()],
   })
   ```
2. Build and push the `dist` folder to a `gh-pages` branch.
