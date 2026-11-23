import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'events.db');
    client = createClient({
      url: `file:${dbPath.replace(/\\/g, '/')}`,
    });
  }
  return client;
}

export async function initDb(): Promise<void> {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS venues (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      photos TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      venue_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
      publication_status TEXT NOT NULL DEFAULT 'draft',
      deleted_at TEXT,
      featured_slot INTEGER,
      cover_url TEXT,
      cover_alt TEXT,
      price_idr INTEGER NOT NULL DEFAULT 0,
      admission_mode TEXT NOT NULL DEFAULT 'walk_in',
      registration_url TEXT,
      attendance_note TEXT,
      is_demo INTEGER NOT NULL DEFAULT 1,
      version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS performers (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      bio TEXT NOT NULL,
      portrait_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS event_galleries (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS schedule_changes (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      old_starts_at TEXT NOT NULL,
      old_ends_at TEXT NOT NULL,
      new_starts_at TEXT NOT NULL,
      new_ends_at TEXT NOT NULL,
      reason TEXT NOT NULL,
      admin_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
