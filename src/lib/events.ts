import { getDb } from './db';
import { Event, Venue, Performer, EventGallery, ScheduleChange, EventFilter } from './types';
import { getMonthWIB, getYearWIB, getCurrentTimeWIB } from './date';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getVenues(): Promise<Venue[]> {
  const db = getDb();
  const result = await db.execute('SELECT * FROM venues ORDER BY name ASC');
  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    photos: JSON.parse(row.photos || '[]'),
  }));
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM venues WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  const row: any = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    photos: JSON.parse(row.photos || '[]'),
  };
}

/**
 * Public query for events:
 * Returns only published and deleted_at IS NULL events.
 * Supports filters: month, category, venue_id, q.
 * Chronologically ordered by starts_at ASC.
 */
export async function getPublicEvents(filter?: EventFilter): Promise<Event[]> {
  const db = getDb();
  let query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.publication_status = 'published' AND e.deleted_at IS NULL
  `;
  const args: any[] = [];

  if (filter?.category) {
    query += ' AND LOWER(e.category) = LOWER(?)';
    args.push(filter.category.trim());
  }

  if (filter?.venue_id) {
    query += ' AND e.venue_id = ?';
    args.push(filter.venue_id.trim());
  }

  if (filter?.q) {
    query += ' AND LOWER(e.title) LIKE ?';
    args.push(`%${filter.q.toLowerCase().trim()}%`);
  }

  query += ' ORDER BY datetime(e.starts_at) ASC';

  const result = await db.execute({ sql: query, args });
  let events = result.rows.map(mapEventRow);

  // Filter by month in WIB
  if (filter?.month && filter.month !== 'all') {
    const targetMonth = filter.month.padStart(2, '0');
    events = events.filter((e) => getMonthWIB(e.starts_at) === targetMonth);
  }

  // Attach schedule change flags
  for (const event of events) {
    const sc = await getLatestScheduleChange(event.id);
    event.has_schedule_changed = !!sc;
  }

  return events;
}

/**
 * Returns upcoming events for Hero panel (max 3 published, not ended).
 * If all ended, returns empty list so UI displays "Lihat arsip 2027".
 */
export async function getUpcomingHeroEvents(simulatedTimeIso?: string): Promise<Event[]> {
  const db = getDb();
  const currentTime = getCurrentTimeWIB(simulatedTimeIso);

  const query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.publication_status = 'published' AND e.deleted_at IS NULL
    ORDER BY datetime(e.starts_at) ASC
  `;
  const result = await db.execute(query);
  const allEvents = result.rows.map(mapEventRow);

  // Filter out ended events
  const upcoming = allEvents.filter((e) => {
    const end = new Date(e.ends_at);
    return end.getTime() > currentTime.getTime();
  });

  return upcoming.slice(0, 3);
}

/**
 * Returns featured events for the editorial highlight cards (slots 1 and 2).
 */
export async function getFeaturedEvents(): Promise<Event[]> {
  const db = getDb();
  const query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.publication_status = 'published' AND e.deleted_at IS NULL AND e.featured_slot IN (1, 2)
    ORDER BY e.featured_slot ASC
  `;
  const result = await db.execute(query);
  return result.rows.map(mapEventRow);
}

/**
 * Retrieves single public event by slug.
 * Excludes deleted or draft events for public view.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const db = getDb();
  const query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.slug = ? AND e.publication_status = 'published' AND e.deleted_at IS NULL
    LIMIT 1
  `;
  const result = await db.execute({ sql: query, args: [slug] });
  if (result.rows.length === 0) return null;

  const event = mapEventRow(result.rows[0]);
  event.performers = await getPerformersByEventId(event.id);
  event.gallery = await getGalleryByEventId(event.id);
  event.latest_schedule_change = await getLatestScheduleChange(event.id);
  event.has_schedule_changed = !!event.latest_schedule_change;

  return event;
}

/**
 * Admin: Get all events including drafts (excludes soft-deleted).
 */
export async function getAdminEvents(month?: string, status?: string, q?: string): Promise<Event[]> {
  const db = getDb();
  let query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.deleted_at IS NULL
  `;
  const args: any[] = [];

  if (status && status !== 'all') {
    query += ' AND e.publication_status = ?';
    args.push(status);
  }

  if (q) {
    query += ' AND LOWER(e.title) LIKE ?';
    args.push(`%${q.toLowerCase().trim()}%`);
  }

  query += ' ORDER BY datetime(e.starts_at) ASC, e.updated_at DESC';

  const result = await db.execute({ sql: query, args });
  let events = result.rows.map(mapEventRow);

  if (month && month !== 'all') {
    const targetMonth = month.padStart(2, '0');
    events = events.filter((e) => getMonthWIB(e.starts_at) === targetMonth);
  }

  return events;
}

/**
 * Admin: Get event by ID (including draft).
 */
export async function getAdminEventById(id: string): Promise<Event | null> {
  const db = getDb();
  const query = `
    SELECT e.*, v.name as venue_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.id = ? AND e.deleted_at IS NULL
    LIMIT 1
  `;
  const result = await db.execute({ sql: query, args: [id] });
  if (result.rows.length === 0) return null;

  const event = mapEventRow(result.rows[0]);
  event.performers = await getPerformersByEventId(event.id);
  event.gallery = await getGalleryByEventId(event.id);
  event.latest_schedule_change = await getLatestScheduleChange(event.id);
  return event;
}

export async function getPerformersByEventId(eventId: string): Promise<Performer[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM performers WHERE event_id = ? ORDER BY sort_order ASC',
    args: [eventId],
  });
  return result.rows.map((row: any) => ({
    id: row.id,
    event_id: row.event_id,
    name: row.name,
    bio: row.bio,
    portrait_url: row.portrait_url,
    sort_order: row.sort_order,
  }));
}

export async function getGalleryByEventId(eventId: string): Promise<EventGallery[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM event_galleries WHERE event_id = ? ORDER BY sort_order ASC',
    args: [eventId],
  });
  return result.rows.map((row: any) => ({
    id: row.id,
    event_id: row.event_id,
    image_url: row.image_url,
    alt_text: row.alt_text,
    caption: row.caption,
    sort_order: row.sort_order,
  }));
}

export async function getLatestScheduleChange(eventId: string): Promise<ScheduleChange | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM schedule_changes WHERE event_id = ? ORDER BY datetime(created_at) DESC LIMIT 1',
    args: [eventId],
  });
  if (result.rows.length === 0) return null;
  const row: any = result.rows[0];
  return {
    id: row.id,
    event_id: row.event_id,
    old_starts_at: row.old_starts_at,
    old_ends_at: row.old_ends_at,
    new_starts_at: row.new_starts_at,
    new_ends_at: row.new_ends_at,
    reason: row.reason,
    admin_id: row.admin_id,
    created_at: row.created_at,
  };
}

/**
 * Creates unique slug for a given title
 */
export async function generateUniqueSlug(title: string, excludeEventId?: string): Promise<string> {
  const db = getDb();
  let baseSlug = slugify(title) || 'acara';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const res = await db.execute({
      sql: 'SELECT id FROM events WHERE slug = ? AND (id != ? OR ? IS NULL) LIMIT 1',
      args: [slug, excludeEventId || '', excludeEventId ? excludeEventId : null],
    });
    if (res.rows.length === 0) {
      return slug;
    }
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

/**
 * Validates business rules before publication.
 */
export function validateEventForPublication(data: Partial<Event>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) errors.title = 'Judul acara wajib diisi.';
  if (!data.category?.trim()) errors.category = 'Kategori wajib dipilih.';
  if (!data.description?.trim()) errors.description = 'Deskripsi narasi acara wajib diisi.';
  if (!data.venue_id?.trim()) errors.venue_id = 'Ruang acara wajib dipilih.';
  if (!data.starts_at) errors.starts_at = 'Waktu mulai wajib diisi.';
  if (!data.ends_at) errors.ends_at = 'Waktu selesai wajib diisi.';

  if (data.starts_at && data.ends_at) {
    const start = new Date(data.starts_at);
    const end = new Date(data.ends_at);
    if (isNaN(start.getTime())) errors.starts_at = 'Waktu mulai tidak valid.';
    if (isNaN(end.getTime())) errors.ends_at = 'Waktu selesai tidak valid.';

    if (!errors.starts_at && !errors.ends_at) {
      if (end.getTime() <= start.getTime()) {
        errors.ends_at = 'Waktu selesai harus setelah waktu mulai.';
      }

      // Year rule: starts_at must be in 2027 in Asia/Jakarta
      const startYear = getYearWIB(data.starts_at);
      if (startYear !== 2027) {
        errors.starts_at = 'Tanggal mulai harus berada pada tahun 2027.';
      }
    }
  }

  if (data.price_idr === undefined || data.price_idr === null || Number(data.price_idr) < 0) {
    errors.price_idr = 'Harga harus berupa bilangan bulat rupiah ≥ 0.';
  }

  if (!data.admission_mode) {
    errors.admission_mode = 'Cara hadir wajib dipilih.';
  } else if (data.admission_mode === 'external') {
    if (!data.registration_url?.trim() || !data.registration_url.startsWith('https://')) {
      errors.registration_url = 'Tautan pendaftaran eksternal harus berupa URL HTTPS yang valid.';
    }
  }

  if (!data.cover_url?.trim()) {
    errors.cover_url = 'Foto sampul wajib diunggah untuk menerbitkan acara.';
  } else if (!data.cover_alt?.trim()) {
    errors.cover_alt = 'Teks alternatif foto sampul wajib diisi.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Reschedule an event with validation and atomic history recording.
 */
export async function rescheduleEvent(params: {
  eventId: string;
  newStartsAt: string;
  newEndsAt: string;
  reason: string;
  adminId: string;
  version: number;
}): Promise<{ success: boolean; error?: string }> {
  const db = getDb();
  const event = await getAdminEventById(params.eventId);
  if (!event) return { success: false, error: 'Acara tidak ditemukan.' };

  // Optimistic concurrency check
  if (event.version !== params.version) {
    return {
      success: false,
      error: 'Acara sudah diperbarui. Muat versi terbaru sebelum menyimpan.',
    };
  }

  const newStart = new Date(params.newStartsAt);
  const newEnd = new Date(params.newEndsAt);

  if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
    return { success: false, error: 'Format tanggal/waktu tidak valid.' };
  }

  if (newEnd.getTime() <= newStart.getTime()) {
    return { success: false, error: 'Waktu selesai harus setelah waktu mulai.' };
  }

  const startYear = getYearWIB(params.newStartsAt);
  if (startYear !== 2027) {
    return { success: false, error: 'Jadwal ulang harus dimulai pada tahun 2027.' };
  }

  // If time hasn't changed, do not create history record
  if (event.starts_at === params.newStartsAt && event.ends_at === params.newEndsAt) {
    return { success: true };
  }

  const changeId = 'sc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const now = new Date().toISOString();

  // Atomically update event and insert schedule change
  await db.batch([
    {
      sql: `
        UPDATE events
        SET starts_at = ?, ends_at = ?, version = version + 1, updated_at = ?
        WHERE id = ? AND version = ?
      `,
      args: [params.newStartsAt, params.newEndsAt, now, params.eventId, params.version],
    },
    {
      sql: `
        INSERT INTO schedule_changes (
          id, event_id, old_starts_at, old_ends_at, new_starts_at, new_ends_at, reason, admin_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        changeId,
        params.eventId,
        event.starts_at,
        event.ends_at,
        params.newStartsAt,
        params.newEndsAt,
        params.reason.trim(),
        params.adminId,
        now,
      ],
    },
  ]);

  return { success: true };
}

/**
 * Soft delete an event
 */
export async function softDeleteEvent(eventId: string, version: number): Promise<{ success: boolean; error?: string }> {
  const db = getDb();
  const event = await getAdminEventById(eventId);
  if (!event) return { success: false, error: 'Acara tidak ditemukan.' };

  if (event.version !== version) {
    return {
      success: false,
      error: 'Acara sudah diperbarui. Muat versi terbaru sebelum menyimpan.',
    };
  }

  const now = new Date().toISOString();
  // Clear featured_slot if deleted so it won't occupy slot
  await db.execute({
    sql: `
      UPDATE events
      SET deleted_at = ?, featured_slot = NULL, version = version + 1, updated_at = ?
      WHERE id = ? AND version = ?
    `,
    args: [now, now, eventId, version],
  });

  return { success: true };
}

function mapEventRow(row: any): Event {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    venue_id: row.venue_id,
    venue_name: row.venue_name || undefined,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    publication_status: row.publication_status,
    deleted_at: row.deleted_at,
    featured_slot: row.featured_slot,
    cover_url: row.cover_url,
    cover_alt: row.cover_alt,
    price_idr: Number(row.price_idr || 0),
    admission_mode: row.admission_mode,
    registration_url: row.registration_url,
    attendance_note: row.attendance_note,
    is_demo: Number(row.is_demo || 0),
    version: Number(row.version || 1),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
