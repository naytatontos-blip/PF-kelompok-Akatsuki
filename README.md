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

## 📂 Struktur Folder Proyek

```text
SIP-PUBLIK/
├── backend/                        # Server Backend REST API & Database
│   ├── data/
│   │   └── database.json           # Basis data utama berbasis berkas JSON
│   ├── database.js                 # Logika query & manipulasi basis data
│   ├── express-app.js              # Rute Express opsional
│   ├── schema.sql                  # Skema relasional SQL cadangan
│   └── server.js                   # Server API Node.js bawaan (Port 5000)
├── src/                            # Kode Sumber Frontend (React 18)
│   ├── components/                 # Komponen Antarmuka yang Dapat Digunakan Ulang
│   │   ├── Common/
│   │   │   └── StatusBadge.jsx     # Komponen lencana warna status aduan
│   │   ├── Navbar.jsx              # Bilah navigasi atas
│   │   ├── Sidebar.jsx             # Bilah menu samping dinamis sesuai peran
│   │   └── WhatsAppPreviewModal.jsx# Modal pratinjau pesan resmi WhatsApp
│   ├── context/
│   │   └── AppContext.jsx          # Manajemen state global (Auth, Data, SLA)
│   ├── data/
│   │   └── mockData.js             # Data simulasi awal & kategori aduan
│   ├── pages/                      # Halaman Antarmuka Setiap Aktor
│   │   ├── AdminPage.jsx           # Panel Administrator (Manajemen Akun & Audit)
│   │   ├── CitizenFormPage.jsx     # Formulir pengajuan aduan masyarakat
│   │   ├── CitizenTrackingPage.jsx # Halaman lacak status tiket aduan
│   │   ├── FieldOfficerPage.jsx    # Panel Petugas Tindak Lanjut (Bukti Foto)
│   │   ├── FrontOfficePage.jsx     # Panel Front Office (Verifikasi & Disposisi)
│   │   ├── LeaderDashboardPage.jsx # Panel Pimpinan (Statistik & Rating)
│   │   ├── LoginPage.jsx           # Halaman login dengan kata sandi khusus
│   │   └── SectionHeadPage.jsx     # Panel Kasie (Pemantauan & Approval)
│   ├── services/
│   │   └── api.js                  # Klien pemanggil REST API backend
│   ├── utils/
│   │   └── phoneValidator.js       # Modul validasi nomor HP (+62 8xx) & format WA
│   ├── App.jsx                     # Komponen induk router antarmuka
│   ├── index.css                   # Berkas konfigurasi styling Tailwind CSS
│   └── main.jsx                    # Titik masuk utama aplikasi React
├── index.html                      # Template utama HTML Vite
├── package.json                    # Daftar pustaka & dependensi proyek
├── postcss.config.js               # Konfigurasi modul PostCSS
├── README.md                       # Dokumentasi resmi proyek sistem
├── server.js                       # Server frontend lokal (Port 3000)
├── standalone-app.html             # Aplikasi mandiri luring (Single-file SPA)
├── start.js                        # Skrip peluncur otomatis Frontend & Backend
├── tailwind.config.js              # Konfigurasi palet warna & tema Tailwind CSS
└── vite.config.js                  # Konfigurasi compiler Vite bundler
```

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
