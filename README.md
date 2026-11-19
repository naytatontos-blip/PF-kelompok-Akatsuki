# Sistem Informasi Pengaduan Pelayanan Publik (SIP-PUBLIK)

Sistem informasi berbasis web untuk Kelurahan Airmadidi Atas yang membantu masyarakat, Petugas Front Office, Petugas Tindak Lanjut, Kepala Seksi, Lurah/Sekretaris Lurah, dan Administrator Sistem mengajukan, memproses, dan memantau pengaduan pelayanan publik dalam satu alur, agar penanganan pengaduan lebih cepat, transparan, dan terukur.

![Halaman utama](docs/screenshots/01_halaman_utama.png)

| | |
|---|---|
| **Mata kuliah** | System Analysis and Design — Fakultas Ilmu Komputer, Universitas Klabat |
| **Kelompok** |— Akatsuki |
| **Objek / studi kasus** | Kelurahan Airmadidi Atas, Kecamatan Airmadidi, Kabupaten Minahasa Utara |
| **Model SDLC** | Waterfall |
| **Dokumen SRS** | https://onedrive.live.com/:w:/g/personal/c04228a824dbbec9/IQCguS_eyvqZTp3fv_kZE4f4ART9bEAaCKqJQVQAtpn3Q7g?rtime=p8tVLNdF30g&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3cvYy9jMDQyMjhhODI0ZGJiZWM5L0lRQ2d1U19leXZxWlRwM2Z2X2taRTRmNEFSVDliRUFhQ0txSlFWUUF0cG4zUTdnP2U9alF2VWky
| **Prototipe UI** |https://www.figma.com/design/E3NFLZkkUn2XC62AbIDONu/Untitled?node-id=1-2&t=9fZxzmx8yvLafzG2-0|

## Anggota Kelompok

| No | Nama | NIM | Peran | Kontribusi utama |
|----|------|-----|-------|------------------|
| 1 | Satia, Elswit Dea Narwastu | 105012410059 | Project Leader & System Analyst | Memimpin alur proyek, komunikasi stakeholder, Use Case Description (UC-01 s.d. UC-22), Activity Diagram |
| 2 | Tatontos, Naydeline | 105022410009 | System Analyst, Data Modeler & Developer | Use Case Diagram, Data Model (skema basis data), Merancang dan Menguji Sistem SIP-Publik, dan README |
| 3 | Palari, Sesilia | 105012410098 | System Analyst / Architect | Class Diagram (kelas, atribut, relasi antar-objek) |
| 4 | Sahay, Priskilla Anatasya | 105012410103 | System Analyst / Architect | Sequence Diagram (interaksi antar objek tiap skenario) |
| 5 | Umbas, Gheanina Imanuela | 105012410009 | UI/UX Designer, QA dan dokumentasi  | Alur dan desain antarmuka (prototipe L-01 s.d. L-08), Slide |

## Latar Belakang

- **Masalah:** Pencatatan pengaduan masih manual dan konvensional, sehingga status laporan sulit dilacak, disposisi lambat, catatan rentan hilang atau rusak, dan rekapitulasi laporan kinerja memakan waktu.
- **Kondisi saat ini:** Warga datang langsung ke kantor kelurahan atau melapor ke RT/RW. Petugas mencatat aduan di buku agenda/register fisik, lalu meneruskannya secara verbal atau lewat lembar disposisi kertas ke seksi terkait, kadang dengan WhatsApp pribadi yang tidak terintegrasi. Belum ada nomor identitas unik, standar waktu penyelesaian (SLA), maupun pelacakan status bagi pengadu. Kantor memiliki 2 unit komputer desktop dan Wi-Fi lokal yang belum stabil pada jam sibuk.
- **Tujuan sistem:** Mendigitalisasi pengelolaan pengaduan agar koordinasi antar petugas lebih efisien, masyarakat dapat menyampaikan keluhan dan memantau progresnya, rekapitulasi lebih cepat, serta transparansi dan kepercayaan masyarakat terhadap pelayanan kelurahan meningkat.
- **Pengguna (aktor):**
  - **Masyarakat Umum (Pengadu):** menyampaikan keluhan, melacak progres, dan memberi ulasan tanpa login.
  - **Petugas Front Office:** memverifikasi aduan, menetapkan kategori awal, dan melakukan disposisi.
  - **Petugas Tindak Lanjut:** menerima disposisi, memperbarui status, mengunggah bukti, dan menanggapi pengadu.
  - **Kepala Seksi (Kasie):** memantau SLA, melakukan eskalasi, dan menyetujui penutupan aduan.
  - **Lurah / Sekretaris Lurah:** memantau dasbor statistik dan mengekspor laporan kinerja.
  - **Administrator Sistem:** mengelola akun, master kategori, konfigurasi, dan log audit.

## Fitur Utama

| No | Fitur | Aktor | Use case | Kebutuhan |
|----|-------|-------|----------|-----------|
| 1 | Login petugas internal berbasis peran (RBAC) | Petugas Kelurahan (Front Office, Tindak Lanjut, Kasie, Lurah/Seklur, Admin) | UC-01 | FR-01 |
| 2 | Portal pengajuan pengaduan dengan nomor tiket unik otomatis (tanpa login) | Masyarakat Umum | UC-02 | FR-02 |
| 3 | Pelacakan status berbasis nomor tiket, notifikasi otomatis (WhatsApp/SMS/sistem), dan ulasan kepuasan | Masyarakat Umum, Sistem | UC-03, UC-04, UC-05 | FR-03, FR-04, FR-05 |
| 4 | Verifikasi pengaduan, penetapan kategori awal, dan disposisi | Petugas Front Office | UC-06, UC-07, UC-08 | FR-06, FR-07, FR-08 |
| 5 | Penanganan lapangan: terima disposisi, perbarui status, unggah bukti, tanggapan resmi | Petugas Tindak Lanjut | UC-09, UC-10, UC-11, UC-12 | FR-09, FR-10, FR-11, FR-12 |
| 6 | Pemantauan SLA, eskalasi, dan persetujuan penutupan aduan | Kepala Seksi | UC-13, UC-14, UC-15 | FR-13, FR-14, FR-15 |
| 7 | Rekapitulasi data, dasbor statistik, dan ekspor laporan kinerja (PDF/Excel) | Lurah / Sekretaris Lurah | UC-16, UC-17, UC-18 | FR-16, FR-17, FR-18 |
| 8 | Manajemen akun, master kategori, konfigurasi sistem, dan log audit | Administrator Sistem | UC-19, UC-20, UC-21, UC-22 | FR-19, FR-20, FR-21, FR-22 |

## Screenshot

**[UC-01] Login**

![UC-01](<img width="793" height="362" alt="image" src="https://github.com/user-attachments/assets/586d7883-453e-4f30-9881-d581aea2a899" />
)

**[UC-02] Ajukan Pengaduan**

![UC-02](<img width="788" height="363" alt="image" src="https://github.com/user-attachments/assets/1fc2ed4f-d7ed-4ac3-bd76-111f00fe65f0" />
)

**[UC-03] Lacak Status Pengaduan**

![UC-03](<img width="788" height="364" alt="image" src="https://github.com/user-attachments/assets/3a10aa96-4f39-4959-89d7-eb6b70cdaace" />
)

**[UC-06, UC-07, UC-08] Verifikasi Pengaduan, Tetapkan Kategori Awal, Disposisikan Pengaduan**

![UC-06 s.d. UC-08](<img width="790" height="363" alt="image" src="https://github.com/user-attachments/assets/08b858a8-8975-4507-ab5c-144990ef0fd9" />
)

**[UC-09 s.d. UC-12] Terima Disposisi, Perbarui Status, Unggah Bukti, Tanggapan kepada Pengadu**

![UC-09 s.d. UC-12](<img width="788" height="358" alt="image" src="https://github.com/user-attachments/assets/46967c83-0b35-4854-9acc-94ec8ac7ac97" />
)

**[UC-13, UC-14, UC-15] Pantau Progres, Eskalasi, Setujui Penutupan Pengaduan**

![UC-13 s.d. UC-15](<img width="790" height="361" alt="image" src="https://github.com/user-attachments/assets/e82fa045-837f-45f8-ad64-72653218bb2e" />
)

**[UC-16, UC-17, UC-18] Akses Data & Laporan, Dashboard Statistik, Ekspor Laporan Kinerja**

![UC-16 s.d. UC-18](<img width="786" height="364" alt="image" src="https://github.com/user-attachments/assets/cbe42271-5032-4632-aebe-19896a89972a" />
)

**[UC-19 s.d. UC-22] Kelola Akun, Kelola Kategori, Konfigurasi Sistem, Pantau Log Audit**

![UC-19 s.d. UC-22](<img width="792" height="360" alt="image" src="https://github.com/user-attachments/assets/7a1a6cdc-d924-42f1-a2e6-ffa4e3d4e449" />
)

**Validasi input**

![Pesan validasi](<img width="953" height="435" alt="image" src="https://github.com/user-attachments/assets/edfeea27-25f2-4fbf-925f-613c8c6f0703" />
)
[UC-02] Halaman pengajuan masyarakat,memasukkan nama harus sesuai dengan yang di minta,dan no Hp/WhatsApp harus 12 digit
## Teknologi

| Lapisan | Teknologi | Versi |
|---------|-----------|-------|
| Front-end | React, Tailwind CSS, Vite (JavaScript ES6+ & JSX, HTML5, CSS3), Lucide React, font Plus Jakarta Sans | React 18; Tailwind CSS 3; Vite versi 6|
| Back-end | Node.js, REST API dengan modul HTTP bawaan (native) | v26.7.0 |
| Database | NoSQL berbasis dokumen JSON (`backend/data/database.json`) di sisi server dan Web Storage (LocalStorage) di sisi klien | — |
| Tools pemodelan | Enterprise Architect, mermaid.js, Draw.io | — |
| Prototipe UI | Figma | 

## Kebutuhan Sistem

- Node.js dan npm 
- Tidak perlu server database terpisah, karena data tersimpan di berkas JSON
- Git
- Browser modern (Google Chrome atau Firefox versi terbaru); port 3000 (frontend) dan 5000 (backend API) harus tersedia

## Instalasi dan Menjalankan Aplikasi

1. Clone repository:

   ```bash
   git clone https://github.com/naytatontos-blip/PF-kelompok-Akatsuki.git
   cd PF-kelompok-Akatsuki
   ```

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Siapkan konfigurasi. Struktur repository tidak memuat file `.env`; aplikasi memakai port bawaan 3000 (frontend) dan 5000 (backend API). 

4. Siapkan database. Tidak ada langkah khusus: backend memakai `backend/data/database.json` yang sudah tersedia di repository. Berkas `backend/schema.sql` adalah skema relasional cadangan dan tidak wajib dijalankan.

5. Jalankan aplikasi (frontend dan backend sekaligus lewat skrip peluncur):

   ```bash
   node start.js
   ```

   `npm start`, 

   Alternatif, jalankan manual di dua terminal:

   ```bash
   node backend/server.js   # API backend, port 5000
   node server.js           # frontend lokal, port 3000
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser. Portal warga dapat dipakai tanpa login, sedangkan petugas masuk lewat menu Login Petugas.

### Akun uji

| Aktor | Username / email | Password |
|-------|------------------|----------|
| Petugas Front Office | petugas.a | frontoffice123 |
| Petugas Tindak Lanjut | petugas.b | tindaklanjut123 |
| Kepala Seksi (Kasie) | kasie.bang | kasiebang123 |
| Lurah / Sekretaris Lurah | lurah.airmadidi | lurah2026 |
| Administrator Sistem | admin.sip | admin2026 |

Masyarakat umum (pengadu) tidak memerlukan akun.

## Struktur Folder

```text
PF-kelompok-Akatsuki/
├── backend/                    # server REST API dan database (lapisan control & data, SRS 7.2 dan Bagian 8)
│   ├── data/
│   │   └── database.json       # basis data utama berbasis JSON
│   ├── database.js             # logika query dan manipulasi basis data
│   ├── express-app.js          # rute Express opsional
│   ├── schema.sql              # skema relasional SQL cadangan
│   └── server.js               # server API Node.js bawaan (port 5000)
├── src/                        # source code frontend React 18
│   ├── components/             # komponen antarmuka yang dapat digunakan ulang
│   │   ├── Common/StatusBadge.jsx      # lencana warna status aduan
│   │   ├── Navbar.jsx                  # bilah navigasi atas (portal warga)
│   │   ├── Sidebar.jsx                 # menu samping dinamis sesuai peran
│   │   └── WhatsAppPreviewModal.jsx    # modal pratinjau pesan resmi WhatsApp
│   ├── context/
│   │   └── AppContext.jsx      # state global (Auth, Data, SLA)
│   ├── data/
│   │   └── mockData.js         # data simulasi awal dan kategori aduan
│   ├── pages/                  # halaman antarmuka tiap aktor, sesuai prototipe UI (SRS Bagian 9)
│   │   ├── LoginPage.jsx               # login petugas (UC-01)
│   │   ├── CitizenFormPage.jsx         # formulir pengaduan masyarakat (UC-02)
│   │   ├── CitizenTrackingPage.jsx     # lacak status tiket (UC-03 s.d. UC-05)
│   │   ├── FrontOfficePage.jsx         # verifikasi dan disposisi (UC-06 s.d. UC-08)
│   │   ├── FieldOfficerPage.jsx        # petugas tindak lanjut, bukti foto (UC-09 s.d. UC-12)
│   │   ├── SectionHeadPage.jsx         # panel Kasie: pemantauan dan approval (UC-13 s.d. UC-15)
│   │   ├── LeaderDashboardPage.jsx     # statistik dan rating Lurah (UC-16 s.d. UC-18)
│   │   └── AdminPage.jsx               # manajemen akun dan audit (UC-19 s.d. UC-22)
│   ├── services/
│   │   └── api.js              # klien pemanggil REST API backend
│   ├── utils/
│   │   └── phoneValidator.js   # validasi nomor HP (+62 8xx) dan format WhatsApp
│   ├── App.jsx                 # komponen induk router antarmuka
│   ├── index.css               # berkas styling Tailwind CSS
│   └── main.jsx                # titik masuk utama aplikasi React
├── docs/
│   ├── SAD_FP_Kelompok[N]_SRS.pdf
│   ├── diagrams/               # file sumber diagram UML (.drawio, .puml, dsb.)
│   └── screenshots/
├── index.html                  # template utama HTML
├── package.json                # daftar pustaka dan dependensi proyek
├── postcss.config.js           # konfigurasi modul PostCSS
├── tailwind.config.js          # konfigurasi palet warna dan tema Tailwind CSS
├── vite.config.js              # konfigurasi compiler Vite
├── server.js                   # server frontend lokal (port 3000)
├── start.js                    # skrip peluncur otomatis frontend dan backend
├── standalone-app.html         # aplikasi mandiri luring (single-file SPA)
├── .gitignore
└── README.md
```

## Rancangan Sistem

Ringkasan rancangan; detail lengkap ada di dokumen SRS.

| Artefak | Lokasi |
|---------|--------|
| Kebutuhan fungsional dan non-fungsional | SRS Bagian 5 |
| Use case diagram dan description | SRS Bagian 6 ·  |
| Activity dan sequence diagram | SRS Bagian 6.4 dan 7.1 |
| Class diagram | SRS Bagian 7.2 |
| Model data (ERD) dan kamus data | SRS Bagian 8 |
| Prototipe UI | [Figma](https://www.figma.com/design/E3NFLZkkUn2XC62AbIDONu/Untitled?node-id=1-2&t=9fZxzmx8yvLafzG2-0) · SRS Bagian 9 |

![Class diagram](<img width="596" height="491" alt="image" src="https://github.com/user-attachments/assets/40fdc648-157e-4d96-b2b3-a52b23ca6476" />
)

## Pengujian

Ringkasan: **6 kasus uji, 4 lulus** (TC-05 dan TC-06 baru berstatus *Designed* pada matriks keterlacakan). Daftar lengkap ada di SRS 10.4 dan sheet Pengujian pada Lembar Kerja Proyek.

| ID | Use case | Skenario | Hasil diharapkan | Status |
|----|----------|----------|------------------|--------|
| TC-01 | UC-01 | Login dengan data benar (role Front Office, password valid) | Masuk ke Dasbor Front Office | Lulus |
| TC-02 | UC-01 | Login dengan password salah | Tampil pesan "Kredensial Tidak Valid" | Lulus |
| TC-03 | UC-02 | Ajukan aduan lengkap (data valid + foto < 10 MB) | Terbit nomor tiket unik ADU-xxxx | Lulus |
| TC-04 | UC-03 | Lacak tiket dengan nomor tiket valid | Tampilkan linimasa progres | Lulus |
| TC-05 | UC-04| notifikasi otomatis (WhatsApp/SMS/sistem) | pengadu bisa menerima notifikasi dari petugas| Lulus |
| TC-06 | UC-05 | Ulasan kepuasan | Pengadu mengisi ulasan setelah pengaduannya ditangani| Lulus) |
| TC-07 | UC-06 |  Verifikasi pengaduan | Petugas Memverifikasi Pengaduan | Lulus
| TC-08 | UC-09-12 | Penanganan lapangan: terima disposisi, perbarui status, unggah bukti, tanggapan Resmi | Petugas dapat memperbarui pengaduan,dan mengunggah bukti pengaduan yang sudah selesai,dan tanggapan resmi dari petugas | Lulus
| TC-09 | UC-13-15 | Pemantauan SLA, eskalasi, dan persetujuan penutupan aduan | Petugas bisa mengirim notifikasi lewat WhatsApp dan mengunggah foto di portal pengaduan | Lulus |
| TC-10 | UC-16-18 |  Rekapitulasi data, dasbor statistik, dan ekspor laporan kinerja (PDF/Excel) | Lurah bisa melihat laporan dan bisa mendownload laporan tersebut | Lulus | 

## Keterbatasan dan Pengembangan Berikutnya

- Notifikasi WhatsApp/SMS pada prototipe yang dibangun masih berupa simulasi (modal pratinjau pesan WhatsApp) dan belum terhubung ke gateway WhatsApp API/SMS. Notifikasi cadangan di dalam sistem disediakan bila pengiriman gagal (UC-04 A1).
- Basis data yang dipakai saat ini adalah berkas JSON dan LocalStorage, bukan RDBMS. Skema relasional (`backend/schema.sql`) baru berupa cadangan.
- Ekspor laporan pada tampilan yang dibangun berupa PDF dan CSV, sedangkan kebutuhan FR-18 menyebut PDF dan Excel (.xlsx).
- Di luar ruang lingkup: sengketa hukum/pidana berat, transaksi pembayaran, peta GIS interaktif skala besar, dan modul absensi kepegawaian.
- Batasan operasional: lampiran maksimal 10 MB per file dengan format PDF, JPG, atau PNG; kantor kelurahan hanya memiliki 2 unit komputer dan koneksi Wi-Fi belum stabil pada jam sibuk.
- Rencana pengembangan: deploy ke cloud (Vercel/Netlify untuk frontend, Railway/Render untuk backend), integrasi gateway WhatsApp/SMS, penyusunan SOP, pelatihan singkat dan buku panduan per peran bagi petugas, prosedur memasukkan data pengaduan lama yang relevan, serta rencana pemeliharaan bersama pihak kelurahan.

## Penggunaan AI dan Referensi

| Alat AI | Dipakai untuk | Yang diperiksa atau diubah dari hasilnya |
|---------|---------------|------------------------------------------|
| Gemini AI | Memindahkan, memetakan (mapping), dan menyesuaikan format data dari draf laporan ke template SRS resmi dosen pengampu (semua bagian tabel di SRS) | Mengoreksi ketidaksesuaian struktur bagian, melengkapi nomor urut bagian yang hilang, dan memastikan isi tabel sesuai SRS resmi dari dosen pengampu |
| Gemini AI | Menyusun draf rinci Use Case Description berdasarkan Use Case Diagram dan draf awal (Bagian 6.3, UC-01 s.d. UC-22) | Memeriksa kebenaran alur utama dan alternatif, kesesuaian aktor, serta konsistensi relasi include/extend dengan diagram UML |
| Figma | Merancang tata letak antarmuka, alur visual, dan panduan desain prototipe (SRS 10.1) | Membuat tampilan UI/UX |
|Antigravity] | [Memperbaiki Code yang Error dan yang masih kurang lengkap] | Melengkapi kekurangan yang ada sehingga membuat code tersebut menjadi lebih bagus |

Referensi:

1. A. Dennis, B. H. Wixom, and D. Tegarden, *Systems Analysis and Design: An Object-Oriented Approach with UML*, 5th ed. Hoboken, NJ, USA: Wiley, 2015.
2. Laporan Draf Analisis & Perancangan Sistem Informasi Pengaduan Pelayanan Publik (SIP-PUBLIK) Kelurahan Airmadidi Atas, 2026.
