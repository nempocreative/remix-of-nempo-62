# Roadmap

- [x] GGS slide 7: pinggiran putih dihapus lewat capture artboard tepat 1080×1440 pada koordinat integer, lima pergantian teks sepanjang 20 detik; MP4 600 frame 30 fps H.264 High CRF 16 slow (8,6 MB) direkam ulang, decode dan checksum unduhan cocok; desktop/ponsel tanpa error, slide 8 tetap 15 detik. Tes durasi lolos; tes kelengkapan masih gagal pada 85 pointer asing lama, bukan video slide 7 baru.

- [x] GGS slide 7: MP4 kualitas tinggi dari frame asli 1080×1440, 30 fps, 15 detik; H.264 CRF 16, 5,9 MB; decode dan tombol unduh terverifikasi cocok dengan file baru. Tes kelengkapan: 5 lolos, 1 gagal karena pointer asing lama yang tidak terkait perubahan ini.

- [x] GGS slide 7: foto AI dengan tungku ratus dan tipografi rapi tanpa brush/outline; slide 8 fokus alat ratus; watermark asli tetap, kedua MP4 1080×1440 15 detik 30 fps dan unduhan terverifikasi.

- [x] GGS slide 7: watermark header/footer asli terpasang, desain AI diperiksa di komputer/ponsel, MP4 1080×1440 15 detik 30 fps diperbarui dan tombol unduh cocok dengan file baru.

## Selesai
- [x] MusiComedy Night dipulihkan setelah remix: aktif di database; klik Event Mendatang, daftar event dan detail diverifikasi langsung.
- [x] Poster Event Mendatang: hilangkan animasi yang mengaburkan tulisan dan sediakan WebP sesuai ukuran layar tanpa menunda pemuatan.
- [x] Panduan deploy Vercel diperiksa: impor GitHub, gunakan NITRO_PRESET=vercel dan pengaturan koneksi Cloud; deploy sungguhan belum diuji.
- [x] Migrasi dari nempo-34: hanya situs NEMPO Organizer dan dashboard admin `/cms`; aplikasi lain dihapus.
- [x] Database dibuat ulang (20 tabel konten + peran admin) dengan pengaman akses; `/cms` membaca/menulis langsung ke database.
- [x] Semua foto/audio disimpan sebagai file asli di proyek, sehingga ikut terbawa saat deploy ke Vercel.
- [x] Event MusiComedy Night dipulihkan (poster, QRIS saweran, peta, reservasi Good Story Cafe).
- [x] Contoh pengaturan deploy di `.env.example`.

- [x] Akun admin admin@nempogarut.com dibuat; 109 data situs (wisata, kuliner, penginapan, lomba, kamus Sunda) dimasukkan ke database.
- [x] Data impor lama tidak dipertahankan: setelah remix, wisata, kuliner, penginapan, perlombaan, dan kamus Sunda diverifikasi kosong; jangan impor ulang.
- [x] Migration Drizzle hasil copy dibersihkan dan set migration kosong disiapkan; 21 tabel database proyek baru jadi baseline, drizzle-kit check lolos. Semua 42 referensi foto/audio/video sudah dipindah ke penyimpanan proyek ini (video slide 32 dipulihkan lewat host yang masih menyajikan filenya) — 0 foto rusak di beranda/feed/komunitas, 249 tes lolos.
- [x] Rundown MusiComedy (kertas A5 mendatar) diberi jam detail + kolom menit berpatokan adzan Ashar 14.49, Maghrib 17.47, Isya 18.56; baris medsos berisi ikon + alamat, dua kelompok — NEMPO (@nempo.id IG & TikTok, www.nempogarut.com, WA 0857-2498-1356) dan KALA MUDA (@kalamudacom); jam, menit, baris jeda salat dan tautan sosial diuji.
- [x] Cetak rundown: rules @media print menyembunyikan chrome aplikasi dan mengunci kertas ke satu halaman A5 mendatar (210×148 mm) — tabel, baris logo medsos dan baris footer bawah ikut tercetak; diverifikasi lewat PDF A5 (1 halaman, semua terbaca).
- [x] Dekor rundown dicabut: siluet penari/wayang maupun deretan ikon sama-sama ditolak, kertas A5 dibiarkan polos; diverifikasi lewat screenshot dan PDF A5 (1 halaman, semua terbaca).
- [x] Halaman 2 rundown: acuan sapaan penerima tamu — tiga kartu (tamu datang yang sekaligus mengarahkan ke kasir untuk pesan menu & nomor meja, kalau sudah reservasi, tamu pulang) plus empat aturan singkat; kalimat sapaan sudah dikoreksi pemilik, tamu dipanggil "Kak". Cetak = 3 halaman A5 mendatar (diverifikasi PDF).
- [x] Halaman 3 rundown: acuan dokumentasi — dua kolom berjarak dan bergaris pemisah, FOTO (sebelum acara, saat pertunjukan, wajib kepotret) di kiri dan VIDEO (sebelum acara, saat pertunjukan, video pendek reels & story) di kanan; kartu serah terima & unggah melebar di bawah, plus empat aturan; kalimatnya masih draf yang menunggu koreksi pemilik. Cetak = 3 halaman A5 mendatar (diverifikasi PDF).

## Terbuka
- [ ] Migrasi nempo-42: kode, foto/video dan struktur database sudah pindah — menunggu ekspor data lama & email admin.
- [ ] Bumper 2: pusatkan logo dan tampilkan Tetap disini, Malam ini, Kita Joged Bareng satu per satu setelah logo MusiComedy, tidak bersamaan.
- [x] Bumper 2: logo SADULI dikecilkan & digeser sedikit ke kanan; logo Kala Muda putih (latar dihapus) tampil di tengah setelah SADULI; MP4 direkam ulang dan tombol unduh diuji.
- [x] Slide 34: cahaya menyapu dihapus, diganti cahaya berjalan keliling di tepi tiap bentuk; diverifikasi di pratinjau (slide 33 tetap sama).
- [x] Slide 34: MP4 unduhan direkam ulang dari pratinjau — 900 frame penuh tanpa frame putih/kosong, tombol unduh terverifikasi menyajikan file baru.
- [x] Slide 34: jarak antar kartu dilebarkan (gap 2.8cqw) sehingga kartu judul lagu tidak nempel ke pita REQUEST; pratinjau dan MP4 cocok.
- [x] Slide 34: pita REQUEST diturunkan jauh dari logo MusiComedy Night; MP4 unduhan direkam ulang dengan posisi final.
- [x] Kecilkan logo NEMPO, naikkan ke ruang kosong atas, dan pisahkan teks PENGISI ACARA dari kepala pada foto; tampilan komputer/ponsel diperiksa.
- [x] Pulihkan logo NEMPO pembukaan dan beri waktu cukup untuk kemunculan SADULI satu per satu; bumper 18 detik dan MP4 1080×1440 30 fps diperbarui, unduhan cocok dengan file terbaru.
- [x] SADULI bumper muncul bertahap: teks atas, foto zoom halus, lalu nama; urutan diverifikasi di layar dan MP4 1080×1440 12 detik 30 fps diperbarui.
- [x] Pembukaan tirai dan wayang sebelum SADULI sama seperti pembukaan awal (1,8 detik), dengan jeda tertutup; urutan buka–tutup–buka–tutup diperiksa, MP4 1080×1440 12 detik 30 fps diperbarui dan unduhan diuji pada komputer/ponsel.
- [x] Tirai bumper buka-tutup dua kali: tirai menutup setelah judul, lalu membuka lagi untuk SADULI RAGAP dan menutup di akhir (animasi di layar).
- [ ] Migrasi nempo-41: database baru masih kosong dan akun admin belum dibuat — menunggu data ekspor & email admin.
- [x] Revisi bumper: logo NEMPO dinaikkan dan hanya muncul di bagian depan, foto pengisi acara diperbesar, tanggal & lokasi hanya di bagian depan, siluet penari dihapus, tirai tetap terbuka sampai akhir; MP4 1080×1440 direkam ulang.
- [x] Alat musik pada bumper dihapus; siluet penari ditambahkan di latar, logo NEMPO diperbesar, dan jarak teks judul dengan footer dirapikan; MP4 1080×1440 diperbarui dan diunggah ulang.
- [x] Bingkai bumper dihapus; angklung bergoyang, gong berayun, kendang melompat; MP4 diperbarui dan tombol unduh diuji.
- [x] Rapikan bumper: logo putih asli kiriman pengguna muncul setelah tirai terbuka lalu judul acara; MP4 1080×1440 diperbarui dan unduhan diuji.
- [x] Logo NEMPO kiriman pengguna ditampilkan pada pembukaan bumper pertama, termasuk MP4 unduhan; diverifikasi desktop dan ponsel.
- [x] Revisi bumper: pembukaan wayang bergerak, judul acara muncul besar di tengah; MP4 3:4 dirender ulang 1080×1440, 12 detik, 30 fps.
- [x] Bumper Acara MusiComedy: tombol di Nempo Feed, animasi 3:4 dan MP4 1080×1440, 12 detik, 30 fps; tombol jeda/ulang dan tampilan ponsel diperiksa. Ukuran dijelaskan kepada pengguna.
- [x] Data event saat ini disinkronkan setelah remix: MusiComedy Night aktif, API dan halaman detail terbaca; lima dataset lama tetap kosong.
- [ ] Unduh ekspor database lengkap terbaru: menunggu pengguna menjalankan Export data di More → Database → Manage → Settings.
- [ ] Pindahkan data ke Supabase milik pengguna: file salinan `nempo-database-salinan.sql` sudah siap di Files (teruji jalan di database tiruan) — jalankan di SQL Editor tujuan; akun admin dibuat ulang di tujuan lalu baris `user_roles` ditambahkan.
- [ ] Verifikasi koneksi Vercel ke Supabase pengguna: menunggu pengaturan tujuan di Vercel dan deploy.
- [ ] Unggah foto dari `/cms` belum aktif.
- [ ] Kompres foto unggahan baru ke WebP.

- [x] Bumper: ukuran 4:3 landscape + foto talent & tulisan SADULI RAGAP diperbesar, rekam ulang MP4 1440x1080
- [x] Bumper: tambah adegan penutup ajakan pesan menu (kata-kata bagus)
- [x] Bumper 2: tagline AI "Tetap disini / Malam ini / Kita Joged Bareng" (ejaan joged) + rekam ulang video unduhan
- [ ] Bumper 2: logo SADULI digeser ke kiri (left 48%) sesuai arahan
- [ ] Bumper 2: kemunculan logo Kala Muda diperlambat (muncul ~2.5 s)
- [ ] Bumper 2: rekam ulang MP4 unduhan setelah perubahan logo
- [x] Event selesai otomatis masuk ke card riwayat (home: heading Riwayat Event + badge Selesai; /event: bagian Event Selesai); baris event MusiComedy Night direstore ke database
- [x] Bumper 3: kendang, labu dan kelelawar dikembalikan di sekitar tulisan Saduli Ragap; bayangan hitam di belakang tulisan dihapus.
- [x] Bumper 3: ukuran landscape 3:2 ditambahkan; kendang di ukuran portrait dipindah ke bawah tulisan supaya tidak tertutup huruf.
- [x] Bumper 3: tulisan acara dan logo Saduli Ragap di segment pembuka diperbesar; labu dan kendang digeser lebih ke kiri/kanan lalu dirapikan supaya tidak keluar frame.
- [x] Bumper 3: tulisan Saduli Ragap, tulisan sambung di bawahnya, dan prop di sekitarnya dikecilkan sedikit di ketiga ukuran.
- [x] Bumper 3: ukuran landscape 4:3 dihapus supaya fokus ke 3:2; 3:2 jadi ukuran default, portrait 3:4 tetap ada.
- [x] GGS Feed slide 7: video animasi promo Ratus Rp50.000 → Rp45.000, pink Barbie, 3:4; MP4 1080×1440 15 detik 30 fps direkam dari pratinjau dan tombol unduh diuji.
