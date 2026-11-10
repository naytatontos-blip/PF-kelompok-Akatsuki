# Dokumentasi Backend API SIP-Publik
**Sistem Informasi Pengaduan Pelayanan Publik - Kelurahan Airmadidi Atas**

Backend ini menyediakan RESTful API lengkap untuk mengelola seluruh siklus hidup pengaduan warga, penugasan internal per role (Front Office, Tindak Lanjut, Kepala Seksi, Lurah, Administrator), log audit, konfigurasi sistem, dan visualisasi statistik.

---

## 1. Menjalankan Backend

### Cara 1: Menjalankan Server Native (Langsung Tanpa Install Dependensi Eksternal)
Server ini menggunakan modul native bawaan Node.js (`http`, `fs`, `path`, `url`), sehingga dapat langsung berjalan di lingkungan apa pun tanpa perlu `npm install`:
```bash
node backend/server.js
```
Akses API di: `http://localhost:5000/api`

### Cara 2: Menjalankan dengan Express
Jika Anda ingin menggunakan middleware Express (`cors`, `morgan`, `multer`):
```bash
npm install express cors
node backend/express-app.js
```

---

## 2. Ringkasan Endpoint REST API

### Autentikasi
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login petugas (Front Office, Tindak Lanjut, Kasie, Lurah, Admin) |
| `GET` | `/api/health` | Pemeriksaan kesehatan server (*Health Check*) |

### Pengaduan Warga (Complaints)
| Method | Endpoint | Role / Aktor | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/complaints` | Semua | Ambil daftar pengaduan (filter: status, kategori, search) |
| `GET` | `/api/complaints/:id` | Publik / Internal | Lacak status tiket berdasarkan ID unik / shortId |
| `POST` | `/api/complaints` | Warga Umum | Kirim pengaduan baru (generate ID acak unik & shortId) |
| `PATCH` | `/api/complaints/:id/verify-disposisi` | Front Office | Verifikasi kelayakan, tetapkan kategori & seksi disposisi |
| `PATCH` | `/api/complaints/:id/reject` | Front Office / Kasie | Tolak aduan yang tidak memenuhi syarat |
| `PATCH` | `/api/complaints/:id/accept-disposisi` | Tindak Lanjut | Konfirmasi dan terima instruksi disposisi |
| `PATCH` | `/api/complaints/:id/return-disposisi` | Tindak Lanjut | Kembalikan disposisi ke Front Office |
| `PATCH` | `/api/complaints/:id/progress` | Tindak Lanjut | Update status penanganan dan catatan progres lapangan |
| `POST` | `/api/complaints/:id/upload-proof` | Tindak Lanjut | Unggah berkas / foto bukti penyelesaian |
| `POST` | `/api/complaints/:id/official-response` | Tindak Lanjut | Kirim tanggapan resmi ke warga |
| `POST` | `/api/complaints/:id/escalate` | Kepala Seksi | Proses eskalasi prioritas dan instruksi khusus |
| `POST` | `/api/complaints/:id/approve-closure` | Kepala Seksi | Setujui penutupan aduan (*Closure Selesai*) |
| `POST` | `/api/complaints/:id/review` | Warga Umum | Kirim rating bintang (1-5) dan komentar ulasan |

### Manajemen Pengguna (Admin)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Ambil semua akun pengguna internal |
| `POST` | `/api/users` | Tambah pengguna baru |
| `PATCH` | `/api/users/:id/status` | Nonaktifkan / aktifkan akun pengguna |
| `POST` | `/api/users/:id/reset-password` | Reset kata sandi pengguna ke default |

### Log Audit & Konfigurasi
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/audit-logs` | Ambil daftar log audit jejak aktivitas (filter search) |
| `GET` | `/api/config` | Ambil konfigurasi sistem (nama kelurahan, hotline, limit) |
| `PUT` | `/api/config` | Simpan perubahan konfigurasi sistem |

### Dashboard & Laporan (Lurah / Seklur)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Ambil 4 KPI, persentase kategori, dan tren bulanan |
| `GET` | `/api/dashboard/export-excel` | Ekspor tabel pengaduan format CSV / Spreadsheet |
| `GET` | `/api/dashboard/export-pdf` | Endpoint integrasi cetak dokumen eksekutif |

---

## 3. Contoh Request cURL

### 1. Ajukan Pengaduan Baru (Warga)
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Warga Budi",
    "kontak": "0812-9988-7766",
    "lokasi": "Lingk. II RT 03",
    "detail": "Jalan berlubang dan aspal terkelupas sedalam 15 cm.",
    "kategori": "Infrastruktur & Lingkungan"
  }'
```

### 2. Lacak Status Pengaduan
```bash
curl -X GET http://localhost:5000/api/complaints/ADU-2026-0001
```

### 3. Disposisi oleh Front Office
```bash
curl -X PATCH http://localhost:5000/api/complaints/ADU-0001/verify-disposisi \
  -H "Content-Type: application/json" \
  -d '{
    "kategori": "Infrastruktur & Lingkungan",
    "tujuanDisposisi": "Seksi Pembangunan",
    "catatan": "Segera lakukan peninjauan lokasi lapangan besok pagi.",
    "user": "petugas.a"
  }'
```

### 4. Ekspor Data Excel/CSV
```bash
curl -X GET http://localhost:5000/api/dashboard/export-excel -o laporan.csv
```

