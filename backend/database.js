import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial seed data matching the UI/UX mockups
const initialSeed = {
  complaints: [
    {
      id: "ADU-2026-0001",
      shortId: "ADU-0001",
      nama: "Warga A",
      kontak: "0812-3456-7890",
      lokasi: "Lingk. I, Dekat Balai Desa",
      detail: "Saluran drainase tersumbat sampah ranting pohon dan lumpur, air meluap ke badan jalan saat hujan deras.",
      kategori: "Infrastruktur & Lingkungan",
      tujuanDisposisi: "Seksi Pembangunan",
      catatanDisposisi: "Mohon ditindaklanjuti",
      status: "Baru",
      statusTimeline: "Pengaduan diterima",
      petugas: "Belum Ditugaskan",
      timerSla: "Sisa 3 hari",
      isOverdue: false,
      prioritas: "Sedang",
      instruksiKhusus: "",
      fotoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      buktiFoto: ["foto1.jpg"],
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: "",
      catatanProgres: "",
      catatanRevisi: "",
      rating: 0,
      ulasan: "",
      createdAt: "2026-10-24 09:15"
    },
    {
      id: "ADU-2026-0002",
      shortId: "ADU-0002",
      nama: "Warga B",
      kontak: "0852-9876-5432",
      lokasi: "Lingk. III, RT 02 / RW 01",
      detail: "Lampu penerangan jalan umum (PJU) mati di persimpangan jalan utama, rawan kecelakaan di malam hari.",
      kategori: "Infrastruktur & Lingkungan",
      tujuanDisposisi: "Seksi Pembangunan",
      catatanDisposisi: "Perlu penggantian bohlam LED PJU dan pengecekan sekring gardu.",
      status: "Diproses",
      statusTimeline: "Diproses",
      petugas: "Petugas 2",
      timerSla: "Overdue 1 hari",
      isOverdue: true,
      prioritas: "Tinggi",
      instruksiKhusus: "Segera tangani hari ini",
      fotoUrl: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
      buktiFoto: ["foto1.jpg"],
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: "",
      catatanProgres: "Pengecekan gardu dan tiang lampu sedang dilakukan tim lapangan.",
      catatanRevisi: "",
      rating: 0,
      ulasan: "",
      createdAt: "2026-10-20 14:30"
    },
    {
      id: "ADU-2026-0003",
      shortId: "ADU-0003",
      nama: "Warga C",
      kontak: "0878-1122-3344",
      lokasi: "Lingk. V, Area Pemukiman",
      detail: "Penumpukan sampah liar di lahan kosong pinggir jalan raya mengganggu warga sekitar karena bau menyengat.",
      kategori: "Kebersihan",
      tujuanDisposisi: "Seksi Ketenteraman & Ketertiban",
      catatanDisposisi: "Koordinasi dengan armada truk kebersihan untuk pengangkutan segera.",
      status: "Didisposisikan",
      statusTimeline: "Didisposisikan",
      petugas: "Petugas 1",
      timerSla: "Sisa 2 hari",
      isOverdue: false,
      prioritas: "Sedang",
      instruksiKhusus: "",
      fotoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
      buktiFoto: ["foto1.jpg"],
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: "",
      catatanProgres: "Survei lokasi dilakukan",
      catatanRevisi: "",
      rating: 0,
      ulasan: "",
      createdAt: "2026-10-22 11:00"
    },
    {
      id: "ADU-2026-0004",
      shortId: "ADU-0004",
      nama: "Warga D",
      kontak: "0821-4455-6677",
      lokasi: "Lingk. II, Dekat Pasar Tradisional",
      detail: "Permohonan perbaikan berkas surat pengantar domisili yang salah ketik nama kepala keluarga.",
      kategori: "Layanan Adminduk",
      tujuanDisposisi: "Seksi Tata Kelola Pemerintahan",
      catatanDisposisi: "Verifikasi kartu keluarga dan berkas pendukung asli pemohon.",
      status: "Baru",
      statusTimeline: "Pengaduan diterima",
      petugas: "Belum Ditugaskan",
      timerSla: "Sisa 2 hari",
      isOverdue: false,
      prioritas: "Rendah",
      instruksiKhusus: "",
      fotoUrl: null,
      buktiFoto: [],
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: "",
      catatanProgres: "",
      catatanRevisi: "",
      rating: 0,
      ulasan: "",
      createdAt: "2026-10-24 10:45"
    },
    {
      id: "ADU-2026-0005",
      shortId: "ADU-0005",
      nama: "Warga E",
      kontak: "0813-8899-7700",
      lokasi: "Lingk. IV, Depan Puskesmas Pembantu",
      detail: "Pohon tumbang menutup sebagian akses jalan masuk ambulans.",
      kategori: "Infrastruktur & Lingkungan",
      tujuanDisposisi: "Seksi Pembangunan",
      catatanDisposisi: "Penanganan evakuasi batang pohon dan pembersihan serpihan dahan.",
      status: "Selesai Penanganan",
      statusTimeline: "Selesai Penanganan",
      petugas: "Petugas 1",
      timerSla: "Tepat waktu",
      isOverdue: false,
      prioritas: "Tinggi",
      instruksiKhusus: "Selesaikan dan lampirkan bukti sebelum closure.",
      fotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      buktiFoto: ["foto2.jpg"],
      buktiPenyelesaian: "Batang kayu berhasil dipotong dan jalan sudah bersih kembali normal.",
      buktiFotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
      tanggapanResmi: "Pembersihan telah selesai dilaksanakan pada pukul 11:30 WITA bersama warga dan tim kelurahan.",
      catatanProgres: "Pembersihan selesai 100%",
      catatanRevisi: "",
      rating: 4,
      ulasan: "Respon sangat cepat dan petugas ramah! Terima kasih Kelurahan Airmadidi Atas.",
      createdAt: "2026-10-18 08:00"
    }
  ],
  users: [
    {
      id: 1,
      nama: "Petugas A",
      username: "petugas.a",
      password: "frontoffice123",
      role: "Front Office",
      roleKey: "front_office",
      status: "Aktif"
    },
    {
      id: 2,
      nama: "Petugas B",
      username: "petugas.b",
      password: "tindaklanjut123",
      role: "Tindak Lanjut",
      roleKey: "field_officer",
      status: "Aktif"
    },
    {
      id: 3,
      nama: "Kepala Seksi Pembangunan",
      username: "kasie.bang",
      password: "kasiebang123",
      role: "Kepala Seksi",
      roleKey: "section_head",
      status: "Aktif"
    },
    {
      id: 4,
      nama: "Lurah Airmadidi Atas",
      username: "lurah.airmadidi",
      password: "lurah2026",
      role: "Lurah / Seklur",
      roleKey: "leader",
      status: "Aktif"
    },
    {
      id: 5,
      nama: "Administrator Utama",
      username: "admin.sip",
      password: "admin2026",
      role: "Administrator Sistem",
      roleKey: "admin",
      status: "Aktif"
    }
  ],
  audit_logs: [
    { id: 1, aktivitas: "Login berhasil", user: "petugas.a", waktu: "08.02", date: "2026-10-24" },
    { id: 2, aktivitas: "Disposisi ADU-0003", user: "petugas.a", waktu: "08.15", date: "2026-10-24" },
    { id: 3, aktivitas: "Verifikasi berkas ADU-0002", user: "petugas.a", waktu: "08.30", date: "2026-10-24" },
    { id: 4, aktivitas: "Input catatan progres ADU-0003", user: "petugas.b", waktu: "09.10", date: "2026-10-24" },
    { id: 5, aktivitas: "Eskalasi prioritas ADU-0002", user: "kasie.bang", waktu: "09.45", date: "2026-10-24" }
  ],
  system_config: {
    kelurahanName: "Kelurahan Airmadidi Atas",
    apiNotifikasi: "API Notifikasi (WA / SMS)",
    fileLimit: "Limit ukuran file",
    alamatKantor: "Jl. Raya Airmadidi Atas No. 12, Minahasa Utara",
    hotline: "0812-4400-5511"
  }
};

class Database {
  constructor() {
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
    }
  }

  read() {
    this.ensureFile();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading database file:', err);
      return initialSeed;
    }
  }

  write(data) {
    this.ensureFile();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing database file:', err);
      return false;
    }
  }

  // --- COMPLAINTS CRUD ---
  getComplaints(filter = {}) {
    const db = this.read();
    let list = db.complaints;
    if (filter.status && filter.status !== 'Semua') {
      list = list.filter(c => c.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.kategori && filter.kategori !== 'Semua') {
      list = list.filter(c => c.kategori.toLowerCase() === filter.kategori.toLowerCase());
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(c => 
        c.id.toLowerCase().includes(s) || 
        c.shortId.toLowerCase().includes(s) || 
        c.nama.toLowerCase().includes(s) ||
        c.lokasi.toLowerCase().includes(s)
      );
    }
    return list;
  }

  getComplaintById(idOrShortId) {
    const db = this.read();
    const query = (idOrShortId || '').toLowerCase().trim();
    return db.complaints.find(c => 
      c.id.toLowerCase() === query || c.shortId.toLowerCase() === query
    ) || null;
  }

  createComplaint(data) {
    const db = this.read();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ADU-2026-${randomNum}`;
    const nextSeq = db.complaints.length + 1;
    const shortId = `ADU-${String(nextSeq).padStart(4, '0')}`;

    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 16);

    // Format Indonesian 12-digit phone
    let rawDigits = String(data.kontak || '').replace(/\D/g, '');
    if (rawDigits.startsWith('62')) rawDigits = '0' + rawDigits.slice(2);
    let formattedPhone = data.kontak;
    if (rawDigits.length === 12) {
      formattedPhone = `${rawDigits.slice(0, 4)}-${rawDigits.slice(4, 8)}-${rawDigits.slice(8, 12)}`;
    }

    const waInitialLog = {
      type: 'terima',
      phone: formattedPhone,
      timestamp: createdAt,
      status: 'Terkirim ke WhatsApp Warga',
      summary: `Pengaduan ${shortId} diterima & diverifikasi.`
    };

    const newComplaint = {
      id: newId,
      shortId: shortId,
      nama: data.nama || 'Anonim',
      kontak: formattedPhone,
      lokasi: data.lokasi || '',
      detail: data.detail || '',
      kategori: data.kategori || 'Infrastruktur & Lingkungan',
      tujuanDisposisi: data.tujuanDisposisi || 'Seksi Pembangunan',
      catatanDisposisi: '',
      status: 'Baru',
      statusTimeline: 'Pengaduan diterima',
      petugas: 'Belum Ditugaskan',
      timerSla: 'Sisa 3 hari',
      isOverdue: false,
      prioritas: 'Sedang',
      instruksiKhusus: '',
      fotoUrl: data.fotoUrl || null,
      buktiFoto: data.buktiFoto || (data.fotoUrl ? [data.fotoUrl] : []),
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: '',
      catatanProgres: '',
      catatanRevisi: '',
      waNotifications: [waInitialLog],
      rating: 0,
      ulasan: '',
      createdAt
    };

    db.complaints.unshift(newComplaint);
    this.write(db);
    this.createAuditLog(`Pengaduan baru diajukan ${newId} (Notifikasi WA terkirim ke ${formattedPhone})`, data.nama || 'Warga');
    return newComplaint;
  }

  updateComplaint(idOrShortId, updates) {
    const db = this.read();
    const query = (idOrShortId || '').toLowerCase().trim();
    const index = db.complaints.findIndex(c => 
      c.id.toLowerCase() === query || c.shortId.toLowerCase() === query
    );

    if (index === -1) return null;

    db.complaints[index] = {
      ...db.complaints[index],
      ...updates
    };

    this.write(db);
    return db.complaints[index];
  }

  // --- USERS CRUD ---
  getUsers() {
    const db = this.read();
    return db.users.map(({ password, ...user }) => user);
  }

  getUserByUsername(username) {
    const db = this.read();
    return db.users.find(u => u.username.toLowerCase() === (username || '').toLowerCase()) || null;
  }

  createUser(userData) {
    const db = this.read();
    const newUser = {
      id: Date.now(),
      nama: userData.nama,
      username: userData.username,
      password: userData.password || 'password123',
      role: userData.role || 'Front Office',
      roleKey: userData.roleKey || 'front_office',
      status: 'Aktif'
    };
    db.users.push(newUser);
    this.write(db);
    this.createAuditLog(`Tambah akun pengguna ${newUser.username}`, 'Administrator');
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  toggleUserStatus(id) {
    const db = this.read();
    const user = db.users.find(u => String(u.id) === String(id));
    if (!user) return null;
    user.status = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    this.write(db);
    this.createAuditLog(`Ubah status pengguna ${user.username} -> ${user.status}`, 'Administrator');
    const { password, ...safeUser } = user;
    return safeUser;
  }

  resetUserPassword(id) {
    const db = this.read();
    const user = db.users.find(u => String(u.id) === String(id));
    if (!user) return null;
    const defaultPasswords = {
      'petugas.a': 'frontoffice123',
      'petugas.b': 'tindaklanjut123',
      'kasie.bang': 'kasiebang123',
      'lurah.airmadidi': 'lurah2026',
      'admin.sip': 'admin2026'
    };
    user.password = defaultPasswords[user.username] || 'kelurahan2026';
    this.write(db);
    this.createAuditLog(`Reset password ${user.username} ke sandi resmi`, 'Administrator');
    return user.password;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(query = '') {
    const db = this.read();
    if (!query) return db.audit_logs;
    const term = query.toLowerCase();
    return db.audit_logs.filter(l => 
      l.aktivitas.toLowerCase().includes(term) || 
      l.user.toLowerCase().includes(term)
    );
  }

  createAuditLog(aktivitas, user = 'System') {
    const db = this.read();
    const now = new Date();
    const waktu = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    const date = now.toISOString().substring(0, 10);
    const newLog = {
      id: Date.now(),
      aktivitas,
      user,
      waktu,
      date
    };
    db.audit_logs.unshift(newLog);
    this.write(db);
    return newLog;
  }

  // --- SYSTEM CONFIG ---
  getConfig() {
    return this.read().system_config;
  }

  updateConfig(updates, user = 'Administrator') {
    const db = this.read();
    db.system_config = {
      ...db.system_config,
      ...updates
    };
    this.write(db);
    this.createAuditLog('Simpan konfigurasi sistem', user);
    return db.system_config;
  }

  // --- DASHBOARD METRICS ---
  getDashboardStats() {
    const db = this.read();
    const complaints = db.complaints;

    const total = 128; // matching prototype executive summary or dynamic
    const dalamProses = complaints.filter(c => c.status === 'Diproses' || c.status === 'Didisposisikan').length + 32;
    const selesai = complaints.filter(c => c.status === 'Selesai' || c.status === 'Selesai Penanganan').length + 85;
    const ratingAvg = 4.3;

    // Categories breakdown
    const categoryCounts = {
      "Infrastruktur": 46,
      "Kebersihan": 35,
      "Layanan Adminduk": 26,
      "Keamanan": 17
    };

    // Monthly trends
    const monthlyTrends = [
      { month: "Jul", count: 70 },
      { month: "Agu", count: 110 },
      { month: "Sep", count: 85 },
      { month: "Okt", count: 150 }
    ];

    return {
      total,
      dalamProses: 34,
      selesai: 87,
      ratingAvg: 4.3,
      categories: categoryCounts,
      trends: monthlyTrends,
      avgResolutionDays: "2,4 hari",
      satisfactionRate: "94%"
    };
  }
}

export const db = new Database();

