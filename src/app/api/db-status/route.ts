import { NextResponse } from 'next/server';
import { getDbConfig, ensureDbReady } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { url, authToken, isTurso } = getDbConfig();

  try {
    const db = await ensureDbReady();

    const [venuesRes, eventsRes, adminsRes] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM venues'),
      db.execute('SELECT COUNT(*) as count FROM events'),
      db.execute('SELECT COUNT(*) as count FROM admins'),
    ]);

    const venuesCount = Number(venuesRes.rows[0]?.count ?? 0);
    const eventsCount = Number(eventsRes.rows[0]?.count ?? 0);
    const adminsCount = Number(adminsRes.rows[0]?.count ?? 0);

    return NextResponse.json({
      status: 'connected',
      databaseType: isTurso ? 'Turso (Remote LibSQL)' : 'SQLite (Local File)',
      url: isTurso ? url.replace(/:\/\/.*@/, '://***@') : 'data/events.db',
      hasAuthToken: !!authToken,
      stats: {
        venues: venuesCount,
        events: eventsCount,
        admins: adminsCount,
      },
      message: 'Koneksi database berhasil dan seluruh data siap diakses!',
    });
  } catch (err: any) {
    console.error('[API /api/db-status] Connection error:', err);
    return NextResponse.json(
      {
        status: 'error',
        databaseType: isTurso ? 'Turso (Remote LibSQL)' : 'SQLite (Local File)',
        url: isTurso ? url.replace(/:\/\/.*@/, '://***@') : 'data/events.db',
        hasAuthToken: !!authToken,
        error: err.message || 'Terjadi kegagalan koneksi database',
        hint: isTurso
          ? 'Periksa nilai TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN pada Vercel Settings > Environment Variables.'
          : 'Koneksi lokal SQLite gagal diinisialisasi.',
      },
      { status: 500 }
    );
  }
}
