export interface SessionPayload {
  email: string;
  role: string;
  exp: number;
}

// Ensure secret is present in environment or generate runtime secret (Web Crypto Edge compliant)
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: SESSION_SECRET environment variable is missing.');
    }
    if (!(globalThis as any)._devSecret) {
      const arr = new Uint8Array(32);
      crypto.getRandomValues(arr);
      (globalThis as any)._devSecret = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return 'dev_runtime_' + (globalThis as any)._devSecret;
  }
  return secret;
}

// Base64Url Encoding Helpers
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Sign session token with HMAC-SHA256
export async function signSessionToken(payload: Omit<SessionPayload, 'exp'>, expiresInSeconds = 86400): Promise<string> {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedPayload}.${signatureBase64}`;
}

// Verify token signature and check expiry
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || !token.includes('.')) return null;

  try {
    const secret = getSessionSecret();
    const [encodedPayload, signature] = token.split('.');

    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    
    const expectedBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
    const expectedArray = Array.from(new Uint8Array(expectedBuffer));
    const expectedSignature = btoa(String.fromCharCode(...expectedArray))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      return null; // Invalid signature / forged token
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));

    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired token
    }

    return payload;
  } catch (err) {
    return null;
  }
}
