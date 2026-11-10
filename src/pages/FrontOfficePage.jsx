import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/Common/StatusBadge';
import { categoriesList, sectionsList } from '../data/mockData';

export const FrontOfficePage = () => {
  const {
    complaints,
    verifyAndDisposisi,
    rejectComplaint,
    activeSidebarTab,
    setActiveSidebarTab
  } = useApp();

  const currentTab = activeSidebarTab || 'Pengaduan Masuk';

  const [selectedId, setSelectedId] = useState('ADU-0001');
  const [kategori, setKategori] = useState('Infrastruktur & Lingkungan');
  const [tujuanDisposisi, setTujuanDisposisi] = useState('Seksi Pembangunan');
  const [catatan, setCatatan] = useState('Mohon ditindaklanjuti');

  const selectedComplaint = complaints.find(
    c => c.shortId === selectedId || c.id === selectedId
  ) || complaints[0];

  const sidebarMenu = [
    { title: 'Pengaduan Masuk' },
    { title: 'Klasifikasi Kategori' },
    { title: 'Disposisi' },
    { title: 'Riwayat Status' }
  ];

  const handleVerify = () => {
    if (selectedComplaint) {
      verifyAndDisposisi(selectedComplaint.shortId, kategori, tujuanDisposisi, catatan);
    }
  };

  const handleReject = () => {
    if (selectedComplaint) {
      const reason = prompt('Masukkan alasan penolakan aduan:', 'Data tidak lengkap atau di luar kewenangan kelurahan');
      if (reason) {
        rejectComplaint(selectedComplaint.shortId, reason);
      }
    }
  };

  const handleDisposisiSubmit = (e) => {
    e.preventDefault();
    if (selectedComplaint) {
      verifyAndDisposisi(selectedComplaint.shortId, kategori, tujuanDisposisi, catatan);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <Sidebar
        roleTitle="Petugas Front Office"
        menuItems={sidebarMenu}
        activeItem={currentTab}
        onSelect={setActiveSidebarTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Quick Ticket Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e4e2da] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aduan Terpilih:</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedComplaint?.shortId}</span>
              <StatusBadge status={selectedComplaint?.status} />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">Ganti Aduan:</span>
              <select
                value={selectedComplaint?.shortId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  const found = complaints.find(c => c.shortId === e.target.value);
                  if (found) {
                    setKategori(found.kategori || 'Infrastruktur & Lingkungan');
                    setTujuanDisposisi(found.tujuanDisposisi || 'Seksi Pembangunan');
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#0c4652] outline-none"
              >
                {complaints.map(c => (
                  <option key={c.shortId} value={c.shortId}>
                    {c.shortId} - {c.nama} ({c.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HALAMAN 1: PENGADUAN MASUK */}
          {/* ======================================================== */}
          {currentTab === 'Pengaduan Masuk' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Pengaduan Masuk
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Periksa kelayakan laporan dari masyarakat, lihat foto bukti awal, lalu tetapkan kategori dan teruskan ke meja disposisi.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Table Left (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e4e2da] shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="py-3.5 px-5 font-semibold text-xs text-slate-700">Tiket</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Pengadu</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Lokasi</th>
                        <th className="py-3.5 px-5 font-semibold text-xs text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedId(item.shortId);
                            setKategori(item.kategori || 'Infrastruktur & Lingkungan');
                            setTujuanDisposisi(item.tujuanDisposisi || 'Seksi Pembangunan');
                          }}
                          className={`cursor-pointer transition-colors ${
                            selectedComplaint?.shortId === item.shortId ? 'bg-amber-50/70 font-medium' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3.5 px-5 font-bold text-slate-900">{item.shortId}</td>
                          <td className="py-3.5 px-4 text-slate-700">{item.nama}</td>
                          <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">{item.lokasi}</td>
                          <td className="py-3.5 px-5"><StatusBadge status={item.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Detail Right (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">{selectedComplaint?.shortId} · Detail</h3>
                    <StatusBadge status={selectedComplaint?.status} />
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-900">{selectedComplaint?.detail}</p>
                      <p className="text-slate-500">📍 Lokasi: {selectedComplaint?.lokasi}</p>
                      <p className="text-slate-500">📞 Kontak: {selectedComplaint?.kontak} ({selectedComplaint?.nama})</p>
                    </div>

                    {/* Citizen Photo Display */}
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 mb-1">📸 Foto Laporan Warga:</span>
                      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 relative flex items-center justify-center">
                        {selectedComplaint?.fotoUrl ? (
                          <img src={selectedComplaint.fotoUrl} alt="Foto Warga" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400">Tidak ada lampiran foto.</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleVerify}
                        className="col-span-8 py-2.5 px-4 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                      >
                        Verifikasi & Setujui
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        className="col-span-4 py-2.5 px-4 rounded-xl border border-red-500 hover:bg-red-50 text-red-600 font-semibold text-sm transition"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: KLASIFIKASI KATEGORI */}
          {/* ======================================================== */}
          {currentTab === 'Klasifikasi Kategori' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Klasifikasi Kategori Aduan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Kelompokkan bidang aduan masyarakat agar terdistribusi tepat sasaran ke seksi terkait di kelurahan.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Tentukan Kategori untuk {selectedComplaint?.shortId}
                    </h3>
                    <div className="space-y-2">
                      {categoriesList.map(cat => (
                        <label
                          key={cat}
                          onClick={() => setKategori(cat)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                            kategori === cat ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-sm">{cat}</span>
                          <input type="radio" checked={kategori === cat} onChange={() => {}} className="accent-[#0c4652]" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Ringkasan Masalah</h4>
                    <p className="text-sm font-semibold text-slate-800">{selectedComplaint?.detail}</p>
                    <p className="text-xs text-slate-500">Pelapor: {selectedComplaint?.nama} • {selectedComplaint?.lokasi}</p>
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          verifyAndDisposisi(selectedComplaint?.shortId, kategori, tujuanDisposisi, catatan);
                          setActiveSidebarTab('Disposisi');
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                      >
                        Simpan Kategori & Lanjut ke Disposisi →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: DISPOSISI */}
          {/* ======================================================== */}
          {currentTab === 'Disposisi' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Disposisi ke Seksi Penanganan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Tugaskan aduan yang telah terverifikasi ke seksi pelaksana dan berikan catatan instruksi penanganan.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                <form onSubmit={handleDisposisiSubmit} className="space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Petugas / Seksi Tujuan Disposisi
                    </label>
                    <select
                      value={tujuanDisposisi}
                      onChange={(e) => setTujuanDisposisi(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0c4652] outline-none"
                    >
                      {sectionsList.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Catatan / Instruksi Khusus Disposisi
                    </label>
                    <textarea
                      rows={4}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Contoh: Mohon segera ditindaklanjuti dan kirim bukti foto penanganan..."
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-semibold text-sm shadow transition"
                  >
                    Kirim Disposisi ke Petugas Lapangan
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 4: RIWAYAT STATUS */}
          {/* ======================================================== */}
          {currentTab === 'Riwayat Status' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Riwayat & Status Aduan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Rekapitulasi riwayat status seluruh aduan masyarakat dari awal pengajuan hingga selesai penanganan.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#e4e2da] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="py-3.5 px-5 font-semibold text-xs text-slate-700">Tiket</th>
                      <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Pengadu</th>
                      <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Kategori</th>
                      <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Seksi Disposisi</th>
                      <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Status</th>
                      <th className="py-3.5 px-5 font-semibold text-xs text-slate-700">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-5 font-bold text-slate-900">{item.shortId}</td>
                        <td className="py-3.5 px-4 text-slate-700">{item.nama}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.kategori}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.tujuanDisposisi}</td>
                        <td className="py-3.5 px-4"><StatusBadge status={item.status} /></td>
                        <td className="py-3.5 px-5 text-xs text-slate-400">{item.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
