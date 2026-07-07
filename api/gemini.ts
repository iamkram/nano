// Serverless proxy for Google Generative Language API calls.
// Keeps the Gemini API key in a server-side env var (GEMINI_API_KEY) so it
// never appears in the client bundle. Deployed by Vercel as POST /api/gemini.
// Requests must carry a session token issued by /api/login — without that,
// anyone could burn the key's quota — and are rate limited per client.

import { allowRequest, clientKey, verifyToken } from './_auth';

const ALLOWED_MODELS = new Set(['gemini-3-pro-preview', 'nano-banana-pro-preview']);

interface ProxyRequest {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    body?: { model?: unknown; contents?: unknown };
}

interface ProxyResponse {
    status(code: number): ProxyResponse;
    setHeader(name: string, value: string): void;
    json(body: unknown): void;
    send(body: string): void;
}

export default async function handler(req: ProxyRequest, res: ProxyResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!verifyToken(req.headers?.authorization)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!allowRequest(`gemini:${clientKey(req.headers)}`)) {
        res.status(429).json({ error: 'Too many requests — try again in a minute' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
        return;
    }

    const { model, contents } = req.body ?? {};
    if (typeof model !== 'string' || !ALLOWED_MODELS.has(model)) {
        res.status(400).json({ error: 'Unsupported model' });
        return;
    }
    if (!Array.isArray(contents) || contents.length === 0) {
        res.status(400).json({ error: 'Missing contents' });
        return;
    }

    const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        }
    );

    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(upstream.status).send(body);
}
