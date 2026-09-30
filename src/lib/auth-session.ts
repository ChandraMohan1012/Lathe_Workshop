export interface SessionPayload {
  email: string;
  role: string;
  exp: number;
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'lathepattarai_guindy_super_secret_hmac_key_2025';

// Base64Url Encoding Helpers for Web Crypto / Edge compatibility
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

// Sign token with HMAC-SHA256 using Web Crypto API (Edge + Node compatible)
export async function signSessionToken(payload: Omit<SessionPayload, 'exp'>, expiresInSeconds = 86400): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const key = await getHmacKey(SESSION_SECRET);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedPayload}.${signatureBase64}`;
}

// Verify token signature and check expiry using Web Crypto API
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || !token.includes('.')) return null;

  try {
    const [encodedPayload, signature] = token.split('.');

    const key = await getHmacKey(SESSION_SECRET);
    const enc = new TextEncoder();
    
    // Re-sign to verify
    const expectedBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
    const expectedArray = Array.from(new Uint8Array(expectedBuffer));
    const expectedSignature = btoa(String.fromCharCode(...expectedArray))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      return null; // Forged token
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiry
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired token
    }

    return payload;
  } catch (err) {
    return null;
  }
}
