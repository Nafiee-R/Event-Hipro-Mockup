import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createSession, setSessionCookie, clearSessionCookie, getSessionAdmin } from '@/lib/auth';

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

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, admin: session });
}
