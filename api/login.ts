// Verifies the console credentials server-side and issues a signed session
// token for /api/gemini. Deployed by Vercel as POST /api/login.

import { allowRequest, clientKey, credentialsConfigured, issueToken, verifyCredentials } from './_auth';

interface LoginRequest {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    body?: { username?: unknown; password?: unknown };
}

interface LoginResponse {
    status(code: number): LoginResponse;
    json(body: unknown): void;
}

export default function handler(req: LoginRequest, res: LoginResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!credentialsConfigured()) {
        res.status(500).json({ error: 'Login is not configured on the server (set APP_USERNAME and APP_PASSWORD)' });
        return;
    }

    if (!allowRequest(`login:${clientKey(req.headers)}`)) {
        res.status(429).json({ error: 'Too many attempts — try again in a minute' });
        return;
    }

    const { username, password } = req.body ?? {};
    if (!verifyCredentials(username, password)) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    const token = issueToken();
    if (!token) {
        res.status(500).json({ error: 'Could not issue a session token' });
        return;
    }

    res.status(200).json({ token });
}
