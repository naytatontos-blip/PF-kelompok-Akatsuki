/**
 * SIP-Publik - Express Version Backend Server
 * Untuk penggunaan dengan Express framework:
 * npm install express cors morgan
 * node backend/express-app.js
 */
import express from 'express';
import cors from 'cors';
import { db } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    server: 'Express',
    system: 'SIP-Publik Backend API',
    kelurahan: 'Kelurahan Airmadidi Atas',
    time: new Date().toISOString()
  });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { username, role } = req.body;
  const user = db.getUserByUsername(username);

  if (user && user.status === 'Nonaktif') {
    return res.status(403).json({ success: false, message: 'Akun dinonaktifkan oleh administrator.' });
  }

  let roleLabel = role || user?.role || 'Petugas Front Office';
  let roleKey = user?.roleKey || 'front_office';

  if (roleLabel === 'Petugas Tindak Lanjut') roleKey = 'field_officer';
  else if (roleLabel === 'Kepala Seksi (Kasie)') roleKey = 'section_head';
  else if (roleLabel === 'Lurah / Sekretaris Lurah') roleKey = 'leader';
  else if (roleLabel === 'Administrator Sistem') roleKey = 'admin';

  db.createAuditLog('Login berhasil', username || 'petugas');

  res.json({
    success: true,
    message: 'Login berhasil',
    token: `express-jwt-token-${Date.now()}`,
    user: {
      id: user?.id || Date.now(),
      nama: user?.nama || username,
      username: username || 'petugas.internal',
      role: roleLabel,
      roleKey
    }
  });
});

// Complaints
app.get('/api/complaints', (req, res) => {
  const list = db.getComplaints(req.query);
  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/complaints', (req, res) => {
  const { nama, kontak, detail } = req.body;
  if (!nama || !kontak || !detail) {
    return res.status(400).json({ success: false, message: 'Nama, kontak, dan detail aduan wajib diisi.' });
  }
  const item = db.createComplaint(req.body);
  res.status(201).json({ success: true, message: 'Pengaduan tersimpan.', ticketId: item.id, data: item });
});

app.get('/api/complaints/:id', (req, res) => {
  const item = db.getComplaintById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  res.json({ success: true, data: item });
});

app.patch('/api/complaints/:id/verify-disposisi', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    status: 'Didisposisikan',
    statusTimeline: 'Didisposisikan',
    kategori: req.body.kategori || 'Infrastruktur & Lingkungan',
    tujuanDisposisi: req.body.tujuanDisposisi || 'Seksi Pembangunan',
    catatanDisposisi: req.body.catatan || 'Mohon ditindaklanjuti',
    petugas: 'Petugas 1'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Disposisi ${req.params.id} ke ${req.body.tujuanDisposisi}`, req.body.user || 'petugas.a');
  res.json({ success: true, message: 'Pengaduan berhasil didisposisikan.', data: updated });
});

app.patch('/api/complaints/:id/reject', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    status: 'Ditolak',
    catatanRevisi: req.body.alasan || 'Tidak memenuhi kriteria'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Penolakan ${req.params.id}`, req.body.user || 'petugas.a');
  res.json({ success: true, message: 'Pengaduan ditolak.', data: updated });
});

app.patch('/api/complaints/:id/accept-disposisi', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    status: 'Diproses',
    catatanProgres: 'Disposisi diterima oleh petugas lapangan.'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Terima disposisi ${req.params.id}`, req.body.user || 'petugas.b');
  res.json({ success: true, message: 'Disposisi diterima.', data: updated });
});

app.patch('/api/complaints/:id/return-disposisi', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    status: 'Terverifikasi',
    catatanDisposisi: 'Dikembalikan oleh petugas lapangan untuk penyesuaian seksi.'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Kembalikan disposisi ${req.params.id}`, req.body.user || 'petugas.b');
  res.json({ success: true, message: 'Disposisi dikembalikan.', data: updated });
});

app.patch('/api/complaints/:id/progress', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    status: req.body.status || 'Diproses',
    catatanProgres: req.body.catatanProgres || 'Survei lokasi dilakukan'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Update status ${req.params.id}: ${req.body.status}`, req.body.user || 'petugas.b');
  res.json({ success: true, message: 'Status diperbarui.', data: updated });
});

app.post('/api/complaints/:id/upload-proof', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    buktiPenyelesaian: req.body.bukti || 'Pekerjaan perbaikan fisik di lapangan rampung.'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Unggah bukti ${req.params.id}`, req.body.user || 'petugas.b');
  res.json({ success: true, message: 'Bukti diunggah.', data: updated });
});

app.post('/api/complaints/:id/official-response', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    tanggapanResmi: req.body.tanggapan || '',
    status: 'Selesai Penanganan'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Kirim tanggapan resmi ${req.params.id}`, req.body.user || 'petugas.b');
  res.json({ success: true, message: 'Tanggapan resmi terkirim.', data: updated });
});

app.post('/api/complaints/:id/escalate', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    prioritas: req.body.prioritas || 'Tinggi',
    instruksiKhusus: req.body.instruksiKhusus || 'Segera tangani hari ini',
    timerSla: 'Prioritas Eskalasi (Hari Ini)'
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Eskalasi prioritas ${req.params.id}`, req.body.user || 'kasie.bang');
  res.json({ success: true, message: 'Eskalasi berhasil diproses.', data: updated });
});

app.post('/api/complaints/:id/approve-closure', (req, res) => {
  const updated = db.updateComplaint(req.params.id, { status: 'Selesai' });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Approval closure ${req.params.id}`, req.body.user || 'kasie.bang');
  res.json({ success: true, message: 'Aduan disetujui untuk ditutup (Closure Selesai).', data: updated });
});

app.post('/api/complaints/:id/review', (req, res) => {
  const updated = db.updateComplaint(req.params.id, {
    rating: Number(req.body.rating) || 5,
    ulasan: req.body.ulasan || req.body.komentar || ''
  });
  if (!updated) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
  db.createAuditLog(`Ulasan tiket ${req.params.id}`, 'Warga');
  res.json({ success: true, message: 'Ulasan berhasil disimpan.', data: updated });
});

// Users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: db.getUsers() });
});

app.post('/api/users', (req, res) => {
  const user = db.createUser(req.body);
  res.status(201).json({ success: true, message: 'Pengguna ditambahkan.', data: user });
});

app.patch('/api/users/:id/status', (req, res) => {
  const user = db.toggleUserStatus(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  res.json({ success: true, message: 'Status pengguna diperbarui.', data: user });
});

app.post('/api/users/:id/reset-password', (req, res) => {
  const ok = db.resetUserPassword(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  res.json({ success: true, message: 'Password berhasil di-reset.' });
});

// Audit Logs & Config
app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, data: db.getAuditLogs(req.query.q) });
});

app.get('/api/config', (req, res) => {
  res.json({ success: true, data: db.getConfig() });
});

app.put('/api/config', (req, res) => {
  res.json({ success: true, data: db.updateConfig(req.body) });
});

// Dashboard
app.get('/api/dashboard/stats', (req, res) => {
  res.json({ success: true, data: db.getDashboardStats() });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

