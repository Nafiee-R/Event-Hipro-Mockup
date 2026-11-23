import { NextRequest, NextResponse } from 'next/server';
import { getSessionAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';
import {
  getAdminEventById,
  validateEventForPublication,
  rescheduleEvent,
  softDeleteEvent,
} from '@/lib/events';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = await getAdminEventById(params.id);
  if (!event) {
    return NextResponse.json({ error: 'Acara tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await getAdminEventById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Acara tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { action, eventData, performers, gallery, version } = body;

    // Optimistic concurrency check
    if (existing.version !== Number(version)) {
      return NextResponse.json(
        { error: 'Acara sudah diperbarui. Muat versi terbaru sebelum menyimpan.' },
        { status: 409 }
      );
    }

    const isPublishing = action === 'publish';
    if (isPublishing) {
      const validation = validateEventForPublication({ ...existing, ...eventData });
      if (!validation.valid) {
        return NextResponse.json({ errors: validation.errors }, { status: 400 });
      }
    }

    const db = getDb();
    const now = new Date().toISOString();

    // Check slot collision if setting featured slot
    if (eventData.featured_slot && eventData.featured_slot !== existing.featured_slot) {
      await db.execute({
        sql: 'UPDATE events SET featured_slot = NULL WHERE featured_slot = ? AND id != ?',
        args: [eventData.featured_slot, params.id],
      });
    }

    // Update main event row
    await db.execute({
      sql: `
        UPDATE events
        SET
          title = ?,
          category = ?,
          description = ?,
          venue_id = ?,
          starts_at = ?,
          ends_at = ?,
          publication_status = ?,
          featured_slot = ?,
          cover_url = ?,
          cover_alt = ?,
          price_idr = ?,
          admission_mode = ?,
          registration_url = ?,
          attendance_note = ?,
          version = version + 1,
          updated_at = ?
        WHERE id = ? AND version = ?
      `,
      args: [
        eventData.title.trim(),
        eventData.category.trim(),
        eventData.description.trim(),
        eventData.venue_id,
        eventData.starts_at || existing.starts_at,
        eventData.ends_at || existing.ends_at,
        isPublishing ? 'published' : (eventData.publication_status || existing.publication_status),
        eventData.featured_slot || null,
        eventData.cover_url || existing.cover_url,
        eventData.cover_alt !== undefined ? eventData.cover_alt : existing.cover_alt,
        Number(eventData.price_idr ?? existing.price_idr),
        eventData.admission_mode || existing.admission_mode,
        eventData.registration_url || null,
        eventData.attendance_note || null,
        now,
        params.id,
        existing.version,
      ],
    });

    // Update performers
    if (Array.isArray(performers)) {
      await db.execute({ sql: 'DELETE FROM performers WHERE event_id = ?', args: [params.id] });
      for (let i = 0; i < performers.length; i++) {
        const p = performers[i];
        if (p.name?.trim()) {
          const perfId = p.id || 'perf_' + Date.now() + '_' + i;
          await db.execute({
            sql: `INSERT INTO performers (id, event_id, name, bio, portrait_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [perfId, params.id, p.name.trim(), p.bio?.trim() || '', p.portrait_url || null, i + 1],
          });
        }
      }
    }

    // Update gallery
    if (Array.isArray(gallery)) {
      await db.execute({ sql: 'DELETE FROM event_galleries WHERE event_id = ?', args: [params.id] });
      for (let i = 0; i < gallery.length; i++) {
        const g = gallery[i];
        if (g.image_url?.trim()) {
          const galId = g.id || 'gal_' + Date.now() + '_' + i;
          await db.execute({
            sql: `INSERT INTO event_galleries (id, event_id, image_url, alt_text, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [galId, params.id, g.image_url.trim(), g.alt_text || null, g.caption || null, i + 1],
          });
        }
      }
    }

    const updated = await getAdminEventById(params.id);
    return NextResponse.json({
      success: true,
      event: updated,
      message: isPublishing ? 'Acara berhasil diterbitkan!' : 'Perubahan acara berhasil disimpan.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memperbarui acara.' }, { status: 500 });
  }
}

// Reschedule action via POST
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, newStartsAt, newEndsAt, reason, version } = body;

    if (action !== 'reschedule') {
      return NextResponse.json({ error: 'Aksi tidak didukung' }, { status: 400 });
    }

    if (!newStartsAt || !newEndsAt) {
      return NextResponse.json({ error: 'Tanggal dan jam baru wajib diisi.' }, { status: 400 });
    }

    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Alasan internal jadwal ulang wajib diisi.' }, { status: 400 });
    }

    const result = await rescheduleEvent({
      eventId: params.id,
      newStartsAt,
      newEndsAt,
      reason: reason.trim(),
      adminId: session.adminId,
      version: Number(version),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updated = await getAdminEventById(params.id);
    return NextResponse.json({
      success: true,
      event: updated,
      message: 'Jadwal acara berhasil diperbarui.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menjadwalkan ulang acara.' }, { status: 500 });
  }
}

// Soft delete
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const version = Number(searchParams.get('version') || 1);

    const result = await softDeleteEvent(params.id, version);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Acara berhasil dihapus dari sistem publik.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus acara.' }, { status: 500 });
  }
}
