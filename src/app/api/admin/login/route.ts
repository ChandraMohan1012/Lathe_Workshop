import { NextResponse } from 'next/server';
import { verifyAdminPassword, generateAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin authorization key.' },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

    // Set secure HTTP session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
