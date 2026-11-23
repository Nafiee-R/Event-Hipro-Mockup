import { Client } from '@libsql/client';

export const INITIAL_VENUES = [
  {
    id: 'beranda',
    name: 'Beranda',
    description: 'Teras terbuka berlantai tegel klasik menghadap taman barat dengan semilir angin senja dan aksen arsitektur kolonial.',
    photos: JSON.stringify(['/images/venues/beranda-1.svg', '/images/venues/beranda-2.svg']),
  },
  {
    id: 'ruang-jamuan',
    name: 'Ruang Jamuan',
    description: 'Ruang bersantap elegan berhias lampu gantung kuningan untuk pengalaman kuliner istimewa dan jamuan rempah.',
    photos: JSON.stringify(['/images/venues/ruang-jamuan-1.svg', '/images/venues/ruang-jamuan-2.svg']),
  },
  {
    id: 'pendopo',
    name: 'Pendopo',
    description: 'Bangunan joglo megah beratap tumpang sari kayu jati untuk pertunjukan seni, pagelaran budaya, dan lokakarya komunitas.',
    photos: JSON.stringify(['/images/venues/pendopo-1.svg', '/images/venues/pendopo-2.svg']),
  },
];

export const INITIAL_ADMIN = {
  id: 'admin_1',
  email: 'admin@grandhotel.id',
  // bcrypt hash of 'AdminDjokja2027!'
  password_hash: '$2a$10$v.wH6VqBF9nPWJzvKZG53.g0Q0IvxM7iYTItfjytDZxfW2l94pLIC',
  name: 'Tim Event Grand Hotel De Djokja',
};

export const INITIAL_EVENTS = [
  {
    id: 'ev_keroncong_beranda',
    slug: 'keroncong-di-beranda',
    title: 'Keroncong di Beranda',
    category: 'Musik',
    description: 'Nikmati alunan musik keroncong tempo dulu di selasar teras beranda Grand Hotel De Djokja. Menampilkan aransemen klasik dan kontemporer bersama musisi lokal Yogyakarta di tengah suasana senja yang hangat.',
    venue_id: 'beranda',
    starts_at: '2027-01-16T18:30:00+07:00',
    ends_at: '2027-01-16T20:00:00+07:00',
    publication_status: 'published',
    featured_slot: 2,
    cover_url: '/images/events/keroncong.svg',
    cover_alt: 'Musisi keroncong tampil di selasar beranda senja',
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: 'Tersedia kursi santai di teras; disarankan hadir 15 menit sebelum acara.',
    is_demo: 1,
  },
  {
    id: 'ev_meja_rasa',
    slug: 'meja-rasa-yogyakarta',
    title: 'Meja Rasa Yogyakarta',
    category: 'Kuliner',
    description: 'Perjalanan rasa menyusuri resep pusaka kuliner Yogyakarta. Bersama juru masak tamu, pengunjung akan mencicipi racikan bumbu khas keraton yang disajikan dalam santapan malam multi-hidangan.',
    venue_id: 'ruang-jamuan',
    starts_at: '2027-02-13T18:00:00+07:00',
    ends_at: '2027-02-13T20:00:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/meja-rasa.svg',
    cover_alt: 'Hidangan kuliner istimewa berlatar lampu tembaga',
    price_idr: 150000,
    admission_mode: 'pending',
    registration_url: null,
    attendance_note: 'Tempat terbatas untuk 24 penikmat rasa.',
    is_demo: 1,
  },
  {
    id: 'ev_batik_motif',
    slug: 'membaca-motif-batik',
    title: 'Membaca Motif Batik',
    category: 'Budaya',
    description: 'Apa yang pertama kali Anda lihat pada selembar batik? Di meja kerja pendopo, peserta mengamati susunan motif bersama perajin, lalu menggambar satu pola sederhana untuk dibawa pulang. Alat gambar tersedia di lokasi.',
    venue_id: 'pendopo',
    starts_at: '2027-04-17T09:00:00+07:00',
    ends_at: '2027-04-17T11:00:00+07:00',
    publication_status: 'published',
    featured_slot: 1,
    cover_url: '/images/events/batik.svg',
    cover_alt: 'Perajin batik sedang melukis kain di pendopo',
    price_idr: 0,
    admission_mode: 'pending',
    registration_url: null,
    attendance_note: 'Peserta dipersilakan membawa buku catatan sketsa sendiri jika berkenan.',
    is_demo: 1,
  },
  {
    id: 'ev_piano_senja',
    slug: 'senja-di-tuts-piano',
    title: 'Senja di Tuts Piano',
    category: 'Musik',
    description: 'Lantunan nada grand piano akustik di ruang terbuka saat matahari beranjak tenggelam. Mengiringi secangkir teh sore bagi para tamu hotel dan pengunjung kota.',
    venue_id: 'beranda',
    starts_at: '2027-04-24T18:30:00+07:00',
    ends_at: '2027-04-24T20:00:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/piano.svg',
    cover_alt: 'Pianis memainkan tuts piano di bawah cahaya sore',
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: 'Pintu terbuka bebas untuk seluruh pengunjung hotel.',
    is_demo: 1,
  },
  {
    id: 'ev_rempah_jawa',
    slug: 'jamuan-rempah-jawa',
    title: 'Jamuan Rempah Jawa',
    category: 'Kuliner',
    description: 'Mengenal khasiat rempah lokal mulai dari cengkeh, kayu manis, hingga kapulaga yang diracik ke dalam hidangan jamuan dan seduhan hangat tempo dulu.',
    venue_id: 'ruang-jamuan',
    starts_at: '2027-06-19T17:30:00+07:00',
    ends_at: '2027-06-19T19:30:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/rempah.svg',
    cover_alt: 'Bumbu rempah Nusantara dalam piring tembikar',
    price_idr: 125000,
    admission_mode: 'pending',
    registration_url: null,
    attendance_note: 'Termasuk cicipan tiga racikan wedang rempah.',
    is_demo: 1,
  },
  {
    id: 'ev_kain_lurik',
    slug: 'cerita-dari-kain-lurik',
    title: 'Cerita dari Kain Lurik',
    category: 'Budaya',
    description: 'Mendalami tenunan lurik tradisional Klaten dan Yogyakarta, filosofi garis-garis bersahaja, serta penerapannya dalam busana kontemporer.',
    venue_id: 'pendopo',
    starts_at: '2027-08-21T10:00:00+07:00',
    ends_at: '2027-08-21T11:30:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/lurik.svg',
    cover_alt: 'Gulungan kain lurik bergaris di pendopo',
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: 'Pameran mini tenun lurik dapat dinikmati seusai acara.',
    is_demo: 1,
  },
  {
    id: 'ev_sketsa_beranda',
    slug: 'sketsa-sore-di-beranda',
    title: 'Sketsa Sore di Beranda',
    category: 'Komunitas',
    description: 'Sesi menggambar bersama komunitas penggambar kota (urban sketchers). Mengabadikan lengkungan fasad kolonial, pilar megah, dan tanaman tropis beranda.',
    venue_id: 'beranda',
    starts_at: '2027-10-16T15:30:00+07:00',
    ends_at: '2027-10-16T17:00:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/sketsa.svg',
    cover_alt: 'Peserta menggambar sketsa arsitektur hotel',
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: 'Bawa alat gambar dan alas masing-masing; kursi lipat dipersilakan.',
    is_demo: 1,
  },
  {
    id: 'ev_musik_tahun_baru',
    slug: 'musik-di-penghujung-tahun',
    title: 'Musik di Penghujung Tahun',
    category: 'Musik',
    description: 'Malam perayaan pergantian tahun 2027 menuju 2028 dengan suguhan musik orkestra mini dan tembang kenangan di plataran pendopo agung.',
    venue_id: 'pendopo',
    starts_at: '2027-12-31T22:00:00+07:00',
    ends_at: '2028-01-01T00:30:00+07:00',
    publication_status: 'published',
    featured_slot: null,
    cover_url: '/images/events/tahun-baru.svg',
    cover_alt: 'Suasana megah malam pergantian tahun di pendopo',
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: 'Diharapkan hadir sebelum pukul 22.00 WIB untuk reservasi tempat.',
    is_demo: 1,
  },
  {
    id: 'ev_draft_cetak_daun',
    slug: 'lokakarya-cetak-daun',
    title: 'Lokakarya Cetak Daun',
    category: 'Budaya',
    description: 'Lokakarya teknik cetak daun dan flora lokal untuk menghias tekstil alam.',
    venue_id: 'pendopo',
    starts_at: '2027-05-15T10:00:00+07:00',
    ends_at: '2027-05-15T12:00:00+07:00',
    publication_status: 'draft',
    featured_slot: null,
    cover_url: null,
    cover_alt: null,
    price_idr: 0,
    admission_mode: 'walk_in',
    registration_url: null,
    attendance_note: null,
    is_demo: 1,
  },
];

export const INITIAL_PERFORMERS = [
  {
    id: 'perf_raras',
    event_id: 'ev_batik_motif',
    name: 'Raras',
    bio: 'Fasilitator motif dan pegiat batik tulis Yogyakarta dengan pengalaman lebih dari 15 tahun.',
    portrait_url: '/images/performers/raras.svg',
    sort_order: 1,
  },
  {
    id: 'perf_damar',
    event_id: 'ev_batik_motif',
    name: 'Damar',
    bio: 'Pemandu sesi sketsa pola dan desainer tekstil independen di Kotagede.',
    portrait_url: '/images/performers/damar.svg',
    sort_order: 2,
  },
];

export const INITIAL_GALLERY = [
  {
    id: 'gal_batik_1',
    event_id: 'ev_batik_motif',
    url: '/images/gallery/batik-kain.svg',
    alt: 'Detail kain batik tulis',
    caption: 'Detail kain · Ilustrasi kegiatan',
    order: 1,
  },
  {
    id: 'gal_batik_2',
    event_id: 'ev_batik_motif',
    url: '/images/gallery/batik-tangan.svg',
    alt: 'Tangan menggambar motif batik',
    caption: 'Tangan menggambar · Ilustrasi kegiatan',
    order: 2,
  },
  {
    id: 'gal_batik_3',
    event_id: 'ev_batik_motif',
    url: '/images/gallery/batik-meja.svg',
    alt: 'Meja kerja pendopo untuk lokakarya',
    caption: 'Meja kerja pendopo · Ilustrasi kegiatan',
    order: 3,
  },
];

/**
 * Seeds the database with default venues, admin account, and events if empty.
 */
export async function seedInitialData(db: Client): Promise<void> {
  const now = new Date().toISOString();

  // 1. Seed Venues
  for (const v of INITIAL_VENUES) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO venues (id, name, description, photos) VALUES (?, ?, ?, ?)`,
      args: [v.id, v.name, v.description, v.photos],
    });
  }

  // 2. Seed Admin
  await db.execute({
    sql: `INSERT OR REPLACE INTO admins (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)`,
    args: [
      INITIAL_ADMIN.id,
      INITIAL_ADMIN.email,
      INITIAL_ADMIN.password_hash,
      INITIAL_ADMIN.name,
      now,
    ],
  });

  // 3. Seed Events
  for (const e of INITIAL_EVENTS) {
    await db.execute({
      sql: `
        INSERT OR REPLACE INTO events (
          id, slug, title, category, description, venue_id, starts_at, ends_at,
          publication_status, featured_slot, cover_url, cover_alt, price_idr,
          admission_mode, registration_url, attendance_note, is_demo, version,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
      args: [
        e.id, e.slug, e.title, e.category, e.description, e.venue_id, e.starts_at, e.ends_at,
        e.publication_status, e.featured_slot, e.cover_url, e.cover_alt, e.price_idr,
        e.admission_mode, e.registration_url, e.attendance_note, e.is_demo, now, now
      ],
    });
  }

  // 4. Seed Performers
  await db.execute({
    sql: 'DELETE FROM performers WHERE event_id = ?',
    args: ['ev_batik_motif'],
  });

  for (const p of INITIAL_PERFORMERS) {
    await db.execute({
      sql: `
        INSERT INTO performers (id, event_id, name, bio, portrait_url, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [p.id, p.event_id, p.name, p.bio, p.portrait_url, p.sort_order],
    });
  }

  // 5. Seed Gallery
  await db.execute({
    sql: 'DELETE FROM event_galleries WHERE event_id = ?',
    args: ['ev_batik_motif'],
  });

  for (const g of INITIAL_GALLERY) {
    await db.execute({
      sql: `
        INSERT INTO event_galleries (id, event_id, image_url, alt_text, caption, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [g.id, g.event_id, g.url, g.alt, g.caption, g.order],
    });
  }
}
