# 🏛️ SIP-Publik — Kelurahan Airmadidi Atas

Sistem Informasi Pengaduan Pelayanan Publik (**SIP-Publik**) berbasis web untuk Kelurahan Airmadidi Atas, Kabupaten Minahasa Utara. Memfasilitasi penerimaan aduan masyarakat secara transparan, penanganan teknis di lapangan dengan dokumentasi bukti foto, pemantauan bertingkat, serta notifikasi resmi WhatsApp real-time.

---

## 🚀 Fitur Utama

1. **Portal Aduan Masyarakat (Tanpa Perlu Login):**
   - Formulir pengajuan aduan dengan input lokasi, detail masalah, dan foto laporan.
   - Validasi ketat nomor WhatsApp resmi Indonesia dengan format awalan `+62 8xx-xxxx-xxxx` (otomatis membuang angka 0 berlebih).
   - Fitur **Penyimpanan Draft Otomatis** (*localStorage*) agar data ketikan warga tidak hilang tiba-tiba.
   - Pelacakan progres penanganan pengaduan secara real-time via nomor tiket unik.
   - Penilaian kepuasan masyarakat (bintang 1–5 & ulasan).

2. **Panel Petugas Internal (Multi-Peran dengan Kata Sandi Khusus):**
   - **Front Office:** Verifikasi berkas, validasi nomor kontak warga, dan disposisi aduan ke seksi yang berwenang.
   - **Petugas Tindak Lanjut (Tim Lapangan):** Konfirmasi disposisi, eksekusi fisik di lapangan, unggah foto dokumentasi penyelesaian, dan penerusan notifikasi WhatsApp ke pelapor.
   - **Kepala Seksi (Kasie):** Pemantauan penanganan seksi, peninjauan bukti foto lapangan, eskalasi prioritas, dan persetujuan penutupan (*approval closure*).
   - **Lurah / Sekretaris Lurah:** Dashboard eksekutif statistik capaian kinerja dan kepuasan masyarakat.
   - **Administrator Sistem:** Manajemen akun pengguna (tambah, nonaktifkan, reset sandi) dan riwayat log audit aktivitas.

3. **Notifikasi WhatsApp Resmi:**
   - Pembuatan pesan WA resmi otomatis saat pengaduan diterima & diverifikasi.
   - Pembuatan pesan WA resmi otomatis saat pengaduan selesai ditangani beserta tautan foto bukti pengerjaan di lapangan.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Tailwind CSS v3, Lucide React, Google Fonts (*Plus Jakarta Sans* & *Inter*)
* **Build Tool:** Vite 6
* **Backend:** Node.js Native REST API (Port 5000)
* **Database:** JSON File Document Store (`backend/data/database.json`) & Browser LocalStorage
* **Mode Mandiri:** `standalone-app.html` (dapat dijalankan luring / tanpa proses build)

---

## 🔑 Kredensial Akun & Kata Sandi Khusus Petugas

Setiap petugas memiliki kata sandi khusus yang berbeda dan tidak dapat diakses dengan kata sandi milik petugas lain:

| No | Peran / Aktor | Nama Petugas | Username | Kata Sandi Khusus | Wewenang |
|:---:|:---|:---|:---:|:---:|:---|
| 1 | **Front Office** | Petugas A | `petugas.a` | `frontoffice123` | Penerimaan, verifikasi awal & disposisi |
| 2 | **Tindak Lanjut** | Petugas B | `petugas.b` | `tindaklanjut123` | Penanganan lapangan & upload bukti foto |
| 3 | **Kepala Seksi** | Kasie Pembangunan | `kasie.bang` | `kasiebang123` | Monitoring seksi, eskalasi & approval penutupan |
| 4 | **Lurah / Seklur** | Lurah Airmadidi Atas | `lurah.airmadidi` | `lurah2026` | Monitoring eksekutif & statistik kepuasan |
| 5 | **Administrator** | Admin Utama | `admin.sip` | `admin2026` | Kelola akun aparatur & audit log sistem |

---

## 💻 Cara Menjalankan Aplikasi

### Menjalankan Server Lengkap (Frontend + Backend):
```bash
node start.js
```
* **Frontend Web:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

### Menjalankan Mode Mandiri (Offline / Tanpa Instalasi):
Cukup buka berkas `standalone-app.html` langsung di Google Chrome atau browser pilihan Anda.

---

© 2026 Pemerintah Kelurahan Airmadidi Atas, Kabupaten Minahasa Utara.
