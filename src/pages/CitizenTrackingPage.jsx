import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { StatusBadge } from '../components/Common/StatusBadge';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';
import { getWhatsAppLink, generateWhatsAppReceivedMessage, generateWhatsAppResolvedMessage } from '../utils/phoneValidator';

export const CitizenTrackingPage = () => {
  const {
    complaints,
    trackingTicketId,
    setTrackingTicketId,
    submitReview
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackingTicketId || 'ADU-2026-0001');
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waModalType, setWaModalType] = useState('selesai');

  // Find complaint by exact id or shortId
  const currentComplaint = complaints.find(
    c => c.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
         c.shortId.toLowerCase() === searchQuery.trim().toLowerCase()
  ) || complaints[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setTrackingTicketId(searchQuery.trim());
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (currentComplaint) {
      submitReview(currentComplaint.id, rating, komentar);
      setKomentar('');
    }
  };

  // Determine step status
  const getStepState = (stepIndex) => {
    const status = currentComplaint?.status;
    let currentStep = 3;

    if (status === 'Baru') currentStep = 0;
    else if (status === 'Terverifikasi') currentStep = 1;
    else if (status === 'Didisposisikan') currentStep = 2;
    else if (status === 'Diproses') currentStep = 3;
    else if (status === 'Selesai Penanganan' || status === 'Selesai') currentStep = 4;
    else if (status === 'Ditolak') currentStep = 1;

    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Top Search Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#e4e2da] shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            Lacak Status Pengaduan
          </h2>

          <form onSubmit={handleSearch}>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nomor Tiket
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ADU-2026-0001"
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition"
              />
              <button
                type="submit"
                className="py-2.5 px-6 rounded-lg bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] text-white font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
              >
                Cari / Lacak
              </button>
            </div>
          </form>

          {/* Quick ticket switcher tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Contoh tiket:</span>
            {complaints.slice(0, 5).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchQuery(c.id);
                  setTrackingTicketId(c.id);
                }}
                className={`px-2.5 py-1 rounded-md border text-xs transition ${
                  currentComplaint?.id === c.id
                    ? 'bg-[#0c4652] text-white border-[#0c4652]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.shortId} ({c.status})
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Tracker Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-[#e4e2da] shadow-sm space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NOMOR TIKET
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentComplaint?.id || 'ADU-2026-0001'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pengadu: <span className="font-semibold text-slate-700">{currentComplaint?.nama}</span> • {currentComplaint?.lokasi}
                </p>
              </div>

              <div>
                <StatusBadge status={currentComplaint?.status || 'Diproses'} />
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-3 space-y-7 pb-4">
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-200" />

              {/* Step 1 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className="w-6 h-6 rounded-full bg-[#0c4652] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pengaduan diterima</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Aduan tersimpan dan menunggu verifikasi</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  getStepState(1) !== 'pending' ? 'bg-[#0c4652] text-white' : 'bg-slate-300'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${getStepState(1) !== 'pending' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Terverifikasi
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Front Office menetapkan kategori: <b>{currentComplaint?.kategori}</b></p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  getStepState(2) !== 'pending' ? 'bg-[#0c4652] text-white' : 'bg-slate-300'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${getStepState(2) !== 'pending' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Didisposisikan
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Diteruskan ke <b>{currentComplaint?.tujuanDisposisi}</b> ({currentComplaint?.petugas || 'Petugas 1'})</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  getStepState(3) === 'active' ? 'bg-[#f59e0b] ring-4 ring-amber-100' : getStepState(3) === 'completed' ? 'bg-[#0c4652]' : 'bg-slate-300'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${getStepState(3) === 'active' ? 'text-[#b45309]' : getStepState(3) === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Diproses
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    📢 <b>Update dari Petugas:</b> {currentComplaint?.catatanProgres || 'Petugas sedang melakukan peninjauan lapangan.'}
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start gap-4 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  getStepState(4) !== 'pending' ? 'bg-[#15803d] text-white' : 'bg-slate-300'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${getStepState(4) !== 'pending' ? 'text-[#15803d]' : 'text-slate-400'}`}>
                    Selesai
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Penanganan rampung dan telah diverifikasi Kepala Seksi.</p>
                </div>
              </div>
            </div>

            {/* FOTO DOKUMENTASI: Sebelum vs Sesudah */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📸 Dokumentasi Foto Penanganan:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Citizen Report Photo */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Foto Laporan Anda (Masyarakat)
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 relative flex items-center justify-center">
                    {currentComplaint?.fotoUrl ? (
                      <img src={currentComplaint.fotoUrl} alt="Foto Laporan" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Tidak ada lampiran foto awal.</span>
                    )}
                  </div>
                </div>

                {/* Officer Completion Photo */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-800 block">
                    Foto Bukti Penyelesaian dari Petugas
                  </span>
                  <div className="rounded-xl overflow-hidden border-2 border-emerald-500/40 aspect-video bg-emerald-950/20 relative flex items-center justify-center">
                    {currentComplaint?.buktiFotoUrl ? (
                      <img src={currentComplaint.buktiFotoUrl} alt="Bukti Hasil Petugas" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400 text-center px-4">
                        Foto hasil pengerjaan akan tampil di sini setelah petugas mengunggahnya.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tanggapan Resmi Kelurahan Card */}
              {currentComplaint?.tanggapanResmi && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-emerald-900 block">
                    🏛️ Tanggapan Resmi Kelurahan Airmadidi Atas:
                  </span>
                  <p className="text-xs text-emerald-800 leading-relaxed italic">
                    "{currentComplaint.tanggapanResmi}"
                  </p>
                </div>
              )}

              {/* WHATSAPP NOTIFICATION TRACKING CARD */}
              <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📲</span>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-950">
                        Status Pengiriman Notifikasi WhatsApp Resmi
                      </h5>
                      <span className="text-[11px] text-emerald-700">
                        Nomor Penerima: <strong>{currentComplaint?.kontak || '08xx-xxxx-xxxx'}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setWaModalType(currentComplaint?.status === 'Selesai' || currentComplaint?.status === 'Selesai Penanganan' ? 'selesai' : 'terima');
                        setIsWaModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1"
                    >
                      <span>👁️</span>
                      <span>Lihat Simulasi WA</span>
                    </button>
                    <a
                      href={getWhatsAppLink(
                        currentComplaint?.kontak,
                        currentComplaint?.status === 'Selesai' || currentComplaint?.status === 'Selesai Penanganan'
                          ? generateWhatsAppResolvedMessage(currentComplaint)
                          : generateWhatsAppReceivedMessage(currentComplaint)
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center gap-1"
                    >
                      <span>Buka di WA ↗</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <div>
                      <span className="font-semibold text-slate-800 block">Notifikasi Kasus Diterima</span>
                      <span className="text-[10px] text-slate-500">Nomor tiket & link lacak terkirim</span>
                    </div>
                  </div>
                  <div className={`p-2.5 bg-white rounded-lg border flex items-center gap-2 ${
                    currentComplaint?.status === 'Selesai' || currentComplaint?.status === 'Selesai Penanganan'
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 opacity-60'
                  }`}>
                    <span className={currentComplaint?.status === 'Selesai' || currentComplaint?.status === 'Selesai Penanganan' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                      {currentComplaint?.status === 'Selesai' || currentComplaint?.status === 'Selesai Penanganan' ? '✓' : '○'}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800 block">Notifikasi Selesai + Bukti Foto</span>
                      <span className="text-[10px] text-slate-500">
                        {currentComplaint?.buktiFotoUrl ? 'Foto pengerjaan terlampir' : 'Menunggu penyelesaian'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Review Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-[#e4e2da] shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Beri Ulasan
              </h3>
              <p className="text-xs text-slate-500">
                Tersedia untuk pengaduan berstatus Selesai atau Selesai Penanganan.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Star Rating */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'text-[#f59e0b] fill-current'
                          : 'text-slate-300 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Komentar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Komentar
                </label>
                <textarea
                  rows={4}
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  placeholder="Tuliskan pengalaman Anda..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition resize-none"
                />
              </div>

              {/* Button Kirim Ulasan */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] text-white font-semibold text-sm shadow-sm transition-colors text-center"
              >
                Kirim Ulasan
              </button>
            </form>

            {currentComplaint?.ulasan && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Ulasan Anda Sebelumnya ({currentComplaint.rating} ★):</span>
                <p className="text-amber-800">"{currentComplaint.ulasan}"</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* WhatsApp Modal Preview */}
      <WhatsAppPreviewModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        complaint={currentComplaint}
        type={waModalType}
      />
    </div>
  );
};
