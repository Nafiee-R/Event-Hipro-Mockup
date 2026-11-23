import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { initDb, getDb } from '../src/lib/db';

// Ensure public directories exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
const venuesDir = path.join(imagesDir, 'venues');
const eventsDir = path.join(imagesDir, 'events');
const performersDir = path.join(imagesDir, 'performers');
const galleryDir = path.join(imagesDir, 'gallery');

[imagesDir, venuesDir, eventsDir, performersDir, galleryDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to create an evocative SVG image
function createThemedSvg(
  filename: string,
  title: string,
  subtitle: string,
  accentColor: string,
  gradientStart: string,
  gradientEnd: string,
  pattern: 'batik' | 'architectural' | 'music' | 'culinary' | 'performer'
) {
  let motif = '';
  if (pattern === 'batik') {
    motif = `
      <g opacity="0.18" stroke="${accentColor}" stroke-width="1.5" fill="none">
        <path d="M-50,150 Q100,50 250,150 T550,150 T850,150" />
        <path d="M-50,250 Q100,150 250,250 T550,250 T850,250" />
        <circle cx="200" cy="180" r="40" />
        <circle cx="200" cy="180" r="20" />
        <circle cx="400" cy="180" r="40" />
        <circle cx="400" cy="180" r="20" />
        <circle cx="600" cy="180" r="40" />
        <circle cx="600" cy="180" r="20" />
        <path d="M160,180 L240,180 M200,140 L200,220" />
        <path d="M360,180 L440,180 M400,140 L400,220" />
        <path d="M560,180 L640,180 M600,140 L600,220" />
      </g>
    `;
  } else if (pattern === 'architectural') {
    motif = `
      <g opacity="0.15" stroke="${accentColor}" stroke-width="2" fill="none">
        <polygon points="400,60 150,220 650,220" />
        <polygon points="400,90 220,220 580,220" />
        <line x1="250" y1="220" x2="250" y2="450" />
        <line x1="350" y1="220" x2="350" y2="450" />
        <line x1="450" y1="220" x2="450" y2="450" />
        <line x1="550" y1="220" x2="550" y2="450" />
        <rect x="180" y="320" width="440" height="15" fill="${accentColor}" opacity="0.3" />
      </g>
    `;
  } else if (pattern === 'music') {
    motif = `
      <g opacity="0.18" stroke="${accentColor}" stroke-width="2" fill="none">
        <circle cx="300" cy="220" r="60" />
        <circle cx="500" cy="200" r="70" />
        <path d="M360,220 C360,120 440,100 440,60" />
        <path d="M570,200 C570,90 440,100 440,60" />
        <line x1="100" y1="360" x2="700" y2="360" stroke-width="1" />
        <line x1="100" y1="380" x2="700" y2="380" stroke-width="1" />
        <line x1="100" y1="400" x2="700" y2="400" stroke-width="1" />
      </g>
    `;
  } else if (pattern === 'culinary') {
    motif = `
      <g opacity="0.15" stroke="${accentColor}" stroke-width="2" fill="none">
        <ellipse cx="400" cy="280" rx="180" ry="70" />
        <ellipse cx="400" cy="275" rx="140" ry="50" />
        <path d="M320,200 Q400,160 480,200" />
        <circle cx="370" cy="270" r="15" fill="${accentColor}" opacity="0.3" />
        <circle cx="430" cy="275" r="18" fill="${accentColor}" opacity="0.3" />
        <circle cx="400" cy="260" r="12" fill="${accentColor}" opacity="0.3" />
      </g>
    `;
  } else {
    motif = `
      <g opacity="0.2" fill="${accentColor}">
        <circle cx="400" cy="180" r="60" />
        <path d="M300,340 C300,260 500,260 500,340 Z" />
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="50%" stop-color="#1D232A" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      <linearGradient id="overlay" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#11151C" stop-opacity="0.9" />
        <stop offset="60%" stop-color="#11151C" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#11151C" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#grad)" />
    ${motif}
    <rect width="800" height="500" fill="url(#overlay)" />
    <g transform="translate(48, 380)">
      <rect x="0" y="-30" width="120" height="4" fill="${accentColor}" />
      <text x="0" y="10" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-weight="600" fill="#F6EFE3" letter-spacing="1">
        ${title}
      </text>
      <text x="0" y="42" font-family="'Source Sans 3', sans-serif" font-size="16" fill="#C8C1B7" letter-spacing="0.5">
        ${subtitle} · Ilustrasi suasana
      </text>
    </g>
  </svg>`;

  fs.writeFileSync(filename, svg, 'utf-8');
}

async function seed() {
  console.log('--- Inisialisasi Database Grand Hotel De Djokja ---');
  await initDb();
  const db = getDb();

  // Create demo SVG assets
  console.log('Membuat aset visual heritage...');

  // Venue photos (3 venues x 2 photos each for carousel testing)
  createThemedSvg(
    path.join(venuesDir, 'beranda-1.svg'),
    'Beranda Barat',
    'Teras Tegel Klasik & Angin Senja',
    '#E1B878',
    '#32221A',
    '#11151C',
    'architectural'
  );
  createThemedSvg(
    path.join(venuesDir, 'beranda-2.svg'),
    'Selasar Beranda',
    'Sudut Teduh Teras Heritage',
    '#E1B878',
    '#231D24',
    '#11151C',
    'architectural'
  );

  createThemedSvg(
    path.join(venuesDir, 'ruang-jamuan-1.svg'),
    'Ruang Jamuan Utama',
    'Lampu Kuningan & Meja Panjang',
    '#D4A35B',
    '#35241E',
    '#1A161E',
    'culinary'
  );
  createThemedSvg(
    path.join(venuesDir, 'ruang-jamuan-2.svg'),
    'Sudut Jamuan Rasa',
    'Koleksi Rempah & Keramik Antik',
    '#D4A35B',
    '#2B231B',
    '#11151C',
    'culinary'
  );

  createThemedSvg(
    path.join(venuesDir, 'pendopo-1.svg'),
    'Pendopo Agung',
    'Tumpangsari Kayu Jati & Suasana Sakral',
    '#E1B878',
    '#3B2217',
    '#121820',
    'architectural'
  );
  createThemedSvg(
    path.join(venuesDir, 'pendopo-2.svg'),
    'Plataran Pendopo',
    'Ruang Pagelaran Terbuka',
    '#E1B878',
    '#261B2E',
    '#11151C',
    'batik'
  );

  // Event covers
  createThemedSvg(
    path.join(eventsDir, 'keroncong.svg'),
    'Keroncong di Beranda',
    'Denting Cello & Cak Cuk di Waktu Senja',
    '#E1B878',
    '#3A2419',
    '#161B26',
    'music'
  );
  createThemedSvg(
    path.join(eventsDir, 'meja-rasa.svg'),
    'Meja Rasa Yogyakarta',
    'Eksplorasi Kuliner Warisan Mataram',
    '#D4A35B',
    '#3D251C',
    '#1A2228',
    'culinary'
  );
  createThemedSvg(
    path.join(eventsDir, 'batik.svg'),
    'Membaca Motif Batik',
    'Filosofi Garis & Canting Pendopo',
    '#E1B878',
    '#442618',
    '#1A202C',
    'batik'
  );
  createThemedSvg(
    path.join(eventsDir, 'piano.svg'),
    'Senja di Tuts Piano',
    'Resital Klasik Akustik Ruang Terbuka',
    '#E1B878',
    '#2B2438',
    '#11151C',
    'music'
  );
  createThemedSvg(
    path.join(eventsDir, 'rempah.svg'),
    'Jamuan Rempah Jawa',
    'Kisah Bumbu Nusantara dalam Sajian Sore',
    '#D4A35B',
    '#3E271A',
    '#191C22',
    'culinary'
  );
  createThemedSvg(
    path.join(eventsDir, 'lurik.svg'),
    'Cerita dari Kain Lurik',
    'Tenun Tradisi Garis Bersahaja',
    '#E1B878',
    '#322822',
    '#141920',
    'batik'
  );
  createThemedSvg(
    path.join(eventsDir, 'sketsa.svg'),
    'Sketsa Sore di Beranda',
    'Menangkap Sudut Kolonial dengan Tinta',
    '#E1B878',
    '#2C2D35',
    '#11151C',
    'architectural'
  );
  createThemedSvg(
    path.join(eventsDir, 'tahun-baru.svg'),
    'Musik di Penghujung Tahun',
    'Malam Pergantian Tahun Berlatar Joglo',
    '#E1B878',
    '#4A2E1C',
    '#161B2A',
    'music'
  );

  // Gallery for Batik
  createThemedSvg(
    path.join(galleryDir, 'batik-kain.svg'),
    'Detail Kain Batik',
    'Guratan Malam & Cecek Halus',
    '#E1B878',
    '#3A241B',
    '#11151C',
    'batik'
  );
  createThemedSvg(
    path.join(galleryDir, 'batik-tangan.svg'),
    'Tangan Menggambar',
    'Goresan Canting di Atas Morin',
    '#E1B878',
    '#33241D',
    '#11151C',
    'batik'
  );
  createThemedSvg(
    path.join(galleryDir, 'batik-meja.svg'),
    'Meja Kerja Pendopo',
    'Alat Gambar, Wajan Kecil & Lilin Alami',
    '#E1B878',
    '#2B231D',
    '#11151C',
    'architectural'
  );

  // Performers
  createThemedSvg(
    path.join(performersDir, 'raras.svg'),
    'Raras',
    'Fasilitator Motif Tradisi',
    '#E1B878',
    '#3D271D',
    '#191B22',
    'performer'
  );
  createThemedSvg(
    path.join(performersDir, 'damar.svg'),
    'Damar',
    'Pemandu Sesi Sketsa Pola',
    '#E1B878',
    '#2A2E38',
    '#12161E',
    'performer'
  );

  // 1. Seed Venues
  console.log('Menyimpan data Ruang Acara (Venues)...');
  const venues = [
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

  for (const v of venues) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO venues (id, name, description, photos) VALUES (?, ?, ?, ?)`,
      args: [v.id, v.name, v.description, v.photos],
    });
  }

  // 2. Seed Admin
  console.log('Menyiapkan akun Administrator demo...');
  const passwordHash = await bcrypt.hash('AdminDjokja2027!', 10);
  await db.execute({
    sql: `INSERT OR REPLACE INTO admins (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)`,
    args: [
      'admin_1',
      'admin@grandhotel.id',
      passwordHash,
      'Tim Event Grand Hotel De Djokja',
      new Date().toISOString(),
    ],
  });

  // 3. Seed Events from Section 7
  console.log('Menyimpan acara contoh prototipe Agenda 2027...');
  const now = new Date().toISOString();

  const eventsData = [
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
      description: '',
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

  for (const e of eventsData) {
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

  // 4. Seed Performers for "Membaca Motif Batik"
  console.log('Menyimpan profil pengisi acara Membaca Motif Batik...');
  await db.execute({
    sql: 'DELETE FROM performers WHERE event_id = ?',
    args: ['ev_batik_motif'],
  });

  await db.execute({
    sql: `
      INSERT INTO performers (id, event_id, name, bio, portrait_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      'perf_raras',
      'ev_batik_motif',
      'Raras',
      'Fasilitator motif dan pegiat batik tulis Yogyakarta dengan pengalaman lebih dari 15 tahun.',
      '/images/performers/raras.svg',
      1,
    ],
  });

  await db.execute({
    sql: `
      INSERT INTO performers (id, event_id, name, bio, portrait_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      'perf_damar',
      'ev_batik_motif',
      'Damar',
      'Pemandu sesi sketsa pola dan desainer tekstil independen di Kotagede.',
      '/images/performers/damar.svg',
      2,
    ],
  });

  // 5. Seed Gallery for "Membaca Motif Batik"
  console.log('Menyimpan galeri Membaca Motif Batik...');
  await db.execute({
    sql: 'DELETE FROM event_galleries WHERE event_id = ?',
    args: ['ev_batik_motif'],
  });

  const galleryItems = [
    {
      id: 'gal_batik_1',
      url: '/images/gallery/batik-kain.svg',
      alt: 'Detail kain batik tulis',
      caption: 'Detail kain · Ilustrasi kegiatan',
      order: 1,
    },
    {
      id: 'gal_batik_2',
      url: '/images/gallery/batik-tangan.svg',
      alt: 'Tangan menggambar motif batik',
      caption: 'Tangan menggambar · Ilustrasi kegiatan',
      order: 2,
    },
    {
      id: 'gal_batik_3',
      url: '/images/gallery/batik-meja.svg',
      alt: 'Meja kerja pendopo untuk lokakarya',
      caption: 'Meja kerja pendopo · Ilustrasi kegiatan',
      order: 3,
    },
  ];

  for (const item of galleryItems) {
    await db.execute({
      sql: `
        INSERT INTO event_galleries (id, event_id, image_url, alt_text, caption, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [item.id, 'ev_batik_motif', item.url, item.alt, item.caption, item.order],
    });
  }

  console.log('--- Database Seed Selesai dengan Sukses! ---');
  console.log('Akun Admin Demo: admin@grandhotel.id / AdminDjokja2027!');
  console.log('Total Acara Terbit: 8 | Total Draf: 1 | Ruang Acara: 3');
}

seed().catch((err) => {
  console.error('Gagal menjalankan seed:', err);
  process.exit(1);
});
