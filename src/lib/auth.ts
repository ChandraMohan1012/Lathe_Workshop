export const ADMIN_COOKIE_NAME = 'lathe_admin_session';

// Verify password securely against environment variable (NO default fallbacks)
export function verifyAdminPassword(password: string): boolean {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: ADMIN_SECRET_KEY is not defined in production environment variables.');
    }
    return false;
  }
  return password === secretKey;
}
