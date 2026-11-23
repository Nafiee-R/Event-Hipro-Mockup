import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDb, ensureDbReady } from './db';
import { Admin } from './types';

const SESSION_COOKIE_NAME = 'djokja_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'grand-hotel-de-djokja-secret-key-2027';

// In-memory or database-backed active session tokens
interface SessionData {
  adminId: string;
  email: string;
  name: string;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();

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

export function createSession(admin: Admin): string {
  const token = crypto.randomBytes(32).toString('hex');
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  activeSessions.set(token, {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    expiresAt: Date.now() + maxAge,
  });
  return token;
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    activeSessions.delete(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionAdmin(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = activeSessions.get(token);
  if (!session) {
    // If server restarted, let's verify if admin exists in DB for persistent sessions
    return null;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}
