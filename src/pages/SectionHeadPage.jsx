import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, SlaBadge } from '../components/Common/StatusBadge';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';
import { getWhatsAppLink, generateWhatsAppResolvedMessage } from '../utils/phoneValidator';

export const SectionHeadPage = () => {
  const {
    complaints,
    processEscalation,
    approveClosure,
    rejectComplaint,
    activeSidebarTab,
    setActiveSidebarTab
  } = useApp();

  const currentTab = activeSidebarTab || 'Pemantauan Seksi';

  const [escalateTicketId, setEscalateTicketId] = useState('ADU-0002');
  const [prioritas, setPrioritas] = useState('Tinggi');
  const [instruksiKhusus, setInstruksiKhusus] = useState('Segera tangani hari ini dan koordinasikan dengan armada lapangan.');

  const [closureTicketId, setClosureTicketId] = useState('ADU-0005');
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [kasieUploads, setKasieUploads] = useState({}); // { [ticketId]: { url, name, size } }

  const sidebarMenu = [
    { title: 'Pemantauan Seksi' },
    { title: 'Eskalasi' },
    { title: 'Approval Penutupan' }
  ];

  const targetEscalate = complaints.find(c => c.shortId === escalateTicketId) || complaints[1];
  const targetClosure = complaints.find(c => c.shortId === closureTicketId) || complaints[4] || complaints[0];

  const currentKasieUpload = kasieUploads[closureTicketId];
  const activeBuktiFoto = currentKasieUpload?.url || targetClosure?.buktiFotoUrl || null;

  const handleKasiePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi format file gambar
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Format file tidak didukung! Harap unggah foto dengan format JPG, JPEG, atau PNG.');
      return;
    }

    // Validasi ukuran file (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar! Maksimal ukuran file foto adalah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 900;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        setKasieUploads(prev => ({
          ...prev,
          [closureTicketId]: {
            url: compressedDataUrl,
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB'
          }
        }));
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveKasiePhoto = () => {
    setKasieUploads(prev => {
      const updated = { ...prev };
      delete updated[closureTicketId];
      return updated;
    });
  };

  const handleEscalateSubmit = (e) => {
    e.preventDefault();
    processEscalation(escalateTicketId, prioritas, instruksiKhusus);
  };

  const handleApproveClosure = () => {
    const finalPhoto = activeBuktiFoto || targetClosure?.buktiFotoUrl;
    if (!finalPhoto) {
      if (!confirm('Foto tanda approval di sebelah kanan belum diunggah. Tetap setujui closure tanpa foto baru?')) {
        return;
      }
    }
    approveClosure(closureTicketId, finalPhoto);

    // Pastikan foto tetap tersimpan di kasieUploads agar foto TETAP ada di sebelah kanan
    if (finalPhoto) {
      setKasieUploads(prev => ({
        ...prev,
        [closureTicketId]: {
          url: finalPhoto,
          name: currentKasieUpload?.name || `bukti_approval_${closureTicketId}.jpg`,
          size: currentKasieUpload?.size || 'Foto Resmi Kasie'
        }
      }));
    }
  };

  const handleRejectClosure = () => {
    const reason = catatanRevisi || prompt('Alasan penolakan closure:', 'Foto bukti penyelesaian kurang jelas.');
    if (reason) {
      rejectComplaint(closureTicketId, reason);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <Sidebar
        roleTitle="Kepala Seksi (Kasie)"
        menuItems={sidebarMenu}
        activeItem={currentTab}
        onSelect={setActiveSidebarTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ======================================================== */}
          {/* HALAMAN 1: PEMANTAUAN SEKSI */}
          {/* ======================================================== */}
          {currentTab === 'Pemantauan Seksi' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Pemantauan Seksi
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Pantau progres penanganan aduan, penugasan petugas lapangan, dan batas waktu SLA.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Seksi Pembangunan
                  </span>
                </div>
              </div>

              {/* SLA Table */}
              <div className="bg-white rounded-2xl border border-[#e4e2da] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="py-3.5 px-5 font-semibold text-xs text-slate-700">Tiket</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Pengadu & Lokasi</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Petugas</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-xs text-slate-700">Timer SLA</th>
                        <th className="py-3.5 px-5 font-semibold text-xs text-slate-700 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900">
                            {item.shortId}
                          </td>
                          <td className="py-4 px-4 text-slate-700">
                            <span className="font-semibold block">{item.nama}</span>
                            <span className="text-xs text-slate-500 truncate block max-w-[200px]">{item.lokasi}</span>
                          </td>
                          <td className="py-4 px-4 text-slate-700 text-xs">
                            {item.petugas || 'Petugas 1'}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="py-4 px-4">
                            <SlaBadge timerSla={item.timerSla} isOverdue={item.isOverdue} />
                          </td>
                          <td className="py-4 px-5 text-right space-x-2">
                            {item.isOverdue && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEscalateTicketId(item.shortId);
                                  setActiveSidebarTab('Eskalasi');
                                }}
                                className="py-1.5 px-3 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-medium text-xs shadow-sm transition"
                              >
                                Eskalasi
                              </button>
                            )}
                            {item.status === 'Selesai Penanganan' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setClosureTicketId(item.shortId);
                                  setActiveSidebarTab('Approval Penutupan');
                                }}
                                className="py-1.5 px-3 rounded-lg bg-[#0c4652] hover:bg-[#083842] text-white font-medium text-xs shadow-sm transition"
                              >
                                Review Closure
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: ESKALASI */}
          {/* ======================================================== */}
          {currentTab === 'Eskalasi' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Eskalasi Aduan Bermasalah
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Tetapkan prioritas darurat dan instruksi percepatan untuk aduan yang lambat ditangani atau melampaui batas waktu SLA.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Eskalasi (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Form Eskalasi · {escalateTicketId}
                  </h3>

                  <form onSubmit={handleEscalateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Pilih Aduan yang Diekskalasi
                      </label>
                      <select
                        value={escalateTicketId}
                        onChange={(e) => setEscalateTicketId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#b91c1c] outline-none"
                      >
                        {complaints.map(c => (
                          <option key={c.shortId} value={c.shortId}>
                            {c.shortId} - {c.nama} ({c.timerSla})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Tingkat Prioritas Baru
                      </label>
                      <select
                        value={prioritas}
                        onChange={(e) => setPrioritas(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#b91c1c] outline-none"
                      >
                        <option value="Tinggi">Tinggi (Perlu penanganan hari ini)</option>
                        <option value="Darurat / Mendesak">Darurat / Mendesak (Prioritas Utama Kelurahan)</option>
                        <option value="Sedang">Sedang</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Instruksi Khusus Kepala Seksi
                      </label>
                      <textarea
                        rows={4}
                        value={instruksiKhusus}
                        onChange={(e) => setInstruksiKhusus(e.target.value)}
                        placeholder="Segera tangani hari ini..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#b91c1c] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-sm shadow transition"
                    >
                      Proses Eskalasi Sekarang
                    </button>
                  </form>
                </div>

                {/* Info Card Tiket (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Informasi Masalah Terkini
                  </h4>

                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2 text-rose-950">
                    <div className="font-extrabold text-sm text-rose-900">{targetEscalate?.shortId} · {targetEscalate?.nama}</div>
                    <p className="leading-relaxed">"{targetEscalate?.detail}"</p>
                    <div className="pt-2 border-t border-rose-200/60 flex justify-between font-semibold">
                      <span>Status: {targetEscalate?.status}</span>
                      <span className="text-red-700 font-extrabold">{targetEscalate?.timerSla}</span>
                    </div>
                  </div>

                  {targetEscalate?.fotoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                      <img src={targetEscalate.fotoUrl} alt="Foto Aduan" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: APPROVAL PENUTUPAN */}
          {/* ======================================================== */}
          {currentTab === 'Approval Penutupan' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Approval Penutupan Aduan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Periksa foto bukti pengerjaan fisik dan tanggapan resmi dari petugas sebelum menutup tiket secara resmi.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Pilih Tiket Siap Ditutup:</span>
                    <select
                      value={closureTicketId}
                      onChange={(e) => setClosureTicketId(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-[#0c4652] focus:ring-2 focus:ring-[#0c4652] outline-none"
                    >
                      {complaints.filter(c => c.status === 'Selesai Penanganan' || c.status === 'Selesai' || c.shortId === 'ADU-0005').map(c => (
                        <option key={c.shortId} value={c.shortId}>
                          {c.shortId} - {c.nama} ({c.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <StatusBadge status={targetClosure?.status} />
                </div>

                {/* Comparison Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Foto Laporan Warga */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">1. Foto Laporan Warga (Masalah Awal)</span>
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 relative">
                      {targetClosure?.fotoUrl ? (
                        <img src={targetClosure.fotoUrl} alt="Foto Awal" className="w-full h-full object-cover" />
                      ) : (
                        <div className="p-6 text-center text-slate-400 text-xs">Tidak ada foto awal.</div>
                      )}
                    </div>
                  </div>

                  {/* Foto Bukti Penanganan Petugas / Kasie (Sebelah Kanan) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 block">
                        2. Foto Tanda Approval Penutupan (Sebelah Kanan)
                      </span>
                      {activeBuktiFoto ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span>✓</span> {currentKasieUpload ? 'Diunggah Kasie' : 'Foto Selesai Terlampir'}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Foto Ditambahkan di Sini
                        </span>
                      )}
                    </div>

                    {/* Area Foto di Sebelah Kanan */}
                    <div className="rounded-xl overflow-hidden border-2 border-dashed border-emerald-500/50 aspect-video bg-emerald-950/10 relative flex flex-col items-center justify-center shadow-xs">
                      {activeBuktiFoto ? (
                        <div className="relative w-full h-full">
                          <img
                            src={activeBuktiFoto}
                            alt="Foto Tanda Approval Selesai"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-[#0c4652] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <span>📸</span>
                            <span>Tanda Approval Ditutup</span>
                          </div>
                          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs p-1 rounded-lg">
                            <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 transition">
                              <span>📷</span>
                              <span>Ganti Foto</span>
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleKasiePhotoChange}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveKasiePhoto}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 transition"
                            >
                              <span>✕</span>
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-full p-4 hover:bg-emerald-50/60 rounded-xl transition">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0c4652] flex items-center justify-center text-2xl shadow-sm">
                            📸
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-bold text-[#0c4652] block">
                              + Klik untuk Mengunggah Foto di Sini
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              Foto tanda approval ditutup akan ditambahkan di sebelah kanan
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                              Foto ini yang otomatis dikirim ke WhatsApp pengadu
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleKasiePhotoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Keterangan Status Foto Sebelah Kanan & WhatsApp */}
                    <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base text-emerald-600">📲</span>
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block text-[11px]">
                            {activeBuktiFoto ? 'Foto siap dikirim ke WhatsApp Pengadu' : 'Belum ada foto yang diunggah'}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            Penerima: {targetClosure?.nama} (+62 {targetClosure?.kontak})
                          </span>
                        </div>
                      </div>
                      <label className="shrink-0 cursor-pointer px-2.5 py-1.5 bg-[#0c4652] hover:bg-[#083842] text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs transition">
                        <span>📁</span>
                        <span>{activeBuktiFoto ? 'Ganti' : 'Pilih Foto'}</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleKasiePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tanggapan Resmi Petugas */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                  <span className="font-bold text-slate-700 block">Pernyataan Tanggapan Resmi Petugas Lapangan:</span>
                  <p className="text-slate-800 italic">
                    "{targetClosure?.tanggapanResmi || 'Pekerjaan fisik telah diselesaikan sesuai standar operasional.'}"
                  </p>
                </div>

                {/* Form Action Closure */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Catatan revisi (diisi jika permohonan penutupan ditolak / perlu perbaikan ulang)
                    </label>
                    <input
                      type="text"
                      value={catatanRevisi}
                      onChange={(e) => setCatatanRevisi(e.target.value)}
                      placeholder="Tuliskan alasan penolakan atau instruksi perbaikan..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handleApproveClosure}
                      className="flex-1 w-full py-3 px-6 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      <span>Setujui Closure (Tutup Tiket Selesai)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWaModalOpen(true)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                    >
                      <span>📲</span>
                      <span>Kirim ke WhatsApp Pengadu (+Foto)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectClosure}
                      className="w-full sm:w-auto py-3 px-5 rounded-xl border border-red-500 hover:bg-red-50 text-red-600 font-semibold text-sm transition"
                    >
                      ✕ Tolak & Minta Revisi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* WhatsApp Preview Modal for Closure */}
      <WhatsAppPreviewModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        complaint={{
          ...targetClosure,
          buktiFotoUrl: activeBuktiFoto,
          buktiFotoName: currentKasieUpload?.name
        }}
        type="selesai"
      />
    </div>
  );
};
