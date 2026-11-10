import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { 
  validateIndonesianPhone12Digit, 
  formatIndonesianPhone,
  normalizeIndonesianPhone,
  getWhatsAppLink,
  generateWhatsAppReceivedMessage
} from '../utils/phoneValidator';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';

export const CitizenFormPage = () => {
  const { submitComplaint, setCurrentPage, complaints } = useApp();

  // Load draft from localStorage so personal data is never lost unexpectedly
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('sip_citizen_form_draft');
      return saved ? JSON.parse(saved) : {
        nama: '',
        kontak: '',
        lokasi: '',
        detail: '',
        fotoName: '',
        fotoUrl: null
      };
    } catch (e) {
      return {
        nama: '',
        kontak: '',
        lokasi: '',
        detail: '',
        fotoName: '',
        fotoUrl: null
      };
    }
  });

  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  // Auto-save any typed changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sip_citizen_form_draft', JSON.stringify(formData));
    } catch (e) {}
  }, [formData]);

  // Phone validation status
  const phoneValidation = validateIndonesianPhone12Digit(formData.kontak);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'kontak') {
      setPhoneTouched(true);
      // Auto-format Indonesian phone
      const raw = normalizeIndonesianPhone(value);
      // Limit to 12 digits max
      const trimmed = raw.slice(0, 12);
      const formatted = formatIndonesianPhone(trimmed);
      setFormData(prev => ({ ...prev, kontak: formatted }));

      const check = validateIndonesianPhone12Digit(trimmed);
      setPhoneError(check.errorMessage);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, fotoName: file.name, fotoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    const empty = {
      nama: '',
      kontak: '',
      lokasi: '',
      detail: '',
      fotoName: '',
      fotoUrl: null
    };
    setFormData(empty);
    try {
      localStorage.removeItem('sip_citizen_form_draft');
    } catch (e) {}
    setPhoneError(null);
    setPhoneTouched(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Strict 12-digit Indonesian phone verification
    const valResult = validateIndonesianPhone12Digit(formData.kontak);
    if (!valResult.isValid) {
      setPhoneError(valResult.errorMessage);
      setPhoneTouched(true);
      alert(`Format Nomor WhatsApp Tidak Valid:\n${valResult.errorMessage}`);
      return;
    }

    if (!formData.nama.trim() || !formData.detail.trim()) {
      alert('Mohon lengkapi Nama Pengadu dan Detail Aduan.');
      return;
    }

    const payload = {
      ...formData,
      kontak: '+62 ' + valResult.formatted
    };

    const ticketId = submitComplaint(payload);
    setSubmittedTicket(ticketId);
    
    // Find or construct the complaint object for WhatsApp notification
    const newComplaintObj = {
      id: ticketId,
      shortId: ticketId,
      nama: formData.nama,
      kontak: '+62 ' + valResult.formatted,
      lokasi: formData.lokasi,
      detail: formData.detail,
      kategori: 'Infrastruktur & Lingkungan',
      tujuanDisposisi: 'Seksi Pembangunan',
      status: 'Baru',
      fotoUrl: formData.fotoUrl
    };
    setSubmittedComplaint(newComplaintObj);

    // Clear saved draft since it is successfully submitted
    try {
      localStorage.removeItem('sip_citizen_form_draft');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* WhatsApp Notification Modal */}
        <WhatsAppPreviewModal
          isOpen={isWaModalOpen}
          onClose={() => setIsWaModalOpen(false)}
          complaint={submittedComplaint}
          type="terima"
        />

        {/* Success Modal / Banner if just submitted */}
        {submittedTicket && submittedComplaint && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-sm space-y-4 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Pengaduan Berhasil Disimpan & Diterima!
                  </h3>
                </div>
                <p className="text-sm text-emerald-800 mt-1">
                  Nomor tiket pelacakan Anda: <span className="font-extrabold text-emerald-900 text-base">{submittedTicket}</span>.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('citizen-tracking')}
                  className="px-4 py-2 rounded-lg bg-[#0c4652] hover:bg-[#083842] text-white text-xs font-semibold shadow transition"
                >
                  Lacak Status Sekarang →
                </button>
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setSubmittedComplaint(null);
                    handleReset();
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  Buat Aduan Baru
                </button>
              </div>
            </div>

            {/* DIRECT WHATSAPP NOTIFICATION ALERT CARD */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center text-xl shrink-0 mt-0.5">
                  📲
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>Notifikasi WhatsApp Penerimaan Kasus Terkirim</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Terkirim ke: {submittedComplaint.kontak}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Konfirmasi penerimaan resmi dari SIP-Publik Kelurahan Airmadidi Atas beserta nomor tiket dan tautan pelacakan telah diteruskan ke WhatsApp Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWaModalOpen(true)}
                  className="flex-1 md:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition flex items-center justify-center gap-1.5"
                >
                  <span>👁️</span>
                  <span>Lihat Chat WhatsApp</span>
                </button>
                <a
                  href={getWhatsAppLink(submittedComplaint.kontak, generateWhatsAppReceivedMessage(submittedComplaint))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Buka di WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-[#e4e2da] shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Ajukan Pengaduan
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sampaikan keluhan atau masukan Anda. Notifikasi otomatis penerimaan dan penyelesaian kasus (beserta bukti foto) akan langsung dikirimkan ke nomor WhatsApp resmi Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Nama & Kontak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Pengadu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama lengkap sesuai KTP"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nomor Telepon / WhatsApp Resmi <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      phoneValidation.isValid 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : (phoneValidation.length > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-400')
                    }`}>
                      {phoneValidation.length}/11 Digit
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">
                      🇮🇩 +62
                    </div>
                    <input
                      type="text"
                      name="kontak"
                      value={formData.kontak}
                      onChange={handleChange}
                      placeholder="812-3456-7890"
                      required
                      className={`w-full pl-20 pr-10 py-2.5 rounded-lg border text-sm transition focus:outline-none font-mono ${
                        phoneTouched && !phoneValidation.isValid
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500'
                          : phoneValidation.isValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-600'
                          : 'border-slate-300 bg-white focus:ring-2 focus:ring-[#0c4652]'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {phoneValidation.isValid ? (
                        <span className="text-emerald-600 font-bold text-sm" title="Nomor resmi valid">✓</span>
                      ) : phoneTouched && (
                        <span className="text-rose-500 font-bold text-sm" title="Format tidak valid">!</span>
                      )}
                    </div>
                  </div>

                  {/* Phone Validation Feedback */}
                  {phoneTouched && phoneError ? (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{phoneError}</span>
                    </p>
                  ) : phoneValidation.isValid ? (
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                      <span>✓</span>
                      <span>Nomor WhatsApp resmi valid (+62 {formData.kontak}).</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cukup ketik angka mulai dari 8 (contoh: 812-3456-7890), tidak perlu ketik 0 lagi.
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Lokasi Kejadian */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lokasi Kejadian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Jl. contoh, Lingkungan I / RT / RW, Kelurahan Airmadidi Atas"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition"
                />
              </div>

              {/* Row 3: Detail Aduan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detail Aduan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="detail"
                  rows={4}
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="Jelaskan masalah secara rinci (kronologi, dampak, dan kondisi terkini)..."
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4652] focus:border-transparent transition resize-none"
                />
              </div>

              {/* Row 4: Lampiran Foto / Berkas Pendukung */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lampiran Foto / Berkas Laporan Awal
                </label>
                <label className="border-2 border-dashed border-[#5794a0] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#fbfdfc] hover:bg-[#f2f8f9] transition group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  {formData.fotoUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={formData.fotoUrl} alt="Preview" className="h-32 rounded-lg object-cover border border-slate-200 shadow-xs" />
                      <span className="text-xs font-semibold text-emerald-800">✓ Foto berhasil dipilih: {formData.fotoName || 'foto_laporan.jpg'} (Klik untuk ganti)</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-sm font-semibold text-[#0c4652] group-hover:underline">
                        Tarik berkas foto ke sini atau klik untuk memilih
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Format JPG, PNG, PDF. Foto ini akan diteruskan ke petugas lapangan untuk verifikasi.
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Row 5: Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={phoneTouched && !phoneValidation.isValid}
                  className="py-2.5 px-6 rounded-lg bg-[#0c4652] hover:bg-[#083842] active:bg-[#062c34] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Kirim Pengaduan & Notifikasi WhatsApp</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-6 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Right Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Alur Pengaduan Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e4e2da] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">
                Alur Pengaduan
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0c4652] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    Anda kirim pengaduan
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0c4652] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    Front Office memverifikasi
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0c4652] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    Petugas menindaklanjuti
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    Selesai, beri ulasan
                  </span>
                </div>
              </div>
            </div>

            {/* Setelah Terkirim Alert Box */}
            <div className="bg-[#dcfce7] rounded-2xl p-6 border border-[#bbf7d0]">
              <h4 className="text-sm font-bold text-[#14532d] mb-1.5">
                Setelah terkirim
              </h4>
              <p className="text-xs text-[#166534] leading-relaxed">
                Halaman konfirmasi menampilkan nomor tiket unik untuk melacak status aduan secara real-time.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
