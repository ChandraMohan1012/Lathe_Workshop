export const ADMIN_COOKIE_NAME = 'lathe_admin_session';

// Verify password securely
export function verifyAdminPassword(password: string): boolean {
  const secretKey = process.env.ADMIN_SECRET_KEY || 'lathe2025';
  return password === secretKey;
}

// Generate token hash
export function generateAdminSessionToken(): string {
  const timestamp = Date.now();
  return `session_${timestamp}_lathepattarai_guindy_secure`;
}
