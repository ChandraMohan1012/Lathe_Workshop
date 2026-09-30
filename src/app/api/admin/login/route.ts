import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signSessionToken } from '@/lib/auth-session';
import { verifyAdminPassword } from '@/lib/auth';

// Rate limit store for failed login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true };
  }

  if (now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true };
  }

  if (attempt.count >= 5) {
    return { allowed: false, remainingMs: attempt.resetAt - now };
  }

  attempt.count += 1;
  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const remainingMin = Math.ceil((rateCheck.remainingMs || 0) / 60000);
      return NextResponse.json(
        { success: false, message: `Too many failed login attempts. Account locked for ${remainingMin} minutes.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let authenticated = false;
    let userEmail = email || 'admin@lathepattarai.com';

    // 1. Try real Supabase Auth if credentials and Supabase env are provided
    if (supabaseUrl && supabaseAnonKey && email && password) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        authenticated = true;
        userEmail = data.user.email || userEmail;
      }
    }

    // 2. Strict ADMIN_SECRET_KEY check (NO hardcoded fallbacks)
    if (!authenticated && password && verifyAdminPassword(password)) {
      authenticated = true;
    }

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials or authorization key.' },
        { status: 401 }
      );
    }

    // Generate Web Crypto HMAC SHA-256 signed session token
    const token = await signSessionToken({ email: userEmail, role: 'admin' }, 86400);

    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

    response.cookies.set({
      name: 'lathe_admin_session',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
