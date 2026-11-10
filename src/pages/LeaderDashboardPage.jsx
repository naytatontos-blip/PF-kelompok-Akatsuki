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
    showToast('Mengekspor laporan eksekutif format PDF...');
    window.print();
  };

  const handleExportExcel = () => {
    showToast('Mengekspor data tabel pengaduan format Excel (.xlsx)...');
    const csvHeader = "ID Tiket,Pengadu,Kontak,Lokasi,Kategori,Seksi,Status,Timer SLA,Rating,Tanggal\n";
    const csvRows = complaints.map(c => 
      `"${c.shortId}","${c.nama}","${c.kontak}","${c.lokasi}","${c.kategori}","${c.tujuanDisposisi}","${c.status}","${c.timerSla}","${c.rating}","${c.createdAt}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "laporan-kinerja-airmadidi-atas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
