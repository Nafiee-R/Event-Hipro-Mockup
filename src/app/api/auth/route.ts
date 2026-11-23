import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateAdmin,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionAdmin,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan kata sandi wajib diisi.' }, { status: 400 });
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json({ error: 'Email atau kata sandi tidak sesuai.' }, { status: 401 });
    }

    const token = createSession(admin);
    setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });

    // Ensure cookie is set on the response headers explicitly for Vercel
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('[API /api/auth] Login error:', err);
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}

export async function DELETE() {
  clearSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, admin: session });
}
