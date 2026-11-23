import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { seedInitialData } from './seedData';

let client: Client | null = null;
let isInitialized = false;
let initPromise: Promise<Client> | null = null;

/**
 * Returns configuration details for the database connection.
 */
export function getDbConfig() {
  const rawUrl =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.TURSO_DB_URL ||
    process.env.LIBSQL_URL ||
    '';

  const rawToken =
    process.env.TURSO_AUTH_TOKEN ||
    process.env.DATABASE_AUTH_TOKEN ||
    process.env.TURSO_DB_AUTH_TOKEN ||
    process.env.LIBSQL_AUTH_TOKEN ||
    process.env.TURSO_TOKEN ||
    '';

  const url = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  const authToken = rawToken.trim().replace(/^['"]|['"]$/g, '');

  const isTurso =
    url.startsWith('libsql:') ||
    url.startsWith('https:') ||
    url.startsWith('http:') ||
    url.includes('.turso.io');

  return { url, authToken, isTurso };
}

/**
 * Instantiates or returns the singleton libSQL Client.
 * Automatically connects to Turso when TURSO_DATABASE_URL is provided,
 * otherwise falls back to the local SQLite database file in data/events.db.
 */
export function getDb(): Client {
  if (!client) {
    const { url, authToken, isTurso } = getDbConfig();

    if (isTurso) {
      // Connect to remote Turso instance
      client = createClient({
        url,
        authToken: authToken || undefined,
      });
    } else if (url && url.startsWith('file:')) {
      client = createClient({ url });
    } else {
      // Fallback: local SQLite database in data/events.db
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        try {
          fs.mkdirSync(dataDir, { recursive: true });
        } catch {
          // In read-only serverless environments, ignore if already exists or fails
        }
      }
      const dbPath = path.join(dataDir, 'events.db');
      client = createClient({
        url: `file:${dbPath.replace(/\\/g, '/')}`,
      });
    }
  }
  return client;
}

/**
 * Executes DDL schema statements to create all required tables if they don't exist.
 */
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

/**
 * Ensures tables exist and initial prototype data is seeded if empty.
 * Caches the initialization promise per process execution.
 */
export async function ensureDbReady(): Promise<Client> {
  const db = getDb();

  if (isInitialized) {
    return db;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initDb();

        // Check if database needs initial seeding (e.g. freshly created Turso database)
        const venueCheck = await db.execute('SELECT COUNT(*) as count FROM venues');
        const count = Number(venueCheck.rows[0]?.count ?? 0);

        if (count === 0) {
          console.log('[DB] Database is empty, seeding initial venues, admin and prototype events...');
          await seedInitialData(db);
          console.log('[DB] Database initial seed completed successfully.');
        }

        isInitialized = true;
      } catch (err) {
        console.error('[DB] Error during ensureDbReady:', err);
        // Do not lock failure state permanently in case of transient network errors
        initPromise = null;
        throw err;
      }
      return db;
    })();
  }

  return initPromise;
}
