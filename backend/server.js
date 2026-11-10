import http from 'http';
import { URL } from 'url';
import { db } from './database.js';

const PORT = process.env.PORT || 5000;

// Helper: Send JSON response
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

// Helper: Parse JSON body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5000'}`);
  const pathname = reqUrl.pathname;
  const method = req.method;
  const query = Object.fromEntries(reqUrl.searchParams.entries());

  try {
    // --- HEALTH CHECK ---
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'UP',
        system: 'SIP-Publik Backend API',
        kelurahan: 'Kelurahan Airmadidi Atas',
        time: new Date().toISOString()
      });
    }

    // --- AUTHENTICATION (STRICT UNIQUE PASSWORDS PER ROLE) ---
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username, password, role } = await parseBody(req);
      const user = db.getUserByUsername(username);

      if (!user) {
        return sendJson(res, 401, {
          success: false,
          message: `Username '${username}' tidak terdaftar dalam sistem.`
        });
      }

      if (user.status === 'Nonaktif') {
        return sendJson(res, 403, {
          success: false,
          message: 'Akun Anda sedang dinonaktifkan oleh administrator.'
        });
      }

      // Validasi ketat kata sandi khusus tiap petugas
      if (!password || user.password !== password) {
        return sendJson(res, 401, {
          success: false,
          message: `Kata sandi salah! Akun ${user.nama} (${user.username}) memiliki kata sandi khusus yang berbeda dan tidak dapat diakses dengan kata sandi lain.`
        });
      }

      let roleLabel = user.role;
      let roleKey = user.roleKey;

      db.createAuditLog('Login berhasil', username);

      return sendJson(res, 200, {
        success: true,
        message: 'Login berhasil',
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          role: roleLabel,
          roleKey
        }
      });
    }

    // --- COMPLAINTS API ---
    // 1. List complaints
    if (pathname === '/api/complaints' && method === 'GET') {
      const list = db.getComplaints(query);
      return sendJson(res, 200, { success: true, count: list.length, data: list });
    }

    // 2. Submit new complaint (Citizen)
    if (pathname === '/api/complaints' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.nama || !body.kontak || !body.detail) {
        return sendJson(res, 400, { success: false, message: 'Nama, Kontak, dan Detail aduan wajib diisi.' });
      }

      // Validasi ketat nomor telepon resmi Indonesia 12 digit
      const rawDigits = String(body.kontak || '').replace(/\D/g, '').replace(/^62/, '0');
      if (rawDigits.length !== 12 || !rawDigits.startsWith('08')) {
        return sendJson(res, 400, {
          success: false,
          message: `Nomor telepon/WhatsApp harus nomor resmi Indonesia 12 digit diawali 08 (contoh: 0812-3456-7890). Saat ini: ${rawDigits.length} digit.`
        });
      }

      const newComplaint = db.createComplaint(body);
      return sendJson(res, 201, {
        success: true,
        message: 'Pengaduan berhasil disimpan ke sistem. Notifikasi WhatsApp penerimaan otomatis diteruskan.',
        ticketId: newComplaint.id,
        shortId: newComplaint.shortId,
        data: newComplaint
      });
    }

    // Dynamic Complaint Route Patterns: /api/complaints/:id/...
    const complaintActionMatch = pathname.match(/^\/api\/complaints\/([^/]+)(?:\/([^/]+))?$/);
    if (complaintActionMatch) {
      const ticketId = decodeURIComponent(complaintActionMatch[1]);
      const subAction = complaintActionMatch[2]; // e.g. 'verify-disposisi', 'reject', etc.

      // 3. Get single complaint detail / tracking
      if (!subAction && method === 'GET') {
        const item = db.getComplaintById(ticketId);
        if (!item) {
          return sendJson(res, 404, { success: false, message: `Tiket ${ticketId} tidak ditemukan.` });
        }
        return sendJson(res, 200, { success: true, data: item });
      }

      // 4. Front Office: Verify & Setuju Disposisi
      if (subAction === 'verify-disposisi' && method === 'PATCH') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          status: 'Didisposisikan',
          statusTimeline: 'Didisposisikan',
          kategori: body.kategori || 'Infrastruktur & Lingkungan',
          tujuanDisposisi: body.tujuanDisposisi || 'Seksi Pembangunan',
          catatanDisposisi: body.catatan || 'Mohon ditindaklanjuti',
          petugas: 'Petugas 1'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Disposisi ${ticketId} ke ${body.tujuanDisposisi || 'Seksi'}`, body.user || 'petugas.a');
        return sendJson(res, 200, { success: true, message: 'Pengaduan berhasil diverifikasi dan didisposisikan.', data: updated });
      }

      // 5. Front Office or Kasie: Reject Complaint
      if (subAction === 'reject' && method === 'PATCH') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          status: 'Ditolak',
          statusTimeline: 'Ditolak',
          catatanRevisi: body.alasan || 'Tidak memenuhi kriteria aduan kelurahan'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Penolakan aduan ${ticketId}`, body.user || 'petugas.a');
        return sendJson(res, 200, { success: true, message: 'Pengaduan berhasil ditolak.', data: updated });
      }

      // 6. Field Officer: Accept Disposition
      if (subAction === 'accept-disposisi' && method === 'PATCH') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          status: 'Diproses',
          statusTimeline: 'Diproses',
          catatanProgres: 'Disposisi diterima oleh petugas lapangan.'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Konfirmasi disposisi ${ticketId}`, body.user || 'petugas.b');
        return sendJson(res, 200, { success: true, message: 'Disposisi berhasil diterima dan berstatus Diproses.', data: updated });
      }

      // 7. Field Officer: Return Disposition
      if (subAction === 'return-disposisi' && method === 'PATCH') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          status: 'Terverifikasi',
          statusTimeline: 'Terverifikasi',
          catatanDisposisi: 'Dikembalikan oleh petugas lapangan untuk penyesuaian seksi.'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Pengembalian disposisi ${ticketId}`, body.user || 'petugas.b');
        return sendJson(res, 200, { success: true, message: 'Disposisi dikembalikan ke Front Office.', data: updated });
      }

      // 8. Field Officer: Update Progress & Handling Status
      if (subAction === 'progress' && method === 'PATCH') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          status: body.status || 'Diproses',
          statusTimeline: body.status || 'Diproses',
          catatanProgres: body.catatanProgres || 'Survei lokasi dilakukan'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Update status ${ticketId}: ${body.status}`, body.user || 'petugas.b');
        return sendJson(res, 200, { success: true, message: 'Status dan progres penanganan berhasil diperbarui.', data: updated });
      }

      // 9. Field Officer: Upload Completion Proof
      if (subAction === 'upload-proof' && method === 'POST') {
        const body = await parseBody(req);
        const existing = db.getComplaintById(ticketId);
        const waNotifs = existing?.waNotifications || [];
        const proofUrl = body.buktiFotoUrl || body.fotoUrl || null;
        
        waNotifs.push({
          type: 'selesai',
          phone: existing?.kontak,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Terkirim ke WhatsApp Warga',
          buktiFotoUrl: proofUrl,
          summary: `Pengaduan ${ticketId} selesai ditangani. Bukti foto terlampir.`
        });

        const updated = db.updateComplaint(ticketId, {
          buktiPenyelesaian: body.bukti || 'Pekerjaan perbaikan fisik di lapangan telah rampung.',
          buktiFotoUrl: proofUrl,
          waNotifications: waNotifs
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Unggah bukti penyelesaian & kirim notifikasi WA ${ticketId}`, body.user || 'petugas.b');
        return sendJson(res, 200, { 
          success: true, 
          message: 'Bukti penyelesaian berhasil diunggah dan notifikasi WhatsApp terkirim ke warga.', 
          data: updated 
        });
      }

      // 10. Field Officer: Send Official Response
      if (subAction === 'official-response' && method === 'POST') {
        const body = await parseBody(req);
        const existing = db.getComplaintById(ticketId);
        const waNotifs = existing?.waNotifications || [];
        
        waNotifs.push({
          type: 'tanggapan',
          phone: existing?.kontak,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Terkirim ke WhatsApp Warga',
          summary: `Tanggapan resmi untuk tiket ${ticketId} telah terbit.`
        });

        const updated = db.updateComplaint(ticketId, {
          tanggapanResmi: body.tanggapan || '',
          status: 'Selesai Penanganan',
          statusTimeline: 'Selesai Penanganan',
          waNotifications: waNotifs
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Kirim tanggapan resmi ${ticketId}`, body.user || 'petugas.b');
        return sendJson(res, 200, { success: true, message: 'Tanggapan resmi berhasil dikirim ke pengadu via portal & WhatsApp.', data: updated });
      }

      // 11. Section Head (Kasie): Process Escalation
      if (subAction === 'escalate' && method === 'POST') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          prioritas: body.prioritas || 'Tinggi',
          instruksiKhusus: body.instruksiKhusus || 'Segera tangani hari ini',
          timerSla: 'Prioritas Eskalasi (Hari Ini)'
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Eskalasi prioritas ${ticketId} [${body.prioritas}]`, body.user || 'kasie.bang');
        return sendJson(res, 200, { success: true, message: 'Eskalasi berhasil diproses.', data: updated });
      }

      // 12. Section Head (Kasie): Approve Closure
      if (subAction === 'approve-closure' && method === 'POST') {
        const body = await parseBody(req);
        const existing = db.getComplaintById(ticketId);
        const waNotifs = existing?.waNotifications || [];
        
        waNotifs.push({
          type: 'closure',
          phone: existing?.kontak,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Terkirim ke WhatsApp Warga',
          buktiFotoUrl: existing?.buktiFotoUrl,
          summary: `Pengaduan ${ticketId} telah disetujui ditutup resmi oleh Kepala Seksi.`
        });

        const updated = db.updateComplaint(ticketId, {
          status: 'Selesai',
          statusTimeline: 'Selesai',
          waNotifications: waNotifs
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Approval closure & notifikasi WA penutupan ${ticketId}`, body.user || 'kasie.bang');
        return sendJson(res, 200, { 
          success: true, 
          message: 'Aduan berhasil disetujui untuk penutupan resmi (Closure Selesai). Notifikasi WA penutupan terkirim.', 
          data: updated 
        });
      }

      // 13. Citizen: Submit Rating & Review
      if (subAction === 'review' && method === 'POST') {
        const body = await parseBody(req);
        const updated = db.updateComplaint(ticketId, {
          rating: Number(body.rating) || 5,
          ulasan: body.ulasan || body.komentar || ''
        });
        if (!updated) return sendJson(res, 404, { success: false, message: 'Tiket tidak ditemukan.' });
        db.createAuditLog(`Ulasan warga untuk tiket ${ticketId}`, 'Warga');
        return sendJson(res, 200, { success: true, message: 'Terima kasih, ulasan Anda berhasil disimpan.', data: updated });
      }
    }

    // --- USERS API (ADMIN) ---
    if (pathname === '/api/users' && method === 'GET') {
      const list = db.getUsers();
      return sendJson(res, 200, { success: true, data: list });
    }

    if (pathname === '/api/users' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.nama || !body.username) {
        return sendJson(res, 400, { success: false, message: 'Nama dan Username wajib diisi.' });
      }
      const newUser = db.createUser(body);
      return sendJson(res, 201, { success: true, message: 'Pengguna baru berhasil ditambahkan.', data: newUser });
    }

    const userActionMatch = pathname.match(/^\/api\/users\/([^/]+)(?:\/([^/]+))?$/);
    if (userActionMatch) {
      const userId = userActionMatch[1];
      const action = userActionMatch[2];

      if (action === 'status' && method === 'PATCH') {
        const user = db.toggleUserStatus(userId);
        if (!user) return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
        return sendJson(res, 200, { success: true, message: `Status pengguna berhasil diubah ke ${user.status}.`, data: user });
      }

      if (action === 'reset-password' && method === 'POST') {
        const ok = db.resetUserPassword(userId);
        if (!ok) return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
        return sendJson(res, 200, { success: true, message: 'Password pengguna berhasil di-reset ke default (password123).' });
      }
    }

    // --- AUDIT LOGS API ---
    if (pathname === '/api/audit-logs' && method === 'GET') {
      const logs = db.getAuditLogs(query.q || '');
      return sendJson(res, 200, { success: true, count: logs.length, data: logs });
    }

    // --- SYSTEM CONFIG API ---
    if (pathname === '/api/config' && method === 'GET') {
      const config = db.getConfig();
      return sendJson(res, 200, { success: true, data: config });
    }

    if (pathname === '/api/config' && method === 'PUT') {
      const body = await parseBody(req);
      const updated = db.updateConfig(body, body.user || 'Administrator');
      return sendJson(res, 200, { success: true, message: 'Konfigurasi sistem berhasil disimpan.', data: updated });
    }

    // --- DASHBOARD & STATS API ---
    if (pathname === '/api/dashboard/stats' && method === 'GET') {
      const stats = db.getDashboardStats();
      return sendJson(res, 200, { success: true, data: stats });
    }

    if (pathname === '/api/dashboard/export-excel' && method === 'GET') {
      const list = db.getComplaints();
      const csvHeader = "ID Tiket,Pengadu,Kontak,Lokasi,Kategori,Seksi Disposisi,Status,Timer SLA,Prioritas,Rating,Tanggal\n";
      const csvRows = list.map(c => 
        `"${c.shortId}","${c.nama}","${c.kontak}","${c.lokasi}","${c.kategori}","${c.tujuanDisposisi}","${c.status}","${c.timerSla}","${c.prioritas}","${c.rating}","${c.createdAt}"`
      ).join("\n");

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': 'attachment; filename="laporan-pengaduan-airmadidi-atas.csv"',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(csvHeader + csvRows);
    }

    if (pathname === '/api/dashboard/export-pdf' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        message: 'Endpoint siap dihubungkan dengan Puppeteer atau perintah print browser.',
        generatedAt: new Date().toISOString()
      });
    }

    // Route not found
    return sendJson(res, 404, { success: false, message: `Endpoint ${method} ${pathname} tidak ditemukan.` });

  } catch (error) {
    console.error('API Error:', error);
    return sendJson(res, 500, { success: false, message: 'Internal Server Error', error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SIP-Publik Backend API Server siap dijalankan!`);
  console.log(`📡 URL API: http://localhost:${PORT}/api`);
  console.log(`🩺 Health:  http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

