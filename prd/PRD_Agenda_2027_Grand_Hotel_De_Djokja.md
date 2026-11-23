# PRD · Agenda 2027 Grand Hotel De Djokja

**Produk** — Mockup website interaktif untuk Action Learning Project HIPRO / InJourney  
**Versi** — 1.1 · 23 November 2026  
**Pengguna dokumen** — Tim ALP, tim event hotel, dan Antigravity sebagai pelaksana pengembangan  
**Bahasa antarmuka** — Indonesia · **Zona waktu** — Asia/Jakarta (WIB)  
**Hasil yang diminta dari Antigravity** — Website responsif yang dapat dijalankan di laptop, dilengkapi agenda publik dan akses admin yang benar-benar mengubah data.

## 1. Keputusan produk

Seorang warga Jogja ingin memilih kegiatan untuk akhir pekan. Saat membuka situs, ia langsung melihat suasana hotel di waktu senja, dapat memilih bulan kunjungannya, lalu membuka satu acara untuk mengetahui waktu, tempat, dan cara hadir. Jika tim hotel memindahkan acara, tautan yang sudah tersimpan di ponselnya tetap membuka acara yang sama dengan tanggal terbaru.

Bagi tim ALP, mockup ini memperlihatkan bagaimana program budaya, kuliner, dan komunitas hotel dapat ditemukan tamu menginap maupun pengunjung dari luar. Bagi tim hotel, satu agenda terbit menjadi sumber informasi untuk halaman depan, jadwal tahunan, dan detail acara. Dampak terhadap pendapatan memerlukan data reservasi dan transaksi tersendiri.

| Pengguna | Pertanyaan utama | Hasil yang harus terlihat dalam demo |
|---|---|---|
| Calon tamu dan warga lokal | “Apa yang bisa saya ikuti saat berada di Jogja?” | Menemukan acara menurut bulan dan jenis kegiatan, lalu mengetahui jadwal serta cara hadir dari ponsel. |
| Front office dan concierge | “Tautan mana yang bisa saya bagikan?” | Membuka URL acara langsung dan melihat jadwal terbarunya setelah reschedule. |
| Admin event atau marketing | “Bisakah saya memperbarui agenda tanpa meminta bantuan pengembang?” | Menambah, menerbitkan, mengubah jadwal, dan menghapus acara lewat formulir. Data bertahan setelah aplikasi dimulai ulang. |

**Ukuran keberhasilan saat uji ALP.** Usulan target untuk diuji dengan tugas nyata: 4 dari 5 peserta dapat menemukan jam dan lokasi acara pada bulan tertentu dalam 60 detik dari beranda. Seorang staf dapat memindahkan acara lintas bulan dalam 2 menit. Seluruh hasil publik sesuai setelah perubahan disimpan. Catat waktu, langkah yang membingungkan, dan hasilnya. Angka ini merupakan target pengujian.

**Batas versi pertama.** Termasuk agenda 12 bulan, detail acara, tempat acara, profil pengisi acara, galeri, pencarian, filter, dan pengelolaan event oleh satu peran admin. Pendaftaran bisa mengarah ke tautan resmi per acara. Penjualan tiket, pembayaran, pengumpulan data peserta, inventori kamar, notifikasi pelanggan, dan dashboard pendapatan berada di luar lingkup mockup.

## 2. Peta tampilan dari tujuh foto

Ketujuh screenshot (`image(3).png` sampai `image(9).png`) hanya menjadi referensi tata letak, warna, dan suasana. Simpan lampiran di folder referensi desain di luar direktori publik. Seluruh hero, sampul, foto ruang, galeri, dan gambar pengganti menggunakan aset tersendiri. Identitas hotel dibangun lewat fotografi Jogja, tipografi serif, warna kuningan, dan bahasa Indonesia. Gunakan karya visual milik hotel, berlisensi, atau ilustrasi demo yang diberi keterangan. Simpan aset yang digunakan bersama proyek agar demo tetap berfungsi saat tautan eksternal berubah.

| Lampiran | Ciri yang dipakai | Penerapan spesifik |
|---|---|---|
| `image(4).png` · Dusk | Hero berupa lanskap senja memenuhi lebar layar. Judul besar di kiri, panel gelap tembus pandang di kanan. | Latar berupa teras atau fasad bergaya heritage dalam cahaya sore. Kiri memuat “Agenda 2027”; kanan menampilkan maksimal tiga acara terdekat dengan tanggal yang mudah dipindai. |
| `image(5).png` · Dusk | Dua bidang di atas latar gelap. Navigasi di kiri, baris informasi dalam panel di kanan. | Indeks bulan di kiri agenda, daftar acara di kanan. Garis pemisah dan penanda bulan aktif membantu mata mengikuti baris. |
| `image(6).png` · Dusk | Dua panel terang berdampingan dengan isi berjarak lega. | Di bawah agenda, dua sorotan editorial berlatar gading, masing-masing berisi foto lanskap dan satu acara pilihan admin. Sembunyikan bagian jika belum ada pilihan. |
| `image(3).png` · Potato Head | Tiga kartu tempat sejajar. Foto di atas, judul dan deskripsi di bawah, panah di sisi foto. | Bagian “Ruang acara” memakai tiga kolom desktop. Panah mengganti foto di kartu itu saja. Nama ruang membuka agenda terfilter tempat. |
| `image(9).png` · Potato Head | Foto panorama di atas. Di bawahnya, judul, metadata dan tombol di kiri, narasi memanjang di kanan. | Jadikan ini susunan utama halaman detail. Tanggal, jam WIB, tempat, harga, dan cara hadir terbaca dalam satu kelompok. |
| `image(8).png` · Potato Head | Profil pengisi acara berjajar dengan potret bulat, nama, dan bio pendek. | Setelah narasi, tampilkan “Pengisi acara” berisi musisi, perajin, koki, atau komunitas yang terkait dengan event tersebut. |
| `image(7).png` · Potato Head | Galeri asimetris dengan satu foto utama lebar dan dua foto pendamping. | Letakkan galeri paling bawah pada detail. Gunakan rasio kolom 2:1:1 dan keterangan yang membedakan ilustrasi, dokumentasi edisi lalu, atau foto tempat. |

**Acuan daring.** Komposisi visual terperinci mengikuti lampiran pengguna. Referensi atmosfer dan panel: [Hallmark Dusk](https://www.usehallmark.com/themes/dusk/). Referensi pengalaman menjelajah program dan fotografi: [Potato Head Music](https://seminyak.potatohead.co/music). Nama hotel mengikuti halaman “GRAND HOTEL DE DJOKJA” dalam *Profile HIPro_merged.pdf*.

## 3. Arah seni dan tampilan responsif

**Kesan pertama.** Bayangkan membuka buku acara yang diletakkan di meja concierge menjelang petang. Di foto lebar, cahaya kuning dari teras masih terlihat di bawah langit tembaga. Judul serif berada pada bagian foto yang tenang. Setelah pengunjung menggulir, warna langit berangsur hilang ke latar biru tinta dan perhatian berpindah ke tanggal acara.

| Elemen | Spesifikasi implementasi |
|---|---|
| Latar | Tinta malam `#11151C` untuk halaman dan `#1D232A` untuk panel. Di hero gunakan foto dengan gradasi gelap pada sisi teks dan bagian bawah. Fallback berupa gradasi tembaga–nila. |
| Teks & aksen | Gading `#F6EFE3` untuk judul di atas gelap, abu hangat `#C8C1B7` untuk metadata, kuningan `#E1B878` untuk CTA utama dengan teks tinta. Gunakan gading sebagai latar dua sorotan dengan teks tinta. |
| Huruf | Cormorant Garamond SemiBold untuk judul utama dan nama acara, dengan Georgia sebagai fallback. Gunakan Source Sans 3 atau sans-serif sistem untuk tanggal, navigasi, narasi, dan admin. H1 desktop 72–92 px, ponsel 44–52 px, teks isi 16–18 px. |
| Detail heritage | Bingkai garis tipis berwarna kuningan dan satu ornamen geometris sederhana pada pemisah bagian. Utamakan tekstur material, teras, tegel, kain, instrumen, dan tangan perajin dalam foto. |
| Komponen | CTA utama berbentuk kapsul, panel agenda bersudut 12 px, gambar editorial 4–8 px. Satu tindakan utama per kelompok. Gunakan tanggal besar dan nama acara sebagai hierarki utama kartu. |
| Desktop ≥ 1024 px | Konten maksimal 1320 px, margin minimum 48 px, jarak bagian 80–96 px. Hero 7:5, agenda 3:9, detail 4:8. Lebar narasi maksimal sekitar 70 karakter per baris. |
| Tablet 768–1023 px | Margin 32 px. Hero tetap dua kolom jika judul dan panel muat. Indeks bulan menjadi pilihan di atas daftar. Kartu tempat dua kolom; kolom terakhir merapat ke kiri. |
| Ponsel < 768 px | Margin 20 px. Urutan hero berupa judul → CTA → panel acara. Bulan memakai select berlabel. Detail berupa foto → judul → jadwal → tombol → narasi. Tempat dan sorotan menjadi satu kolom. Galeri menampilkan foto utama lebar dan dua foto kecil di bawahnya. |

**Aset minimum.** Siapkan satu gambar hero lebar, gambar sampul untuk tiap acara (boleh memakai aset tematik yang sama), serta setidaknya satu acara contoh dengan dua profil dan tiga foto galeri untuk menguji tata letak. Catat sumber dan hak pakai di daftar aset. Foto ilustratif bangunan atau ruang diberi keterangan “Ilustrasi suasana”. Sisakan ruang judul yang aman saat gambar dipotong pada layar sempit.

## 4. Halaman publik dan interaksi

| Rute | Fungsi |
|---|---|
| `/` | Beranda dengan hero, agenda tahunan, pilihan program, ruang acara, dan footer. Tautan “Agenda” menuju `/#agenda`, “Ruang acara” menuju `/#ruang`. Navigasi dan footer hanya memuat informasi pengunjung. |
| `/?bulan=04&kategori=budaya#agenda` | Contoh tautan filter yang dapat dibagikan. Parameter lain yang didukung adalah `q` dan `ruang`. Pilihan awal seluruh tahun. |
| `/acara/[slug]` | Detail yang dapat dibuka langsung atau dibagikan. Slug tetap setelah reschedule atau perubahan judul. |
| `/admin/login` dan `/admin/acara` | Masuk, lihat daftar pengelolaan, cari acara, dan akses tindakan. |
| `/admin/acara/baru` dan `/admin/acara/[id]` | Formulir membuat atau menyunting acara, pratinjau, publikasi, jadwal ulang, dan hapus. |

### Beranda dari atas ke bawah

1. **Header.** Wordmark tipografis “Grand Hotel De Djokja” di kiri dan tautan Agenda serta Ruang acara di kanan. Saat menggulir, header mendapat latar tinta solid. Jika hotel belum memberikan logo, gunakan nama dalam tipografi.
2. **Hero.** H1 “Agenda 2027”. Teks pendamping “Budaya, kuliner, dan pertemuan komunitas di Grand Hotel De Djokja, Yogyakarta.” Tombol “Jelajahi agenda” menggulir ke daftar dan memindahkan fokus ke judul bagian. Panel “Acara terdekat” berisi tanggal, judul, serta ruang; setiap baris membuka detail. Panel mengambil tiga acara terbit yang belum berakhir, urut tanggal mulai. Jika semua acara telah selesai, ganti isi dengan tautan “Lihat arsip 2027”.
3. **Agenda tahunan.** Buka dengan “Semua bulan”, lalu Januari hingga Desember. Daftar lengkap diurutkan kronologis dan dikelompokkan per bulan mulai. Tampilkan tanggal, nama acara, waktu WIB, ruang, dan status jadwal jika berubah. Klik judul menuju detail. Bulan kosong tetap tersedia agar pengunjung tahu bahwa program belum diumumkan.
4. **Pilihan program.** Maksimal dua acara terbit yang dipilih admin, masing-masing menampilkan sampul event terkait dan menaut ke detail. Jika hanya satu, gunakan satu kartu dengan lebar satu kolom. Pemilihan tidak mengubah urutan agenda reguler.
5. **Ruang acara.** Foto rasio 3:2 di atas nama dan deskripsi singkat. Jika foto lebih dari satu, sediakan panah kiri dan kanan dengan nama aksesibel. Klik “Lihat acara di ruang ini” menerapkan filter ruang dan menggulir ke agenda.
6. **Footer.** Nama hotel, Yogyakarta, tautan Agenda dan Ruang acara. Gunakan kontak hotel hanya setelah dikonfirmasi. Saat data contoh digunakan, tampilkan pemberitahuan singkat di atas agenda dan pada detail yang dapat dibuka langsung: “Agenda contoh untuk demonstrasi ALP.”

**Aturan daftar.** Filter bulan, kategori, ruang, dan pencarian judul digabungkan dengan logika AND. Pencarian mengabaikan kapital dan spasi di awal/akhir. Tampilkan jumlah hasil dan tombol “Reset filter”. Tombol kembali browser memulihkan pilihan sebelumnya. Agenda memuat semua acara terbit 2027, termasuk yang selesai. Pada agenda tanpa hasil pencarian tampilkan “Tidak ada acara yang cocok” dan reset; untuk bulan tanpa program tampilkan “Belum ada acara yang diumumkan untuk bulan ini”. Jika pengambilan data gagal, tampilkan “Agenda belum dapat dimuat” dan “Coba lagi”.

### Detail acara

Di atas lipatan halaman gunakan foto sampul milik event tersebut sebagai panorama, dengan rasio sekitar 3:1 desktop dan 16:10 pada ponsel. Di bawahnya, kolom kiri memuat kategori, judul, tanggal lengkap, jam mulai–selesai WIB, ruang, harga atau “Gratis”, dan informasi kehadiran. Kolom kanan memuat deskripsi yang menjawab kegiatan apa yang akan dialami, siapa yang memandu, dan hal yang perlu disiapkan. Di bawah kedua kolom, tempatkan profil pengisi acara lalu galeri. Sembunyikan bagian opsional yang kosong.

| Kondisi | Perilaku pada detail |
|---|---|
| Masuk bebas | Tampilkan “Datang langsung” beserta catatan jika ada. |
| Perlu pendaftaran dan URL resmi tersedia | Tampilkan “Daftar acara” menuju URL terkait. Beri petunjuk bila berpindah ke situs lain. |
| Pendaftaran belum dibuka | Tampilkan “Informasi pendaftaran menyusul”. Dalam mode demo, gunakan kondisi ini untuk contoh berbayar tanpa kontak resmi. |
| Jadwal berubah | Tampilkan waktu terbaru sebagai informasi utama dan “Sebelumnya …” dengan tanggal serta jam lama. Pada daftar cukup tampilkan “Jadwal berubah”. |
| Acara sudah selesai | Detail dan galeri tetap dapat diakses. Gunakan “Acara selesai” dan tutup tindakan pendaftaran. |
| Tautan mengarah ke draf, acara terhapus, atau slug tidak dikenal | Tampilkan halaman “Acara tidak tersedia” dengan tombol kembali ke agenda. |

## 5. Ruang kerja admin

**Masuk.** Staf membuka `/admin/login` melalui URL langsung atau bookmark internal, lalu masuk dengan email dan kata sandi. Landing page dan halaman publik tidak menampilkan tombol, ikon, formulir, atau tautan login admin, termasuk di header, footer, dan menu seluler. Aturan ini juga berlaku saat staf yang sudah login mengunjungi beranda. Sesi dikelola server. Tampilan publik tetap dapat dijelajahi tanpa login. Setelah masuk, admin diarahkan ke daftar acara. Setelah keluar, rute pengelolaan meminta login kembali. Siapkan akun demo melalui konfigurasi lokal dan berikan petunjuk akses di README.

**Daftar.** Judul “Kelola acara 2027” di kiri dan tombol “Tambah acara” di kanan. Setiap baris memuat nama, tanggal dan jam, ruang, status publikasi, dan menu tindakan. Pencarian dan filter bulan/status membantu staf menemukan satu acara. Pada ponsel, tampilkan kartu ringkas dengan tanggal, status, dan menu tindakan yang sama.

| Tindakan | Langkah admin dan hasil |
|---|---|
| Tambah draf | Isi minimal judul lalu “Simpan draf”. Acara masuk daftar admin. Admin dapat melengkapi data dan melihat pratinjau memakai susunan halaman publik. |
| Terbitkan | Lengkapi informasi wajib lalu klik “Terbitkan acara”. Tampilkan kesalahan di dekat field terkait. Jika berhasil, tampilkan tautan “Lihat halaman publik”. |
| Edit | Ubah narasi, tempat, foto, profil, atau pengaturan kehadiran. Untuk acara terbit, “Simpan perubahan” memperbarui tampilan publik. Perubahan tanggal dan jam menggunakan alur jadwal ulang. |
| Jadwal ulang | Tampilkan waktu lama dalam mode baca. Isi tanggal dan waktu baru serta alasan internal singkat. Pratinjau menampilkan “Dari” dan “Menjadi”. Konfirmasi satu kali. Simpan waktu baru dan riwayat perubahan dalam satu transaksi. |
| Hapus | Dialog menyebut nama dan tanggal acara serta akibatnya pada halaman publik. “Kembali” mempertahankan acara. “Hapus acara” melakukan soft delete dan menyembunyikannya dari daftar aktif, panel, sorotan, serta URL publik. |
| Keluar | Akhiri sesi. Membuka ulang URL edit meminta autentikasi. |

### Input foto pada formulir tambah dan edit acara

Letakkan bagian **Foto acara** setelah judul dan kategori. Di ponsel, tombol “Pilih foto dari perangkat” membuka pemilih file. Di desktop, sediakan tombol yang sama dan area tarik-lepas. Admin dapat mengisi seluruh formulir tanpa menyalin URL foto.

| Input | Perilaku yang dibutuhkan |
|---|---|
| Foto sampul | Satu file per acara. Boleh kosong saat menyimpan draf, wajib saat menerbitkan. Setelah dipilih, tampilkan pratinjau potongan desktop dan ponsel, kolom teks alternatif, serta tindakan “Ganti foto”. Untuk acara yang sudah terbit, penggantian berlaku setelah “Simpan perubahan”. |
| Foto galeri | Opsional, maksimal 8 file per acara. Dukung pemilihan beberapa file, pratinjau per foto, teks alternatif, keterangan opsional, tombol geser urutan, dan hapus per foto. Urutan tersimpan menentukan posisi di galeri publik. Dengan satu atau dua foto, galeri menyesuaikan kolom dengan jumlah isi. |
| Format dan umpan balik | Terima JPEG, PNG, atau WebP hingga 5 MB per foto. Tampilkan aturan sebelum pemilihan. Validasi format dan ukuran di server. Tandai file yang ditolak dengan alasannya dan pertahankan file valid serta isian formulir. |
| Simpan dan batal | Pratinjau ditampilkan segera setelah pemilihan. Simpan mengaitkan aset dan urutannya ke ID acara. Jika unggahan gagal atau admin membatalkan perubahan, versi publik sebelumnya tetap tersedia. Jadwal ulang mempertahankan seluruh foto. |

**Perilaku setelah simpan.** Perbarui daftar admin dan data publik dari sumber yang sama. Pengunjung yang membuka, memuat ulang, atau kembali ke agenda setelah penyimpanan mendapat jadwal terbaru. Push langsung ke tab pengunjung yang sedang diam berada di luar lingkup demo. Tombol simpan menampilkan proses, mencegah klik ganda, dan baru mengumumkan sukses setelah data tersimpan. Jika gagal, pertahankan isian dan berikan opsi ulangi.

## 6. Kontrak data dan aturan bisnis

| Entitas | Field inti dan hubungan |
|---|---|
| Event | `id` stabil, `slug` unik dan tetap, `title`, `category`, `description`, `venue_id`, `starts_at`, `ends_at`, `publication_status` (draft/published), `deleted_at`, `featured_slot` (null/1/2), `cover_asset_id`, `price_idr`, `admission_mode` (walk_in/external/pending), `registration_url`, `attendance_note`, `is_demo`, `version`, serta waktu dibuat/diedit. |
| Venue | ID, nama tampil, deskripsi singkat, foto berurutan. Satu venue bisa memiliki beberapa acara. Data ruang dapat dimasukkan sebagai seed dan dipilih dari formulir event. |
| Performer | Nama tampil atau nama komunitas, bio pendek, potret opsional. Relasi dengan event memiliki urutan tampil. Tanpa potret, gunakan inisial di lingkaran. |
| Asset | ID aset, kunci file persisten, tipe, ukuran, alt text, caption, asal dan kredit. `Event.cover_asset_id` menunjuk sampul. Relasi `EventGallery(event_id, asset_id, sort_order)` menyimpan urutan foto per acara. |
| ScheduleChange | ID event, waktu mulai/selesai lama dan baru, alasan internal, ID admin, waktu perubahan. Baca perubahan terakhir untuk label “Sebelumnya”. |
| Admin | ID, email unik, hash kata sandi. Otorisasi diperiksa server untuk setiap pembacaan data privat dan mutasi. |

- Publikasi memerlukan judul, kategori, narasi, venue, tanggal/jam mulai serta selesai, harga, mode kehadiran, dan satu sampul dengan teks alternatif. Harga berupa bilangan bulat rupiah ≥ 0; nol ditampilkan “Gratis”. Mode external memerlukan URL HTTPS yang valid. Jika file sampul tersimpan gagal dimuat, tampilkan latar gradasi dusk dan pertahankan judul yang terbaca. Alasan internal dan identitas pengubah hanya tersedia di admin.
- Tahun ditentukan dari **tanggal mulai di WIB**. Edisi 2027 menerima awal acara dari 1 Januari sampai 31 Desember 2027. Akhir boleh melampaui tengah malam atau masuk 1 Januari 2028. Tanggal akhir dan jam wajib terlihat jika hari berbeda. Tolak usulan reschedule dengan tanggal mulai di luar 2027 dan pertahankan jadwal lama.
- Simpan timestamp secara konsisten dalam UTC, konversikan input/output melalui Asia/Jakarta. Filter bulan dan kelompok agenda memakai waktu lokal. Status “Selesai” dihitung saat jam sekarang mencapai waktu akhir. Untuk demo, izinkan jam uji melalui konfigurasi server.
- Kueri publik hanya mengambil `published` dan `deleted_at = null`. Tampilkan penanda jadwal berubah jika ada riwayat. Status publikasi, riwayat jadwal, dan status waktu acara merupakan atribut terpisah.
- Satu slot pilihan hanya menunjuk satu acara. Tampilkan nama pilihan lama sebelum admin menggantinya. Jika dua judul sama, berikan slug unik saat pertama disimpan. Perubahan konten tidak memutus tautan.
- Jika dua admin/tab mengedit versi yang sama, penyimpan kedua mendapat pesan “Acara sudah diperbarui. Muat versi terbaru sebelum menyimpan.” Reschedule tanpa perubahan waktu tidak membuat catatan riwayat baru.

## 7. Isi awal untuk prototipe

Semua nama acara, tanggal, harga, pengisi, dan sebutan ruang berikut adalah **contoh fiktif untuk ALP**. Jadwal resmi 2027 belum disertakan. Ketika data resmi diterima, admin dapat membuat acara terverifikasi dan mengganti contoh. Untuk demo, gunakan nama ruang deskriptif sementara dan tampilkan label contoh juga pada tautan detail.

| Tanggal 2027 | Judul contoh | Jam WIB | Ruang contoh | Kategori | Cara hadir |
|---|---|---|---|---|---|
| 16 Januari | Keroncong di Beranda | 18.30–20.00 | Beranda | Musik | Gratis · datang langsung |
| 13 Februari | Meja Rasa Yogyakarta | 18.00–20.00 | Ruang Jamuan | Kuliner | Rp150.000 · info pendaftaran menyusul |
| 17 April | Membaca Motif Batik | 09.00–11.00 | Pendopo | Budaya | Gratis · info pendaftaran menyusul |
| 24 April | Senja di Tuts Piano | 18.30–20.00 | Beranda | Musik | Gratis · datang langsung |
| 19 Juni | Jamuan Rempah Jawa | 17.30–19.30 | Ruang Jamuan | Kuliner | Rp125.000 · info pendaftaran menyusul |
| 21 Agustus | Cerita dari Kain Lurik | 10.00–11.30 | Pendopo | Budaya | Gratis · datang langsung |
| 16 Oktober | Sketsa Sore di Beranda | 15.30–17.00 | Beranda | Komunitas | Gratis · datang langsung |
| 31 Desember | Musik di Penghujung Tahun | 22.00–00.30 (+1 hari) | Pendopo | Musik | Gratis · datang langsung |

**Contoh detail siap pakai.** Untuk “Membaca Motif Batik”, isi narasinya: “Apa yang pertama kali Anda lihat pada selembar batik? Di meja kerja pendopo, peserta mengamati susunan motif bersama perajin, lalu menggambar satu pola sederhana untuk dibawa pulang. Alat gambar tersedia di lokasi.” Isi dua profil demo: **Raras**, fasilitator motif, dan **Damar**, pemandu sesi sketsa. Galeri tiga gambar berupa detail kain, tangan menggambar, dan meja kerja. Cantumkan “Ilustrasi kegiatan” sebagai caption. Jadikan acara ini dan “Keroncong di Beranda” sebagai dua pilihan program awal.

Buat satu draf tambahan “Lokakarya Cetak Daun” dengan judul saja untuk pengujian publikasi. Seed dijalankan satu kali dan aman diulang. Menjalankan ulang aplikasi harus mempertahankan hasil edit admin, termasuk penghapusan. Sebelum uji awal, gunakan tanggal simulasi 5 Januari 2027 agar panel acara terdekat memiliki isi yang konsisten.

## 8. Implementasi yang disarankan untuk Antigravity

Gunakan stack proyek yang sudah ada bila mampu memenuhi spesifikasi. Untuk repository kosong, implementasi paling sederhana untuk demo ini adalah **Next.js dengan TypeScript, SQLite berbasis file, dan CSS dengan token tema**. Sediakan perintah instalasi, inisialisasi database, seed, serta perintah menjalankan aplikasi dari Windows tanpa Docker. Simpan perubahan di database yang sama untuk pengunjung dan admin.

| Operasi aplikasi | Kontrak minimum |
|---|---|
| Baca agenda dan detail | Satu fungsi pemilihan acara publik dipakai oleh agenda, panel terdekat, sorotan, dan halaman ruang terfilter. Detail menerapkan aturan visibilitas yang sama. |
| Simpan dan terbitkan | Validasi di server, kembalikan kesalahan per field, simpan versi, perbarui cache/rute terkait sesudah transaksi berhasil. |
| Jadwal ulang dan hapus | Wajib sesi admin. Validasi versi sebelum mutasi. Tulis jadwal serta riwayat secara atomik; hapus lewat penanda waktu. |
| Media dan sesi | Terima unggahan melalui endpoint khusus admin. Simpan file dengan nama unik di direktori media persisten dan metadata di SQLite. Pertahankan file setelah restart. Gunakan cookie sesi HttpOnly dan konfigurasi rahasia lokal. Cantumkan URL masuk serta cara menyiapkan akun di README tim. |
| Kualitas antarmuka | Semua kontrol dapat digunakan dengan keyboard. Fokus terlihat, dialog mengembalikan fokus ke pemicu, label formulir terbaca, ikon mempunyai nama. Target kontras teks isi 4,5:1 dan target sentuh 44 × 44 px. Hormati preferensi gerak terbatas. |
| Kinerja | Gunakan image size responsif, tentukan dimensi gambar, prioritaskan gambar hero, dan muat galeri saat mendekati viewport. Target uji lokal pada simulasi ponsel: LCP ≤ 2,5 detik; laporkan kondisi dan hasil pengukuran. |

**Urutan pengerjaan.** (1) Rancang tema dan implementasikan detail “Membaca Motif Batik” sebagai patokan visual. (2) Bangun beranda dan agenda memakai database seed. (3) Sambungkan admin, validasi, serta riwayat perubahan. (4) Uji alur publik-admin dan periksa tata letak pada desktop serta ponsel. Hasil akhir harus bisa didemokan melalui rute normal.

## 9. Kriteria penerimaan

| ID | Tindakan uji | Hasil yang diharapkan |
|---|---|---|
| U01 | Buka beranda pada lebar 1440 px dan 390 px. | Desktop menempatkan judul di kiri dan panel di kanan. Ponsel menumpuknya. Hero terbaca, tindakan utama dapat diketuk, halaman bebas scroll horizontal. |
| U02 | Buka semua bulan pada data awal, pilih April dan kategori Budaya. | Semua bulan berisi 8 acara terbit. April berisi 2 acara. Setelah kategori dipilih, hanya “Membaca Motif Batik” yang muncul. |
| U03 | Bagikan URL filter, buka kembali lalu masuk ke detail dan tekan Kembali. | Filter dan daftar kembali ke pilihan yang sama. Pencarian yang tak cocok menyediakan reset. Bulan Mei awal menampilkan pesan bulan kosong. |
| U04 | Buka detail batik dan satu detail tanpa profil atau galeri. | Detail batik memuat dua profil, tiga foto, serta informasi kehadiran. Acara dengan data minimal tetap rapi. |
| U05 | Akses URL edit tanpa login, kemudian login sebagai admin. | Akses pertama diarahkan ke login. Setelah login daftar admin terlihat dan draf awal hanya dapat dibuka oleh admin. |
| U06 | Tambah draf, coba terbitkan tanpa waktu. Lengkapi draf dan terbitkan. | Validasi menunjukkan field yang kurang. Setelah sukses acara muncul tepat sekali pada bulan yang benar dan bertahan setelah restart. |
| U07 | Pindahkan “Membaca Motif Batik” dari 17 April pukul 09.00–11.00 ke 8 Mei pukul 13.00–15.00 WIB. | Slug tetap. April kehilangan satu acara, Mei bertambah satu. Detail memuat jadwal baru dan waktu lama. Sorotan menggunakan tanggal baru. |
| U08 | Usulkan waktu selesai sebelum waktu mulai atau tanggal mulai di 2028. | Server menolak, memberi penjelasan, menyimpan jadwal sebelumnya, dan tidak menambah riwayat. |
| U09 | Batalkan dialog hapus, lalu buka kembali dan konfirmasi hapus acara batik. | Pembatalan menjaga data. Setelah konfirmasi, acara hilang dari agenda, filter ruang, sorotan dan URL publik. Memuat ulang aplikasi tidak mengembalikannya. |
| U10 | Ubah jam uji ke 1 Januari 2028 pukul 00.15 WIB, lalu 00.30 WIB. | Acara akhir tahun tetap terdaftar di Desember 2027. Pada 00.15 acara masih berlangsung; pada 00.30 tampil “Acara selesai”. |
| U11 | Jalankan alur utama dengan keyboard dan periksa gambar gagal dimuat. | Fokus terlihat, urutan logis, dialog bisa ditutup, serta judul dan informasi jadwal tetap tersedia dengan gambar fallback. |
| U12 | Buka dua tab edit, simpan perubahan berbeda. Uji juga sesi yang telah logout. | Edit usang menampilkan konflik tanpa menimpa versi terbaru. Mutasi setelah logout ditolak server. |
| U13 | Gunakan acara uji terbit dengan mode external dan URL HTTPS. Ubah menjadi pending. | Tautan pendaftaran tersedia saat aktif, lalu digantikan keterangan ketika informasi menyusul. Pada mode walk_in tertera “Datang langsung”. |
| U14 | Pilih kartu ruang dengan beberapa foto dan gunakan panah. Buka tautan acaranya. | Gambar berubah hanya pada kartu tersebut. Agenda menampilkan acara pada ruang yang dipilih dan filter bisa direset. |
| U15 | Buat draf baru dari ponsel. Lengkapi isian, coba terbitkan tanpa sampul, lalu unggah sampul dan tiga foto galeri sebelum menerbitkan. | Draf dapat disimpan. Publikasi pertama meminta sampul. Setelah berhasil, detail menampilkan foto yang dipilih dan galeri sesuai urutan, termasuk setelah aplikasi dimulai ulang. |
| U16 | Ganti sampul acara pilihan, hapus satu foto galeri dan ubah urutannya. Coba “Batal”, lalu ulangi dan simpan. | Batal mempertahankan foto lama. Simpan memperbarui sampul pada detail dan sorotan, serta urutan galeri acara itu saja. Jadwal ulang tidak mengganti fotonya. |
| U17 | Pilih PDF, gambar di atas 5 MB, atau foto galeri kesembilan. | Pesan menyebut penyebabnya. Isian yang valid tetap tersedia. Kegagalan unggah tidak menimpa media yang sudah terbit. |
| U18 | Periksa header, footer, menu seluler terbuka, dan detail pada desktop serta ponsel. Coba URL admin langsung sebagai staf. | Seluruh UI publik bebas dari akses login admin. URL langsung membuka login dan rute kelola tetap mewajibkan sesi. Ketujuh screenshot referensi tidak dipanggil sebagai aset situs. |

**Skenario presentasi tiga menit.** Buka hero, cari agenda April, lalu buka “Membaca Motif Batik” dan simpan URL-nya. Di tab terpisah, buka `/admin/login`, ganti sampul dengan foto batik dari perangkat, simpan, lalu pindahkan acara ke 8 Mei. Kembali ke URL lama dan muat ulang untuk memperlihatkan perubahan yang juga dilihat calon tamu. Akhiri dengan membuka Mei dari agenda dan tunjukkan bahwa acara hanya tercatat sekali. Jalankan uji skenario ini pada kondisi seed awal.

## 10. Prompt awal untuk ditempel ke Antigravity

> Implementasikan website mockup interaktif “Agenda 2027 Grand Hotel De Djokja” berdasarkan seluruh PRD ini. Gunakan tujuh screenshot hanya sebagai referensi desain. Ambil semua gambar yang ditampilkan dari aset hotel, aset demo terpisah, atau foto yang diunggah admin. Pertahankan hero senja dengan judul kiri dan agenda kanan, indeks bulan dengan daftar kronologis, serta halaman detail berfoto panorama dengan informasi praktis di kiri dan cerita di kanan. Gunakan identitas visual heritage Jogja dan seluruh teks UI dalam bahasa Indonesia.
>
> Bangun halaman publik dan area admin dengan autentikasi, tambah, edit, terbitkan, jadwal ulang, dan hapus. Di formulir tambah dan edit setiap event, implementasikan unggah sampul serta galeri dari perangkat, pratinjau, ganti, hapus, dan urutkan sesuai Bagian 5. Akses staf melalui URL langsung `/admin/login`. Hilangkan seluruh pintu masuk admin dari UI publik, termasuk header, footer, dan menu ponsel. Sambungkan semua tampilan ke database dan penyimpanan media persisten. Gunakan agenda contoh di Bagian 7, tandai sebagai demo, dan pertahankan URL acara saat tanggal berubah. Aplikasi harus dapat dijalankan di Windows tanpa Docker.
>
> Kerjakan hingga aplikasi dapat dijalankan. Sertakan README singkat untuk instalasi, seed, pengaturan akun admin, dan cara demo. Jalankan pengujian di Bagian 9, laporkan hasil aktual dan hal yang belum teruji, serta sertakan tangkapan tampilan beranda desktop, detail ponsel, dan dialog jadwal ulang untuk penilaian tim ALP.
