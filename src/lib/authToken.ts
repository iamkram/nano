// Client-side storage for the session token issued by /api/login.
// The token is opaque to the client apart from its leading expiry timestamp.

const STORAGE_KEY = 'nano-auth-token';

export function authToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function storeAuthToken(token: string): void {
    try {
        localStorage.setItem(STORAGE_KEY, token);
    } catch {
        // Private browsing without storage: the session just won't persist
    }
}

export function clearAuthToken(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Nothing to clear
    }
}

export function hasValidAuthToken(): boolean {
    const token = authToken();
    if (!token) return false;
    const expiry = Number(token.split('.')[0]);
    return Number.isFinite(expiry) && expiry > Date.now();
}
