import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, SlaBadge } from '../components/Common/StatusBadge';

export const LeaderDashboardPage = () => {
  const {
    complaints,
    activeSidebarTab,
    setActiveSidebarTab,
    showToast
  } = useApp();

  const currentTab = activeSidebarTab || 'Dashboard Statistik';

  const [periode, setPeriode] = useState('Okt 2026');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarMenu = [
    { title: 'Dashboard Statistik' },
    { title: 'Akses Data & Laporan' },
    { title: 'Ekspor Laporan Kinerja' }
  ];

  const handleExportPDF = () => {
    showToast('Menyiapkan format dokumen resmi laporan pengaduan untuk cetak/PDF...');
    
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const tanggalFormat = today.toLocaleDateString('id-ID', options);

    const total = complaints.length;
    const inProgress = complaints.filter(c => ['Baru', 'Terverifikasi', 'Didisposisikan', 'Diproses'].includes(c.status)).length;
    const done = complaints.filter(c => ['Selesai Penanganan', 'Selesai'].includes(c.status)).length;

    const rowsHtml = complaints.map((c, i) => `
      <tr style="border-bottom: 1px solid #cbd5e1; ${i % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
        <td style="padding: 7px 6px; text-align: center; font-size: 8.5pt;">${i + 1}</td>
        <td style="padding: 7px 6px; font-weight: bold; font-family: monospace; font-size: 8.5pt;">${c.shortId || c.id}</td>
        <td style="padding: 7px 6px; font-size: 8.5pt;">${c.nama || '-'}</td>
        <td style="padding: 7px 6px; font-size: 8pt; color: #334155;">${c.lokasi || '-'}</td>
        <td style="padding: 7px 6px; font-size: 8pt;">${c.kategori || '-'}</td>
        <td style="padding: 7px 6px; font-size: 8pt;">${c.tujuanDisposisi || '-'}</td>
        <td style="padding: 7px 6px; text-align: center; font-size: 8pt; font-weight: 600;">
          <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; ${c.status === 'Selesai Penanganan' || c.status === 'Selesai' ? 'background: #dcfce7; color: #166534;' : 'background: #fef3c7; color: #92400e;'}">
            ${c.status}
          </span>
        </td>
        <td style="padding: 7px 6px; text-align: center; font-size: 8pt; color: #475569;">${c.timerSla || '-'}</td>
      </tr>
    `).join('');

    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Laporan_Rekapitulasi_Pengaduan_Kelurahan_Airmadidi_Atas</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 10mm 15mm 10mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 15px;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .action-bar {
            position: sticky;
            top: 0;
            background: #0c4652;
            color: #ffffff;
            padding: 10px 18px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .action-bar button {
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
          }
          .btn-print { background: #22c55e; color: #ffffff; }
          .btn-close { background: #ef4444; color: #ffffff; margin-left: 8px; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0 !important; }
          }
          .kop-wrapper {
            border-bottom: 3px double #0f172a;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .kop-logo {
            position: absolute;
            left: 15px;
            top: 4px;
            width: 65px;
            height: 65px;
          }
          .kop-text {
            text-align: center;
            line-height: 1.25;
          }
          .kop-text h4 { margin: 0; font-size: 11pt; letter-spacing: 1px; font-weight: bold; text-transform: uppercase; color: #334155; }
          .kop-text h3 { margin: 2px 0; font-size: 13pt; letter-spacing: 1.5px; font-weight: bold; text-transform: uppercase; color: #1e293b; }
          .kop-text h2 { margin: 2px 0; font-size: 16pt; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; color: #0c4652; }
          .kop-text p { margin: 3px 0 0; font-size: 8.5pt; color: #475569; }
          .title-section {
            text-align: center;
            margin-bottom: 16px;
          }
          .title-section h3 {
            margin: 0;
            font-size: 12pt;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-decoration: underline;
          }
          .title-section p {
            margin: 3px 0 0;
            font-size: 9pt;
            color: #475569;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 8.5pt;
          }
          .summary-table th {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 6px;
            text-align: center;
          }
          .summary-table td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11pt;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5pt;
            margin-bottom: 24px;
          }
          .data-table th {
            background-color: #0c4652 !important;
            color: #ffffff !important;
            border: 1px solid #082f37;
            padding: 8px 6px;
            text-align: left;
            font-size: 8pt;
            text-transform: uppercase;
          }
          .data-table td {
            border: 1px solid #e2e8f0;
          }
          .signature-box {
            display: flex;
            justify-content: flex-end;
            margin-top: 24px;
            page-break-inside: avoid;
          }
          .sig-block {
            width: 260px;
            text-align: center;
            font-size: 9.5pt;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="action-bar no-print">
          <div>
            <strong>🏛️ SIP-Publik: Format Cetak Laporan Resmi Pemerintah Kelurahan</strong>
            <span style="font-size: 11px; opacity: 0.85; margin-left: 10px;">(Tampilan dokumen laporan siap cetak / simpan ke PDF)</span>
          </div>
          <div>
            <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
            <button class="btn-close" onclick="window.close()">✕ Tutup</button>
          </div>
        </div>

        <div class="kop-wrapper">
          <div class="kop-logo">
            <svg viewBox="0 0 100 100" width="65" height="65">
              <polygon points="50,5 95,30 95,75 50,98 5,75 5,30" fill="#0c4652" />
              <polygon points="50,12 87,34 87,71 50,90 13,71 13,34" fill="#ffffff" />
              <polygon points="50,18 80,38 80,67 50,83 20,67 20,38" fill="#b45309" />
              <text x="50" y="55" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">🏛️</text>
            </svg>
          </div>
          <div class="kop-text">
            <h4>PEMERINTAH KABUPATEN MINAHASA UTARA</h4>
            <h3>KECAMATAN AIRMADIDI</h3>
            <h2>KELURAHAN AIRMADIDI ATAS</h2>
            <p>Jl. Raya Manado - Bitung, Kelurahan Airmadidi Atas, Kecamatan Airmadidi, Kode Pos 95371</p>
            <p>Laman: <em>airmadidiatas.minut.go.id</em> | Layanan SIP-Publik: <em>0812-4400-5511</em></p>
          </div>
        </div>

        <div class="title-section">
          <h3>LAPORAN REKAPITULASI PENGADUAN & ASPIRASI MASYARAKAT</h3>
          <p>Sistem Informasi Pelayanan Pengaduan Publik (SIP-Publik) Kelurahan Airmadidi Atas</p>
          <p style="font-size: 8pt; color: #64748b; margin-top: 2px;">Tanggal Cetak: <strong>${tanggalFormat}</strong> &bull; Klasifikasi: Dokumen Rekapitulasi Eksekutif</p>
        </div>

        <table class="summary-table">
          <tr>
            <th>Total Pengaduan Warga</th>
            <th>Dalam Proses Penanganan</th>
            <th>Selesai Dituntaskan</th>
            <th>Indeks Kepuasan Layanan (IKM)</th>
          </tr>
          <tr>
            <td style="color: #0c4652;">${total} Berkas</td>
            <td style="color: #c2410c;">${inProgress} Berkas</td>
            <td style="color: #15803d;">${done} Berkas</td>
            <td style="color: #0f172a;">4,3 ★ (Sangat Memuaskan)</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 3%; text-align: center;">No</th>
              <th style="width: 12%;">No. Tiket</th>
              <th style="width: 15%;">Nama Pengadu</th>
              <th style="width: 20%;">Lokasi / Lingkungan</th>
              <th style="width: 16%;">Kategori Bidang</th>
              <th style="width: 16%;">Seksi Disposisi</th>
              <th style="width: 10%; text-align: center;">Status</th>
              <th style="width: 8%; text-align: center;">SLA</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="signature-box">
          <div class="sig-block">
            <p style="margin: 0;">Airmadidi Atas, ${tanggalFormat}</p>
            <p style="margin: 3px 0 0; font-weight: bold;">LURAH AIRMADIDI ATAS,</p>
            <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-size: 8pt; color: #94a3b8; font-style: italic;">
              [ Tanda Tangan & Cap Jabatan ]
            </div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">MARTSEN R. TONTOS, S.STP</p>
            <p style="margin: 2px 0 0; font-size: 8.5pt; color: #475569;">NIP. 19850314 200801 1 003</p>
          </div>
        </div>

      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch (err) {}
      }, 500);
    } else {
      alert('Popup terblokir oleh peramban. Mohon izinkan popup untuk mencetak laporan resmi.');
    }
  };

  const handleExportExcel = () => {
    showToast('Menyiapkan dan mengunduh berkas Spreadsheet Excel (.csv)...');

    const headers = [
      "No",
      "Nomor Tiket",
      "Tanggal Laporan",
      "Nama Pengadu",
      "Kontak WhatsApp",
      "Lokasi Kejadian",
      "Kategori Pengaduan",
      "Rincian Keluhan / Masalah",
      "Seksi Penanggung Jawab",
      "Status Pengaduan",
      "Prioritas Kasus",
      "Timer SLA",
      "Rating Kepuasan Warga",
      "Catatan Penyelesaian Lapangan"
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const text = String(val).replace(/"/g, '""');
      return `"${text}"`;
    };

    const csvRows = [headers.map(escapeCell).join(";")];

    complaints.forEach((c, idx) => {
      csvRows.push([
        idx + 1,
        c.shortId || c.id,
        c.createdAt || "2026-10-15",
        c.nama || "-",
        c.kontak || "-",
        c.lokasi || "-",
        c.kategori || "-",
        c.detail || "-",
        c.tujuanDisposisi || "-",
        c.status || "-",
        c.prioritas || "Sedang",
        c.timerSla || "-",
        c.rating ? `${c.rating} Bintang` : "Belum Dinilai",
        c.tanggapanResmi || c.instruksiKhusus || "-"
      ].map(escapeCell).join(";"));
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `Laporan_Rekapitulasi_Pengaduan_Kelurahan_Airmadidi_Atas_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Berkas Excel (.csv) berhasil diunduh!');
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus !== 'Semua' && c.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (filterKategori !== 'Semua' && c.kategori.toLowerCase() !== filterKategori.toLowerCase()) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return c.shortId.toLowerCase().includes(term) || c.nama.toLowerCase().includes(term) || c.lokasi.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <Sidebar
        roleTitle="Lurah / Sekretaris Lurah"
        menuItems={sidebarMenu}
        activeItem={currentTab}
        onSelect={setActiveSidebarTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ======================================================== */}
          {/* HALAMAN 1: DASHBOARD STATISTIK */}
          {/* ======================================================== */}
          {currentTab === 'Dashboard Statistik' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard Statistik
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Ringkasan eksekutif pengaduan masyarakat. Data agregat kinerja pelayanan kelurahan.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="py-2.5 px-5 rounded-lg bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] text-white font-semibold text-sm shadow-sm transition-colors text-center"
                  >
                    Ekspor PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="py-2.5 px-5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors text-center"
                  >
                    Ekspor Excel
                  </button>
                </div>
              </div>

              {/* Filter Bar Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Periode</label>
                    <input
                      type="text"
                      value={periode}
                      onChange={(e) => setPeriode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Semua">Semua</option>
                      <option value="Baru">Baru</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori</label>
                    <select
                      value={filterKategori}
                      onChange={(e) => setFilterKategori(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    >
                      <option value="Semua">Semua</option>
                      <option value="Infrastruktur & Lingkungan">Infrastruktur & Lingkungan</option>
                      <option value="Kebersihan">Kebersihan</option>
                      <option value="Layanan Adminduk">Layanan Adminduk</option>
                      <option value="Keamanan">Keamanan</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => showToast(`Data statistik diperbarui untuk periode ${periode}.`)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-semibold text-sm shadow transition"
                    >
                      Tampilkan Data
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
                  <span className="text-xs font-semibold text-slate-600">Total Pengaduan</span>
                  <div className="text-4xl font-extrabold text-slate-900 mt-2">128</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
                  <span className="text-xs font-semibold text-slate-600">Dalam Proses</span>
                  <div className="text-4xl font-extrabold text-[#c2410c] mt-2">34</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
                  <span className="text-xs font-semibold text-slate-600">Selesai</span>
                  <div className="text-4xl font-extrabold text-[#15803d] mt-2">87</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
                  <span className="text-xs font-semibold text-slate-600">Rata-rata Rating</span>
                  <div className="text-4xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-1">
                    4,3 <span className="text-xs text-amber-500 font-bold">★</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-900">Pengaduan per Kategori</h3>
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 w-36 truncate">Infrastruktur</span>
                        <div className="flex-1 mx-3 h-5 bg-transparent rounded-full flex items-center">
                          <div className="h-4 rounded-full bg-[#0c4652]" style={{ width: '80%' }} />
                        </div>
                        <span className="text-slate-800 font-semibold w-8 text-right">46</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 w-36 truncate">Kebersihan</span>
                        <div className="flex-1 mx-3 h-5 bg-transparent rounded-full flex items-center">
                          <div className="h-4 rounded-full bg-[#0c4652]" style={{ width: '60%' }} />
                        </div>
                        <span className="text-slate-800 font-semibold w-8 text-right">35</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 w-36 truncate">Layanan Adminduk</span>
                        <div className="flex-1 mx-3 h-5 bg-transparent rounded-full flex items-center">
                          <div className="h-4 rounded-full bg-[#f59e0b]" style={{ width: '45%' }} />
                        </div>
                        <span className="text-slate-800 font-semibold w-8 text-right">26</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 w-36 truncate">Keamanan</span>
                        <div className="flex-1 mx-3 h-5 bg-transparent rounded-full flex items-center">
                          <div className="h-4 rounded-full bg-[#b45309]" style={{ width: '30%' }} />
                        </div>
                        <span className="text-slate-800 font-semibold w-8 text-right">17</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm flex flex-col justify-between">
                  <h3 className="text-base font-bold text-slate-900 mb-6">Tren Bulanan</h3>
                  <div className="h-48 flex items-end justify-around gap-4 px-4 pb-4 border-b border-slate-100">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full max-w-[48px] rounded-t-lg bg-[#95b0aa]" style={{ height: '70px' }} />
                      <span className="text-[11px] text-slate-500 font-medium">Jul</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full max-w-[48px] rounded-t-lg bg-[#95b0aa]" style={{ height: '110px' }} />
                      <span className="text-[11px] text-slate-500 font-medium">Agu</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full max-w-[48px] rounded-t-lg bg-[#95b0aa]" style={{ height: '85px' }} />
                      <span className="text-[11px] text-slate-500 font-medium">Sep</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full max-w-[48px] rounded-t-lg bg-[#0c4652] shadow-md" style={{ height: '150px' }} />
                      <span className="text-[11px] font-bold text-[#0c4652]">Okt</span>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Rata-rata penyelesaian: 2,4 hari</span>
                    <span className="text-emerald-700 font-semibold">Tingkat kepuasan: 94%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: AKSES DATA & LAPORAN */}
          {/* ======================================================== */}
          {currentTab === 'Akses Data & Laporan' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Akses Data & Laporan Lengkap
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Eksplorasi seluruh basis data laporan warga secara komprehensif.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#e4e2da] shadow-sm flex items-center gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan tiket, nama warga, atau lokasi..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                />
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="py-2 px-4 rounded-lg bg-[#0c4652] text-white text-xs font-semibold"
                >
                  Download CSV
                </button>
              </div>

              {/* Full Data Table */}
              <div className="bg-white rounded-2xl border border-[#e4e2da] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-xs text-slate-700">
                        <th className="py-3 px-4 font-bold">Tiket</th>
                        <th className="py-3 px-4 font-bold">Pengadu</th>
                        <th className="py-3 px-4 font-bold">Lokasi</th>
                        <th className="py-3 px-4 font-bold">Kategori</th>
                        <th className="py-3 px-4 font-bold">Seksi Bertugas</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredComplaints.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.shortId}</td>
                          <td className="py-3.5 px-4 text-slate-800 font-semibold">{item.nama}</td>
                          <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">{item.lokasi}</td>
                          <td className="py-3.5 px-4 text-slate-700">{item.kategori}</td>
                          <td className="py-3.5 px-4 text-slate-700">{item.tujuanDisposisi}</td>
                          <td className="py-3.5 px-4"><StatusBadge status={item.status} /></td>
                          <td className="py-3.5 px-4 font-bold text-amber-600">{item.rating ? `${item.rating} ★` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: EKSPOR LAPORAN KINERJA */}
          {/* ======================================================== */}
          {currentTab === 'Ekspor Laporan Kinerja' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Pusat Ekspor Laporan Kinerja
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Unduh berkas rekapitulasi kinerja pelayanan publik kelurahan dalam format PDF atau Excel Spreadsheet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Ekspor Dokumen PDF Eksekutif</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Menghasilkan format siap cetak laporan ringkasan bulanan dengan grafik, rekapitulasi kepuasan masyarakat, dan statistik penanganan seksi.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="w-full py-3 px-4 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                  >
                    📄 Cetak & Unduh Dokumen PDF
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Ekspor Data Mentah Excel / CSV</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mengunduh seluruh baris data pengaduan beserta kontak, lokasi, status, SLA, dan rating warga untuk analisis data mendalam di Microsoft Excel atau Google Sheets.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="w-full py-3 px-4 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-semibold text-sm shadow transition"
                  >
                    📊 Unduh Spreadsheet (.csv / .xlsx)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
