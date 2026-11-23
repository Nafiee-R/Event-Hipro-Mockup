import { NextRequest, NextResponse } from 'next/server';
import { getSessionAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';
import {
  getAdminEvents,
  generateUniqueSlug,
  validateEventForPublication,
} from '@/lib/events';

export async function GET(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || undefined;
  const status = searchParams.get('status') || undefined;
  const q = searchParams.get('q') || undefined;

  const events = await getAdminEvents(month, status, q);
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, eventData, performers, gallery } = body;

    if (!eventData.title?.trim()) {
      return NextResponse.json(
        { errors: { title: 'Judul acara wajib diisi minimal untuk menyimpan draf.' } },
        { status: 400 }
      );
    }

    const isPublishing = action === 'publish';
    if (isPublishing) {
      const validation = validateEventForPublication(eventData);
      if (!validation.valid) {
        return NextResponse.json({ errors: validation.errors }, { status: 400 });
      }
    }

    const db = getDb();
    const eventId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const slug = await generateUniqueSlug(eventData.title);
    const now = new Date().toISOString();

    const startsAt = eventData.starts_at || '2027-01-01T09:00:00+07:00';
    const endsAt = eventData.ends_at || '2027-01-01T11:00:00+07:00';

    // If setting featured slot, check if existing event has it and clear it
    if (eventData.featured_slot) {
      await db.execute({
        sql: 'UPDATE events SET featured_slot = NULL WHERE featured_slot = ?',
        args: [eventData.featured_slot],
      });
    }

    await db.execute({
      sql: `
        INSERT INTO events (
          id, slug, title, category, description, venue_id, starts_at, ends_at,
          publication_status, featured_slot, cover_url, cover_alt, price_idr,
          admission_mode, registration_url, attendance_note, is_demo, version,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
      `,
      args: [
        eventId,
        slug,
        eventData.title.trim(),
        eventData.category?.trim() || 'Budaya',
        eventData.description?.trim() || '',
        eventData.venue_id || 'beranda',
        startsAt,
        endsAt,
        isPublishing ? 'published' : 'draft',
        eventData.featured_slot || null,
        eventData.cover_url || null,
        eventData.cover_alt || null,
        Number(eventData.price_idr || 0),
        eventData.admission_mode || 'walk_in',
        eventData.registration_url || null,
        eventData.attendance_note || null,
        now,
        now,
      ],
    });

    // Insert performers if provided
    if (Array.isArray(performers) && performers.length > 0) {
      for (let i = 0; i < performers.length; i++) {
        const p = performers[i];
        if (p.name?.trim()) {
          const perfId = 'perf_' + Date.now() + '_' + i;
          await db.execute({
            sql: `INSERT INTO performers (id, event_id, name, bio, portrait_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [perfId, eventId, p.name.trim(), p.bio?.trim() || '', p.portrait_url || null, i + 1],
          });
        }
      }
    }

    // Insert gallery items if provided
    if (Array.isArray(gallery) && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        const g = gallery[i];
        if (g.image_url?.trim()) {
          const galId = 'gal_' + Date.now() + '_' + i;
          await db.execute({
            sql: `INSERT INTO event_galleries (id, event_id, image_url, alt_text, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [galId, eventId, g.image_url.trim(), g.alt_text || null, g.caption || null, i + 1],
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      eventId,
      slug,
      message: isPublishing ? 'Acara berhasil diterbitkan.' : 'Draf acara berhasil disimpan.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan acara.' }, { status: 500 });
  }
}
