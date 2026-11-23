# Agenda 2027 · Grand Hotel De Djokja

Mockup website interaktif untuk **Action Learning Project (ALP) HIPRO / InJourney**.

Aplikasi ini menyajikan program budaya, kuliner, musik, dan komunitas di Grand Hotel De Djokja, Yogyakarta untuk tahun 2027. Dilengkapi dengan antarmuka publik responsif (dioptimalkan untuk Desktop, Tablet, dan Mobile/iOS Safari) serta ruang kerja admin mandiri yang terhubung langsung ke basis data persisten SQLite.

---

## Fitur Utama

1. **Beranda Heritage Sentuhan Senja**:
   - Hero foto senja (*Lavender Dusk*) beresolusi tinggi dengan tipografi serif klasik (*Cormorant Garamond*) dan aksen kuningan (*brass* `#E1B878`).
   - Panel pintar **Acara Terdekat** (menampilkan hingga 3 acara terdekat berdasarkan waktu WIB).
   - Indeks **Agenda Tahunan** 12 bulan dengan filter kombinasi: Bulan (menu dropdown responsif di ponsel/iOS), Kategori, Ruang Acara, dan Pencarian kata kunci real-time.
   - Dua kartu **Pilihan Program** bernuansa gading (*editorial highlight*).
   - Bagian **Ruang Acara** dengan galeri foto independen dan tombol pintas filter langsung ke agenda.

2. **Halaman Detail Acara (`/acara/[slug]`)**:
   - Spanduk panorama (rasio 3:1 desktop, 16:10 ponsel).
   - Kolom praktis: Waktu WIB, status perubahan jadwal (*Sebelumnya...*), lokasi, biaya masuk (IDR / Gratis), dan cara hadir (*Datang langsung / Tautan resmi / Info menyusul*).
   - Profil pengisi acara (musisi, perajin, atau koki).
   - Galeri asimetris rasio 2:1:1 dengan takarir (*caption*).

3. **Ruang Kerja Admin Mandiri (`/admin/login` & `/admin/acara`)**:
   - **Keamanan Publik**: Tidak ada satu pun tautan/tombol admin di antarmuka publik (header, footer, dan menu mobile 100% bersih).
   - Akses via URL langsung `/admin/login` dengan sesi server aman (*HttpOnly cookie*).
   - **Formulir Acara Lengkap**:
     - Judul, Kategori.
     - **Foto Acara**: Unggah foto sampul dan galeri langsung dari perangkat (drag & drop / file picker), pratinjau desktop & ponsel, teks alternatif, hapus, dan atur urutan (hingga 8 foto). Validasi otomatis (JPEG, PNG, WebP maks 5 MB).
     - Narasi, Ruang acara, Waktu mulai & selesai WIB (wajib tahun 2027).
     - Alur **Jadwal Ulang (Reschedule)** resmi yang mencatat riwayat perubahan dan alasan internal secara atomik.
     - Penghapusan aman (*Soft delete*) dengan konfirmasi dialog.
     - Kontrol konkurensi optimistik (*versioning*).

---

## Petunjuk Penggunaan & Instalasi (Windows tanpa Docker)

### 1. Kebutuhan Sistem
- Node.js versi 18 atau lebih baru (disarankan Node.js v20/v22).
- Sistem Operasi: Windows 10/11 (atau macOS / Linux).
- Tidak memerlukan Docker, compiler C++, maupun instalasi server database eksternal.

### 2. Instalasi Dependensi
Jalankan di terminal workspace:
```bash
npm install
```

### 3. Inisialisasi & Seed Database
Perintah ini akan membuat skema SQLite di folder `data/events.db`, aset grafis heritage di `public/images/`, dan mengisi data awal prototipe (8 acara terbit, 1 draf):
```bash
npm run seed
```

### 4. Menjalankan Aplikasi
Mode Produksi (tercepat & stabil):
```bash
npm run build
npm start
```
Atau Mode Pengembangan (Hot-reload):
```bash
npm run dev
```
Buka browser di: **`http://localhost:3000`**

---

## Kredensial Akun Administrator Demo

- **URL Masuk Admin**: `http://localhost:3000/admin/login`
- **Email**: `admin@grandhotel.id`
- **Kata Sandi**: `AdminDjokja2027!`
*(Tersedia tombol satu-klik "Isi otomatis" di halaman login untuk kemudahan demonstrasi)*

---

## Skenario Presentasi Tiga Menit (ALP Demo Walkthrough)

1. **Menjelajah Beranda (Calon Tamu)**:
   - Buka `http://localhost:3000/`.
   - Lihat suasana senja, klik **Jelajahi agenda**.
   - Pilih bulan **April** dan kategori **Budaya**; daftar menyaring menjadi acara **"Membaca Motif Batik"**.
   - Klik **Buka detail** untuk melihat narasi, jam WIB, profil pengisi acara (Raras & Damar), serta galeri 3 foto. Simpan / salin URL halaman ini.

2. **Pembaruan oleh Tim Event (Admin)**:
   - Di tab baru, buka `http://localhost:3000/admin/login` dan klik tombol **Isi otomatis** lalu **Masuk**.
   - Di daftar acara, klik tombol **Jadwal** (ikon jam) pada acara "Membaca Motif Batik".
   - Pindahkan tanggal ke **8 Mei 2027** pukul **13.00–15.00 WIB**, isi alasan internal (misal: *"Penyesuaian jadwal fasilitator"*), dan konfirmasi.

3. **Verifikasi Publik Real-time**:
   - Kembali ke tab detail acara tadi dan muat ulang (*refresh*).
   - Perhatikan: URL slug tetap sama, jadwal utama berubah menjadi **8 Mei**, dan muncul kotak riwayat penanda: *"Sebelumnya: 17 April 2027 · 09.00–11.00 WIB"*.
   - Kembali ke beranda: bulan April kini berkurang satu acara, dan bulan Mei kini memiliki acara batik tersebut tanpa duplikasi.

---

## Hasil Pengujian Kriteria Penerimaan (Acceptance Criteria)

Pengujian otomatis dijalankan melalui script `npx tsx scripts/test-acceptance.ts`:

| ID | Pengujian | Hasil | Catatan |
|---|---|---|---|
| **U01** | Beranda responsif desktop (1440px) & ponsel (390px) | **PASS** | Teks judul terbaca, panel samping rapi, bebas horizontal scroll |
| **U02** | Filter kombinasi bulan & kategori | **PASS** | April awal berisi 2 acara; April + Budaya hanya menampilkan batik |
| **U03** | Tautan filter dan bulan kosong | **PASS** | Parameter URL sinkron; Mei menampilkan status belum ada acara |
| **U04** | Detail kaya (Batik) vs Detail minimal | **PASS** | Profil, galeri, dan metadata tampil proporsional tanpa error |
| **U05** | Proteksi rute admin & visibilitas draf | **PASS** | Akses tanpa sesi ditolak (401); draf hanya terlihat oleh admin |
| **U06** | Validasi penerbitan draf | **PASS** | Waktu & sampul wajib ada saat diterbitkan; field error ditandai |
| **U07** | Alur jadwal ulang (Reschedule) | **PASS** | Slug tetap, kalender bulan berpindah, riwayat waktu lama tersimpan |
| **U08** | Validasi batas tahun & urutan waktu | **PASS** | Waktu selesai sebelum mulai & tahun selain 2027 ditolak server |
| **U09** | Penghapusan (Soft Delete) | **PASS** | Acara hilang seketika dari publik & sorotan, aman setelah restart |
| **U10** | Jam uji simulasi 2028 | **PASS** | 00.15 WIB masih berlangsung; 00.30 WIB menampilkan "Acara selesai" |
| **U11** | Aksesibilitas keyboard & kontras | **PASS** | Focus ring kuningan tampak jelas, semantic HTML, target sentuh ≥44px |
| **U12** | Kontrol konkurensi versi data | **PASS** | Versi usang dicegah menimpa dengan pesan konflik peringatan |
| **U13** | Status pendaftaran (walk_in, external, pending)| **PASS** | Tautan eksternal HTTPS valid, peringatan keluar situs tersedia |
| **U14** | Galeri ruang acara independen | **PASS** | Tombol panah geser hanya mempengaruhi kartu ruang terkait |
| **U15** | Unggah foto dari perangkat | **PASS** | Berhasil simpan file unik ke storage lokal tanpa menyalin URL |
| **U16** | Urutan & ganti foto galeri | **PASS** | Tombol naik/turun dan hapus foto galeri tersimpan konsisten |
| **U17** | Validasi ukuran & tipe file | **PASS** | File > 5 MB atau tipe selain JPEG/PNG/WebP ditolak dengan pesan jelas |
| **U18** | Privasi URL admin | **PASS** | Seluruh markup publik bebas dari tombol/tautan login admin |

---
*Grand Hotel De Djokja · InJourney Action Learning Project 2026/2027*
