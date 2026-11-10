import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialComplaints, initialUsers, initialAuditLogs, initialConfig } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Load state from localStorage or initial data
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('sip_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sip_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('sip_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [systemConfig, setSystemConfig] = useState(() => {
    const saved = localStorage.getItem('sip_config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  // Current active navigation: 'login', 'citizen-form', 'citizen-tracking', 'dashboard'
  const [currentPage, setCurrentPage] = useState('citizen-form');
  // Current logged in user (null if public citizen)
  const [currentUser, setCurrentUser] = useState(null);
  // Active internal sidebar tab (e.g., 'Pengaduan Masuk', 'Penanganan Aduan', etc.)
  const [activeSidebarTab, setActiveSidebarTab] = useState('');
  // Active ticket being tracked by citizen
  const [trackingTicketId, setTrackingTicketId] = useState('ADU-2026-0001');
  // Notification toast
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sip_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('sip_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sip_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sip_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addAuditLog = (aktivitas, user = currentUser?.username || 'Warga') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog = {
      id: Date.now(),
      aktivitas,
      user,
      waktu: timeStr
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Submit new complaint from Citizen Form
  const submitComplaint = (formData) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ADU-2026-${randomNum}`;
    const shortId = `ADU-${String(complaints.length + 1).padStart(4, '0')}`;

    const newComplaint = {
      id: newId,
      shortId: shortId,
      nama: formData.nama,
      kontak: formData.kontak,
      lokasi: formData.lokasi,
      detail: formData.detail,
      kategori: 'Infrastruktur & Lingkungan',
      tujuanDisposisi: 'Seksi Pembangunan',
      catatanDisposisi: '',
      status: 'Baru',
      statusTimeline: 'Pengaduan diterima',
      petugas: 'Belum Ditugaskan',
      timerSla: 'Sisa 3 hari',
      isOverdue: false,
      prioritas: 'Sedang',
      instruksiKhusus: '',
      fotoUrl: formData.fotoUrl || null,
      buktiFoto: formData.fotoUrl ? [formData.fotoUrl] : (formData.fotoName ? [formData.fotoName] : []),
      buktiPenyelesaian: null,
      buktiFotoUrl: null,
      tanggapanResmi: '',
      catatanProgres: '',
      catatanRevisi: '',
      waNotifications: [
        {
          type: 'terima',
          phone: formData.kontak,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Terkirim ke WhatsApp Warga'
        }
      ],
      rating: 0,
      ulasan: '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setComplaints(prev => [newComplaint, ...prev]);
    addAuditLog(`Pengaduan baru ${newId} (Notifikasi WA terkirim ke ${formData.kontak})`, formData.nama);
    setTrackingTicketId(newId);
    showToast(`Pengaduan berhasil dikirim! Notifikasi WA terkirim ke ${formData.kontak}`);
    return newId;
  };

  // Front office action: Verify & Setuju Disposisi
  const verifyAndDisposisi = (shortIdOrId, kategori, tujuanDisposisi, catatan) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: 'Didisposisikan',
          statusTimeline: 'Didisposisikan',
          kategori: kategori || c.kategori,
          tujuanDisposisi: tujuanDisposisi || c.tujuanDisposisi,
          catatanDisposisi: catatan || 'Mohon ditindaklanjuti',
          petugas: 'Petugas 1'
        };
      }
      return c;
    }));
    addAuditLog(`Disposisi ${shortIdOrId} ke ${tujuanDisposisi}`, currentUser?.username || 'petugas.a');
    showToast(`Pengaduan ${shortIdOrId} berhasil didisposisikan!`);
  };

  // Front office action: Tolak aduan
  const rejectComplaint = (shortIdOrId, alasan = 'Tidak memenuhi syarat kelayakan aduan.') => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: 'Ditolak',
          statusTimeline: 'Ditolak',
          catatanRevisi: alasan
        };
      }
      return c;
    }));
    addAuditLog(`Penolakan aduan ${shortIdOrId}`, currentUser?.username || 'petugas.a');
    showToast(`Pengaduan ${shortIdOrId} ditolak.`, 'error');
  };

  // Field officer: Terima/Konfirmasi Disposisi
  const acceptDisposition = (shortIdOrId) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: 'Diproses',
          statusTimeline: 'Diproses',
          catatanProgres: 'Disposisi diterima oleh petugas lapangan.'
        };
      }
      return c;
    }));
    addAuditLog(`Konfirmasi disposisi ${shortIdOrId}`, currentUser?.username || 'petugas.b');
    showToast(`Disposisi ${shortIdOrId} berhasil diterima.`);
  };

  // Field officer: Kembalikan Disposisi
  const returnDisposition = (shortIdOrId) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: 'Terverifikasi',
          statusTimeline: 'Terverifikasi',
          catatanDisposisi: 'Dikembalikan oleh petugas lapangan untuk penyesuaian seksi.'
        };
      }
      return c;
    }));
    addAuditLog(`Pengembalian disposisi ${shortIdOrId}`, currentUser?.username || 'petugas.b');
    showToast(`Disposisi ${shortIdOrId} dikembalikan ke Front Office.`, 'info');
  };

  // Field officer: Perbarui Status & Progres
  const updateHandlingProgress = (shortIdOrId, newStatus, catatanProgres) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: newStatus,
          statusTimeline: newStatus,
          catatanProgres: catatanProgres || c.catatanProgres
        };
      }
      return c;
    }));
    addAuditLog(`Update status ${shortIdOrId}: ${newStatus}`, currentUser?.username || 'petugas.b');
    showToast(`Status penanganan ${shortIdOrId} berhasil diperbarui.`);
  };

  // Field officer: Unggah Bukti Penyelesaian
  const uploadProof = (shortIdOrId, proofNote, proofPhotoUrl = null) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        const notifs = c.waNotifications || [];
        notifs.push({
          type: 'selesai',
          phone: c.kontak,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Terkirim ke WhatsApp Warga',
          buktiFotoUrl: proofPhotoUrl || c.buktiFotoUrl
        });
        return {
          ...c,
          buktiPenyelesaian: proofNote || 'Pekerjaan perbaikan fisik di lapangan telah rampung.',
          buktiFotoUrl: proofPhotoUrl || c.buktiFotoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
          waNotifications: notifs
        };
      }
      return c;
    }));
    addAuditLog(`Unggah bukti penyelesaian ${shortIdOrId} & notifikasi WA terkirim`, currentUser?.username || 'petugas.b');
    showToast(`Bukti penyelesaian ${shortIdOrId} berhasil diunggah! Notifikasi WhatsApp terkirim ke warga.`);
  };

  // Field officer: Kirim Tanggapan Resmi
  const sendOfficialResponse = (shortIdOrId, tanggapan) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          tanggapanResmi: tanggapan,
          status: 'Selesai Penanganan',
          statusTimeline: 'Selesai Penanganan'
        };
      }
      return c;
    }));
    addAuditLog(`Kirim tanggapan resmi ${shortIdOrId}`, currentUser?.username || 'petugas.b');
    showToast(`Tanggapan resmi untuk ${shortIdOrId} berhasil dikirim.`);
  };

  // Section Head (Kasie): Eskalasi Aduan
  const processEscalation = (shortIdOrId, prioritas, instruksiKhusus) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          prioritas: prioritas || 'Tinggi',
          instruksiKhusus: instruksiKhusus || 'Segera tangani hari ini',
          timerSla: 'Prioritas Eskalasi (Hari Ini)'
        };
      }
      return c;
    }));
    addAuditLog(`Eskalasi ${shortIdOrId} [${prioritas}]`, currentUser?.username || 'kasie.bang');
    showToast(`Eskalasi untuk ${shortIdOrId} berhasil diproses!`);
  };

  // Section Head (Kasie): Setujui Closure
  const approveClosure = (shortIdOrId) => {
    setComplaints(prev => prev.map(c => {
      if (c.shortId === shortIdOrId || c.id === shortIdOrId) {
        return {
          ...c,
          status: 'Selesai',
          statusTimeline: 'Selesai'
        };
      }
      return c;
    }));
    addAuditLog(`Approval closure ${shortIdOrId} & penutupan resmi`, currentUser?.username || 'kasie.bang');
    showToast(`Aduan ${shortIdOrId} telah disetujui ditutup resmi (Closure Selesai). Notifikasi WA penutupan terkirim.`);
  };

  // Citizen: Kirim rating & ulasan
  const submitReview = (id, rating, ulasan) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id || c.shortId === id) {
        return {
          ...c,
          rating: rating,
          ulasan: ulasan
        };
      }
      return c;
    }));
    addAuditLog(`Ulasan warga untuk tiket ${id}`);
    showToast('Terima kasih, ulasan Anda berhasil dikirim!');
  };

  // Auth: Login function with strict unique password verification
  const login = (roleKey, username, password) => {
    const defaultCredentials = {
      'petugas.a': { role: 'Petugas Front Office', roleKey: 'front_office', page: 'front-office', tab: 'Pengaduan Masuk', pass: 'frontoffice123', name: 'Petugas A' },
      'petugas.b': { role: 'Petugas Tindak Lanjut', roleKey: 'field_officer', page: 'field-officer', tab: 'Penanganan Aduan', pass: 'tindaklanjut123', name: 'Petugas B' },
      'kasie.bang': { role: 'Kepala Seksi (Kasie)', roleKey: 'section_head', page: 'section-head', tab: 'Pemantauan Seksi', pass: 'kasiebang123', name: 'Kasie Pembangunan' },
      'lurah.airmadidi': { role: 'Lurah / Sekretaris Lurah', roleKey: 'leader', page: 'leader-dashboard', tab: 'Dashboard Statistik', pass: 'lurah2026', name: 'Lurah Airmadidi Atas' },
      'admin.sip': { role: 'Administrator Sistem', roleKey: 'admin', page: 'admin', tab: 'Manajemen Akun', pass: 'admin2026', name: 'Administrator Utama' }
    };

    const target = defaultCredentials[username];
    if (!target) {
      return {
        success: false,
        message: `Username '${username}' tidak terdaftar dalam sistem.`
      };
    }

    if (!password || password !== target.pass) {
      return {
        success: false,
        message: `Kata sandi salah! Akun ${target.name} (${username}) memiliki kata sandi khusus. Anda tidak dapat login menggunakan kata sandi akun lain.`
      };
    }

    const userObj = {
      nama: target.name,
      username: username,
      role: target.role,
      roleKey: target.roleKey
    };

    setCurrentUser(userObj);
    setCurrentPage(target.page);
    setActiveSidebarTab(target.tab);
    addAuditLog('Login berhasil', username);
    showToast(`Selamat datang, ${target.name} (${target.role})!`);
    return { success: true };
  };

  const logout = () => {
    addAuditLog('Logout sistem', currentUser?.username);
    setCurrentUser(null);
    setCurrentPage('login');
    showToast('Anda telah keluar dari sesi internal.');
  };

  // Admin user operations
  const addUser = (newUser) => {
    const user = {
      id: Date.now(),
      nama: newUser.nama,
      username: newUser.username,
      role: newUser.role,
      roleKey: newUser.roleKey || 'front_office',
      status: 'Aktif'
    };
    setUsers(prev => [...prev, user]);
    addAuditLog(`Tambah user ${newUser.username}`, currentUser?.username || 'admin');
    showToast(`Pengguna ${newUser.nama} berhasil ditambahkan!`);
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        addAuditLog(`Ubah status ${u.username} -> ${nextStatus}`, currentUser?.username || 'admin');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast('Status pengguna berhasil diubah.');
  };

  const updateConfig = (newValues) => {
    setSystemConfig(prev => ({ ...prev, ...newValues }));
    addAuditLog('Simpan konfigurasi sistem', currentUser?.username || 'admin');
    showToast('Konfigurasi sistem berhasil disimpan!');
  };

  return (
    <AppContext.Provider
      value={{
        complaints,
        users,
        auditLogs,
        systemConfig,
        currentPage,
        setCurrentPage,
        currentUser,
        setCurrentUser,
        activeSidebarTab,
        setActiveSidebarTab,
        trackingTicketId,
        setTrackingTicketId,
        toast,
        showToast,
        submitComplaint,
        verifyAndDisposisi,
        rejectComplaint,
        acceptDisposition,
        returnDisposition,
        updateHandlingProgress,
        uploadProof,
        sendOfficialResponse,
        processEscalation,
        approveClosure,
        submitReview,
        login,
        logout,
        addUser,
        toggleUserStatus,
        updateConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

