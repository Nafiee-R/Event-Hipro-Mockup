import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { ensureDbReady } from './db';
import { Admin } from './types';

export const SESSION_COOKIE_NAME = 'djokja_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'grand-hotel-de-djokja-secret-key-2027';

export interface SessionData {
  adminId: string;
  email: string;
  name: string;
  expiresAt: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(email: string, password: string): Promise<Admin | null> {
  const db = await ensureDbReady();
  const result = await db.execute({
    sql: 'SELECT * FROM admins WHERE email = ? LIMIT 1',
    args: [email.toLowerCase().trim()],
  });

  if (result.rows.length === 0) return null;
  const adminRow = result.rows[0] as unknown as Admin;
  const isValid = await verifyPassword(password, adminRow.password_hash);
  if (!isValid) return null;

  return adminRow;
}

/**
 * Creates a cryptographically signed stateless session token.
 * Format: base64url(payload).hmacSha256(base64url(payload))
 * This works reliably across all serverless lambda instances on Vercel.
 */
export function createSession(admin: Admin): string {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const payload: SessionData = {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    expiresAt: Date.now() + maxAge,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${hmac}`;
}

/**
 * Verifies and decodes a signed session token.
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8')) as SessionData;
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  try {
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });
  } catch {
    // In contexts where cookieStore is read-only, caller can set via NextResponse.cookies
  }
}

export function clearSessionCookie() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // ignore
  }
}

export async function getSessionAdmin(): Promise<SessionData | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    return verifySessionToken(token);
  } catch {
    return null;
  }
}
