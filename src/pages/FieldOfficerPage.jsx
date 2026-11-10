import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge, SlaBadge } from '../components/Common/StatusBadge';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';
import { getWhatsAppLink, generateWhatsAppResolvedMessage } from '../utils/phoneValidator';

export const FieldOfficerPage = () => {
  const {
    complaints,
    acceptDisposition,
    returnDisposition,
    updateHandlingProgress,
    uploadProof,
    sendOfficialResponse,
    activeSidebarTab,
    setActiveSidebarTab
  } = useApp();

  const currentTab = activeSidebarTab || 'Disposisi Masuk';

  // Selected complaint state
  const [selectedTicketId, setSelectedTicketId] = useState('ADU-0003');
  const [newStatus, setNewStatus] = useState('Diproses');
  const [catatanProgres, setCatatanProgres] = useState('Survei lokasi dilakukan dan pembersihan sampah sedang berjalan');
  const [buktiNote, setBuktiNote] = useState('Pembersihan sampah liar telah selesai 100% dan diangkut dengan armada truk.');
  const [buktiPreview, setBuktiPreview] = useState('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80');
  const [tanggapanText, setTanggapanText] = useState('Pembersihan telah selesai dilaksanakan bersama tim kelurahan dan dinas kebersihan.');
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  const sidebarMenu = [
    { title: 'Disposisi Masuk' },
    { title: 'Penanganan Aduan' },
    { title: 'Bukti Penyelesaian' },
    { title: 'Tanggapan Resmi' }
  ];

  const activeComplaint = complaints.find(
    c => c.shortId === selectedTicketId || c.id === selectedTicketId
  ) || complaints[0];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProofSubmit = (e) => {
    e.preventDefault();
    if (activeComplaint) {
      uploadProof(activeComplaint.shortId, buktiNote, buktiPreview);
    }
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!tanggapanText.trim()) {
      alert('Tuliskan teks tanggapan resmi terlebih dahulu.');
      return;
    }
    if (activeComplaint) {
      sendOfficialResponse(activeComplaint.shortId, tanggapanText);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <Sidebar
        roleTitle="Petugas Tindak Lanjut"
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
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aduan Aktif:</span>
              <span className="font-extrabold text-slate-900 text-sm">{activeComplaint?.shortId}</span>
              <StatusBadge status={activeComplaint?.status} />
              <SlaBadge timerSla={activeComplaint?.timerSla} isOverdue={activeComplaint?.isOverdue} />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">Ganti Aduan:</span>
              <select
                value={activeComplaint?.shortId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
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
          {/* HALAMAN 1: DISPOSISI MASUK */}
          {/* ======================================================== */}
          {currentTab === 'Disposisi Masuk' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Disposisi Masuk
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Periksa laporan pengaduan dari masyarakat beserta foto lokasi, lalu konfirmasi penerimaan disposisi.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Detail & Citizen Photo (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Detail Laporan Masyarakat</span>
                      <h3 className="text-xl font-extrabold text-slate-900">{activeComplaint?.shortId} · {activeComplaint?.kategori}</h3>
                    </div>
                    <StatusBadge status={activeComplaint?.status} />
                  </div>

                  {/* Citizen Input Photo Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>📸 Foto Laporan dari Masyarakat:</span>
                      <span className="text-slate-400 font-normal">Diunggah saat pelaporan</span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative flex items-center justify-center group">
                      {activeComplaint?.fotoUrl ? (
                        <img
                          src={activeComplaint.fotoUrl}
                          alt="Foto Pengaduan Warga"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-6 text-slate-400 text-xs">
                          <p>Tidak ada lampiran foto langsung dari pengadu.</p>
                          <p className="text-[11px] text-slate-500 mt-1">Menggunakan deskripsi teks lokasi lapangan.</p>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium">
                        📍 Lokasi: {activeComplaint?.lokasi}
                      </div>
                    </div>
                  </div>

                  {/* Citizen Information */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Nama Pengadu:</span>
                      <span className="text-slate-800 font-bold text-sm">{activeComplaint?.nama}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Kontak WhatsApp / HP:</span>
                      <span className="text-slate-800 font-bold text-sm">{activeComplaint?.kontak}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Detail Aduan:</span>
                      <p className="text-slate-800 mt-1 leading-relaxed">{activeComplaint?.detail}</p>
                    </div>
                  </div>
                </div>

                {/* Right Action & Disposition Instructions (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Instruksi Front Office
                  </h3>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <span>📋 Catatan Disposisi:</span>
                    </div>
                    <p className="leading-relaxed">
                      "{activeComplaint?.catatanDisposisi || 'Mohon segera ditindaklanjuti dan dilakukan survei fisik ke lokasi kejadian.'}"
                    </p>
                    <div className="pt-2 text-[11px] text-amber-800 border-t border-amber-200/60 flex justify-between">
                      <span>Tujuan: {activeComplaint?.tujuanDisposisi}</span>
                      <span>SLA: {activeComplaint?.timerSla}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => acceptDisposition(activeComplaint?.shortId)}
                      className="w-full py-3 px-4 rounded-xl bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] text-white font-semibold text-sm shadow transition text-center"
                    >
                      ✓ Konfirmasi / Terima Disposisi
                    </button>
                    <button
                      type="button"
                      onClick={() => returnDisposition(activeComplaint?.shortId)}
                      className="w-full py-3 px-4 rounded-xl border border-red-500 hover:bg-red-50 text-red-600 font-semibold text-sm transition text-center"
                    >
                      ↩ Kembalikan ke Front Office
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                    💡 Setelah dikonfirmasi terima, status aduan otomatis beralih menjadi <b>Diproses</b> dan Anda dapat mengisi catatan progres di menu <b>Penanganan Aduan</b>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 2: PENANGANAN ADUAN */}
          {/* ======================================================== */}
          {currentTab === 'Penanganan Aduan' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Penanganan Aduan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Perbarui tahapan pelaksanaan dan catatan progres lapangan yang akan otomatis tampil pada halaman pelacakan warga.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Update Progres (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Form Pembaruan Progres Lapangan · {activeComplaint?.shortId}
                  </h3>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateHandlingProgress(activeComplaint.shortId, newStatus, catatanProgres);
                  }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Tahapan Status Baru
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                      >
                        <option value="Diproses">Diproses (Sedang ditangani tim lapangan)</option>
                        <option value="Menunggu Koordinasi Lapangan">Menunggu Koordinasi Lapangan / Dinas Terkait</option>
                        <option value="Selesai Penanganan">Selesai Penanganan (Pekerjaan rampung)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Catatan Progres Lapangan (Akan dilihat langsung oleh pengadu/masyarakat)
                      </label>
                      <textarea
                        rows={5}
                        value={catatanProgres}
                        onChange={(e) => setCatatanProgres(e.target.value)}
                        placeholder="Tuliskan perkembangan pekerjaan di lapangan..."
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                    >
                      Simpan & Publikasikan Progres ke Warga
                    </button>
                  </form>
                </div>

                {/* Live Preview Citizen Tracker (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Preview Tampilan di Portal Lacak Warga
                  </div>

                  <div className="p-4 bg-[#fbfbf9] rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase">Status Terkini:</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#b45309]">{newStatus}</span>
                      <StatusBadge status={newStatus} />
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-400 block font-semibold mb-1">Catatan Terakhir:</span>
                      <p className="text-slate-700 italic bg-white p-3 rounded-lg border border-slate-100">
                        "{catatanProgres || 'Penanganan sedang berjalan'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 3: BUKTI PENYELESAIAN (FOTO HASIL PENGERJAAN) */}
          {/* ======================================================== */}
          {currentTab === 'Bukti Penyelesaian' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Unggah Bukti Penyelesaian
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Foto hasil pengerjaan dari petugas yang diunggah di sini <b>akan langsung terkirim dan ditampilkan kepada masyarakat</b> di halaman Lacak Status.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-6">
                {/* Side by Side Comparison: Sebelum vs Sesudah */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before: Citizen's Input Photo */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>1. Foto Laporan dari Masyarakat (Kondisi Awal)</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">Sebelum</span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative flex items-center justify-center">
                      {activeComplaint?.fotoUrl ? (
                        <img
                          src={activeComplaint.fotoUrl}
                          alt="Kondisi Awal"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-slate-400 text-xs">
                          Tidak ada foto awal dari masyarakat.
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Laporan: {activeComplaint?.nama}
                      </div>
                    </div>
                  </div>

                  {/* After: Officer's Completion Photo */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>2. Foto Hasil Pengerjaan Petugas (Kondisi Selesai)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Terkirim ke Warga</span>
                    </div>

                    <div className="rounded-xl overflow-hidden border-2 border-dashed border-[#5794a0] bg-[#fbfdfc] aspect-video relative flex items-center justify-center group">
                      {buktiPreview || activeComplaint?.buktiFotoUrl ? (
                        <img
                          src={buktiPreview || activeComplaint?.buktiFotoUrl}
                          alt="Foto Hasil Pengerjaan"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-slate-400 text-xs">
                          Belum ada foto penyelesaian yang dipilih.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Action Form */}
                <form onSubmit={handleUploadProofSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Pilih Berkas Foto Hasil Pengerjaan / Penyelesaian
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0c4652] file:text-white hover:file:bg-[#083842] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Keterangan Singkat Bukti
                      </label>
                      <input
                        type="text"
                        value={buktiNote}
                        onChange={(e) => setBuktiNote(e.target.value)}
                        placeholder="Contoh: Saluran telah dikeruk dan air mengalir lancar."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-emerald-800 font-medium">
                      ✓ Foto dan catatan ini akan otomatis terkirim dan bisa dilihat warga di halaman Lacak Status.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsWaModalOpen(true)}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                      >
                        <span>📲</span>
                        <span>Preview WA Selesai + Foto</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-semibold text-sm shadow transition"
                      >
                        Unggah & Kirim Bukti ke Warga
                      </button>
                    </div>
                  </div>
                </form>

                {/* Direct WhatsApp Alert Notice */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold block">📲 Notifikasi WhatsApp Penyelesaian:</span>
                    Foto bukti hasil pengerjaan di atas akan otomatis disertakan ke WhatsApp pelapor <strong>({activeComplaint?.kontak})</strong>.
                  </div>
                  <a
                    href={getWhatsAppLink(activeComplaint?.kontak, generateWhatsAppResolvedMessage({
                      ...activeComplaint,
                      buktiFotoUrl: buktiPreview || activeComplaint?.buktiFotoUrl,
                      catatanProgres: buktiNote
                    }))}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <span>Kirim Langsung ke WhatsApp Warga ↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HALAMAN 4: TANGGAPAN RESMI */}
          {/* ======================================================== */}
          {currentTab === 'Tanggapan Resmi' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Tanggapan Resmi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Kirim penjelasan resmi dan pernyataan penuntasan aduan langsung ke pengadu (masyarakat).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Tujuan Pengadu:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{activeComplaint?.nama} ({activeComplaint?.kontak})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Tiket Aduan:</span>
                    <span className="font-bold text-[#0c4652]">{activeComplaint?.shortId} - {activeComplaint?.kategori}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Status Saat Ini:</span>
                    <StatusBadge status={activeComplaint?.status} />
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Template Cepat Tanggapan:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Pembersihan telah rampung dilaksanakan bersama tim kelurahan dan jalan sudah normal kembali.',
                      'Perbaikan fisik telah diselesaikan oleh teknisi lapangan dan berfungsi baik.',
                      'Berkas permohonan telah diverifikasi dan surat pengantar siap diambil di kantor kelurahan.'
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTanggapanText(tpl)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-left transition"
                      >
                        "{tpl.substring(0, 48)}..."
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Textarea */}
                <form onSubmit={handleResponseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pernyataan Tanggapan Resmi Kelurahan
                    </label>
                    <textarea
                      rows={5}
                      value={tanggapanText}
                      onChange={(e) => setTanggapanText(e.target.value)}
                      placeholder="Tuliskan penjelasan penyelesaian..."
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#0c4652] outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-500">
                      Tanggapan ini akan tersimpan dan dapat dibaca pengadu di portal pelacakan aduan serta diteruskan via WhatsApp.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsWaModalOpen(true)}
                        className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
                      >
                        <span>📲</span>
                        <span>Preview WA</span>
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-[#0c4652] hover:bg-[#083842] text-white font-semibold text-sm shadow transition"
                      >
                        Kirim Tanggapan Resmi
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* WhatsApp Preview Modal */}
      <WhatsAppPreviewModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        complaint={{
          ...activeComplaint,
          buktiFotoUrl: buktiPreview || activeComplaint?.buktiFotoUrl,
          catatanProgres: buktiNote,
          tanggapanResmi: tanggapanText
        }}
        type="selesai"
      />
    </div>

        </div>
      </main>
    </div>
  );
};
