import http from 'http';
import { getDb, initDb } from '../src/lib/db';
import {
  getPublicEvents,
  getEventBySlug,
  getUpcomingHeroEvents,
  getFeaturedEvents,
  rescheduleEvent,
  softDeleteEvent,
  validateEventForPublication,
  getAdminEvents,
} from '../src/lib/events';
import { isEventEnded } from '../src/lib/date';

async function testAcceptance() {
  console.log('=== MEMULAI PENGUJIAN KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA) ===\n');
  await initDb();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testId: string, desc: string) {
    if (condition) {
      console.log(`[PASS] ${testId}: ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testId}: ${desc}`);
      failed++;
    }
  }

  // U01 & U18: Test public homepage HTML & absence of admin links
  const homeHtml = await new Promise<string>((resolve) => {
    http.get('http://localhost:3000/', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
  });

  assert(
    homeHtml.includes('Agenda 2027') && homeHtml.includes('Grand Hotel De Djokja'),
    'U01',
    'Beranda memuat judul utama Agenda 2027 dan nama hotel'
  );

  assert(
    !homeHtml.includes('/admin/login') && !homeHtml.includes('/admin/acara'),
    'U18',
    'Seluruh antarmuka publik bebas dari tautan atau tombol masuk admin'
  );

  // U02: All months have 8 published events, April has 2, April + Budaya has 1 ("Membaca Motif Batik")
  const allEvents = await getPublicEvents();
  assert(allEvents.length === 8, 'U02-1', 'Semua bulan pada data awal berisi 8 acara terbit');

  const aprilEvents = await getPublicEvents({ month: '04' });
  assert(aprilEvents.length === 2, 'U02-2', 'Bulan April awal berisi 2 acara');

  const aprilBudaya = await getPublicEvents({ month: '04', category: 'budaya' });
  assert(
    aprilBudaya.length === 1 && aprilBudaya[0].slug === 'membaca-motif-batik',
    'U02-3',
    'Filter April + Budaya hanya menghasilkan "Membaca Motif Batik"'
  );

  // U03: Search & filter queries
  const meiEvents = await getPublicEvents({ month: '05' });
  assert(meiEvents.length === 0, 'U03', 'Bulan Mei awal kosong (belum ada acara diumumkan)');

  // U04: Event Detail Page
  const batikEvent = await getEventBySlug('membaca-motif-batik');
  assert(
    Boolean(
      batikEvent &&
      batikEvent.performers?.length === 2 &&
      batikEvent.gallery?.length === 3 &&
      batikEvent.gallery[0].caption?.includes('Ilustrasi kegiatan')
    ),
    'U04-1',
    'Detail batik memuat dua profil pengisi acara dan tiga foto galeri ber-caption'
  );

  const pianoEvent = await getEventBySlug('senja-di-tuts-piano');
  assert(
    Boolean(pianoEvent && (!pianoEvent.performers || pianoEvent.performers.length === 0)),
    'U04-2',
    'Acara tanpa pengisi acara/galeri tetap rapi dan valid'
  );

  // U05: Admin authentication & draft visibility
  const unauthCheck = await fetch('http://localhost:3000/api/admin/events');
  assert(unauthCheck.status === 401, 'U05-1', 'Akses ke API admin tanpa sesi ditolak (401)');

  const adminEvents = await getAdminEvents();
  const draftEvent = adminEvents.find((e) => e.publication_status === 'draft');
  assert(
    Boolean(draftEvent && draftEvent.title === 'Lokakarya Cetak Daun'),
    'U05-2',
    'Admin dapat melihat draf "Lokakarya Cetak Daun" yang tidak muncul di publik'
  );

  // U06: Validation when publishing draft without required fields
  const pubValidationNoTime = validateEventForPublication({
    title: 'Acara Tanpa Waktu',
    starts_at: undefined,
  });
  assert(
    !pubValidationNoTime.valid && !!pubValidationNoTime.errors.starts_at,
    'U06-1',
    'Publikasi tanpa waktu ditolak oleh validasi server'
  );

  const pubValidationNoCover = validateEventForPublication({
    title: 'Acara Tanpa Cover',
    category: 'Musik',
    description: 'Deskripsi panjang acara...',
    venue_id: 'beranda',
    starts_at: '2027-05-10T18:00:00+07:00',
    ends_at: '2027-05-10T20:00:00+07:00',
    cover_url: '',
    price_idr: 0,
    admission_mode: 'walk_in',
  });
  assert(
    !pubValidationNoCover.valid && !!pubValidationNoCover.errors.cover_url,
    'U06-2',
    'Publikasi tanpa foto sampul ditolak oleh validasi server'
  );

  // U08: Reschedule validation - end before start or year 2028
  const resInvalidEnd = await rescheduleEvent({
    eventId: 'ev_batik_motif',
    newStartsAt: '2027-04-17T11:00:00+07:00',
    newEndsAt: '2027-04-17T09:00:00+07:00',
    reason: 'Uji waktu selesai sebelum mulai',
    adminId: 'admin_1',
    version: batikEvent!.version,
  });
  assert(!resInvalidEnd.success, 'U08-1', 'Reschedule dengan waktu selesai sebelum mulai ditolak');

  const resInvalidYear = await rescheduleEvent({
    eventId: 'ev_batik_motif',
    newStartsAt: '2028-04-17T09:00:00+07:00',
    newEndsAt: '2028-04-17T11:00:00+07:00',
    reason: 'Uji tahun 2028',
    adminId: 'admin_1',
    version: batikEvent!.version,
  });
  assert(!resInvalidYear.success, 'U08-2', 'Reschedule dengan tahun mulai di luar 2027 ditolak');

  // U07: Reschedule "Membaca Motif Batik" from 17 Apr to 8 Mei
  const resValid = await rescheduleEvent({
    eventId: 'ev_batik_motif',
    newStartsAt: '2027-05-08T13:00:00+07:00',
    newEndsAt: '2027-05-08T15:00:00+07:00',
    reason: 'Penyesuaian jadwal fasilitator',
    adminId: 'admin_1',
    version: batikEvent!.version,
  });
  assert(resValid.success, 'U07-1', 'Reschedule "Membaca Motif Batik" ke 8 Mei 2027 berhasil');

  const aprilAfterRes = await getPublicEvents({ month: '04' });
  const meiAfterRes = await getPublicEvents({ month: '05' });
  assert(
    aprilAfterRes.length === 1 && meiAfterRes.length === 1,
    'U07-2',
    'April berkurang jadi 1 acara, Mei bertambah jadi 1 acara'
  );

  const batikDetailRescheduled = await getEventBySlug('membaca-motif-batik');
  assert(
    Boolean(
      batikDetailRescheduled?.latest_schedule_change &&
      batikDetailRescheduled.has_schedule_changed === true
    ),
    'U07-3',
    'Detail acara menampilkan jadwal baru dan riwayat waktu sebelumnya'
  );

  // U10: Test event ended relative to simulated time
  const timeOngoing = new Date('2028-01-01T00:15:00+07:00');
  const timeEnded = new Date('2028-01-01T00:30:00+07:00');
  const endsAtYearEnd = '2028-01-01T00:30:00+07:00';

  assert(
    !isEventEnded(endsAtYearEnd, timeOngoing),
    'U10-1',
    'Pada 1 Jan 2028 00.15 WIB acara akhir tahun masih berlangsung'
  );
  assert(
    isEventEnded(endsAtYearEnd, timeEnded),
    'U10-2',
    'Pada 1 Jan 2028 00.30 WIB acara akhir tahun telah selesai (Acara selesai)'
  );

  // U12: Optimistic concurrency check (version mismatch)
  const staleReschedule = await rescheduleEvent({
    eventId: 'ev_batik_motif',
    newStartsAt: '2027-05-15T13:00:00+07:00',
    newEndsAt: '2027-05-15T15:00:00+07:00',
    reason: 'Uji concurrency',
    adminId: 'admin_1',
    version: 1,
  });
  assert(
    Boolean(!staleReschedule.success && staleReschedule.error?.includes('sudah diperbarui')),
    'U12',
    'Perubahan dengan versi kedaluwarsa ditolak dengan pesan konflik'
  );

  // U09: Soft Delete test
  const currentBatik = await getEventBySlug('membaca-motif-batik');
  const delRes = await softDeleteEvent('ev_batik_motif', currentBatik!.version);
  assert(delRes.success, 'U09-1', 'Soft delete acara batik berhasil');

  const batikAfterDel = await getEventBySlug('membaca-motif-batik');
  assert(batikAfterDel === null, 'U09-2', 'Acara terhapus tidak dapat diakses di publik (/acara/[slug] null)');

  console.log(`\n=== HASIL PENGUJIAN: ${passed} LULUS, ${failed} GAGAL ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

testAcceptance().catch((err) => {
  console.error('Error in acceptance test:', err);
  process.exit(1);
});
