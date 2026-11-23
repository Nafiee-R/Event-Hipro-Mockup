export type PublicationStatus = 'draft' | 'published';
export type AdmissionMode = 'walk_in' | 'external' | 'pending';

export interface Venue {
  id: string;
  name: string;
  description: string;
  photos: string[]; // JSON array of URLs
}

export interface Performer {
  id: string;
  event_id: string;
  name: string;
  bio: string;
  portrait_url?: string | null;
  sort_order: number;
}

export interface EventGallery {
  id: string;
  event_id: string;
  image_url: string;
  alt_text?: string | null;
  caption?: string | null;
  sort_order: number;
}

export interface ScheduleChange {
  id: string;
  event_id: string;
  old_starts_at: string;
  old_ends_at: string;
  new_starts_at: string;
  new_ends_at: string;
  reason: string;
  admin_id: string;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  venue_id: string;
  venue_name?: string;
  starts_at: string; // ISO string (Asia/Jakarta representation)
  ends_at: string;
  publication_status: PublicationStatus;
  deleted_at?: string | null;
  featured_slot?: number | null; // null | 1 | 2
  cover_url?: string | null;
  cover_alt?: string | null;
  price_idr: number;
  admission_mode: AdmissionMode;
  registration_url?: string | null;
  attendance_note?: string | null;
  is_demo: number; // 0 | 1
  version: number;
  created_at: string;
  updated_at: string;

  // Joined fields
  performers?: Performer[];
  gallery?: EventGallery[];
  latest_schedule_change?: ScheduleChange | null;
  has_schedule_changed?: boolean;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface EventFilter {
  month?: string; // "01" - "12" or undefined/all
  category?: string;
  venue_id?: string;
  q?: string;
}
