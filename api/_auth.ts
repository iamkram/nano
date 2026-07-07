// Shared auth helpers for the serverless functions. Files starting with an
// underscore in /api are not exposed as endpoints by Vercel.
//
// Sessions are stateless: /api/login verifies APP_USERNAME/APP_PASSWORD and
// issues `expiry.hmac(expiry)` signed with AUTH_SECRET (falling back to
// APP_PASSWORD — anyone who knows the password could just log in anyway).

import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Best-effort rate limiting, tracked per serverless instance
const RATE_LIMIT_MAX_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function signingSecret(): string | null {
    return process.env.AUTH_SECRET || process.env.APP_PASSWORD || null;
}

function signature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export function credentialsConfigured(): boolean {
    return Boolean(process.env.APP_USERNAME && process.env.APP_PASSWORD);
}

export function verifyCredentials(username: unknown, password: unknown): boolean {
    const expectedUsername = process.env.APP_USERNAME;
    const expectedPassword = process.env.APP_PASSWORD;
    if (!expectedUsername || !expectedPassword) return false;
    if (typeof username !== 'string' || typeof password !== 'string') return false;
    const usernameOK = safeEqual(username, expectedUsername);
    const passwordOK = safeEqual(password, expectedPassword);
    return usernameOK && passwordOK;
}

export function issueToken(now: number = Date.now()): string | null {
    const secret = signingSecret();
    if (!secret) return null;
    const expiry = String(now + TOKEN_TTL_MS);
    return `${expiry}.${signature(expiry, secret)}`;
}

export function verifyToken(authorizationHeader: unknown, now: number = Date.now()): boolean {
    const secret = signingSecret();
    if (!secret || typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
        return false;
    }
    const token = authorizationHeader.slice('Bearer '.length);
    const separator = token.indexOf('.');
    if (separator <= 0) return false;
    const expiryText = token.slice(0, separator);
    const provided = token.slice(separator + 1);
    const expiry = Number(expiryText);
    if (!Number.isFinite(expiry) || expiry < now) return false;
    return safeEqual(provided, signature(expiryText, secret));
}

export function allowRequest(key: string, now: number = Date.now()): boolean {
    if (requestLog.size > 500) {
        requestLog.clear();
    }
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    const recent = (requestLog.get(key) ?? []).filter(timestamp => timestamp > cutoff);
    if (recent.length >= RATE_LIMIT_MAX_PER_MINUTE) {
        requestLog.set(key, recent);
        return false;
    }
    recent.push(now);
    requestLog.set(key, recent);
    return true;
}

export function clientKey(headers: Record<string, string | string[] | undefined> | undefined): string {
    const forwarded = headers?.['x-forwarded-for'];
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return (first ?? 'unknown').split(',')[0].trim();
}
