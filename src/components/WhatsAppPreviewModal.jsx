import React, { useState } from 'react';
import { getWhatsAppLink } from '../utils/phoneValidator';

export const WhatsAppPreviewModal = ({ isOpen, onClose, complaint, type = 'terima' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !complaint) return null;

  const isResolved = type === 'selesai' || complaint.status === 'Selesai' || complaint.status === 'Selesai Penanganan';
  const shortId = complaint.shortId || complaint.id;
  const rawPhone = complaint.kontak || '';
  const photoUrl = complaint.buktiFotoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  const messageText = isResolved
    ? `*SIP-PUBLIK KELURAHAN AIRMADIDI ATAS*\n✅ *Pemberitahuan Resmi Penyelesaian Pengaduan*\n\nYth. Bpk/Ibu *${complaint.nama || 'Warga'}*,\n\nKabar baik! Pengaduan Anda dengan nomor tiket *${shortId}* telah *SELESAI DITANGANI* oleh tim petugas lapangan Kelurahan Airmadidi Atas.\n\n📋 *Nomor Tiket:* ${shortId}\n📍 *Lokasi:* ${complaint.lokasi || '-'}\n🛠️ *Petugas:* ${complaint.petugas || 'Tim Lapangan'}\n📝 *Catatan Pengerjaan:* ${complaint.catatanProgres || 'Pekerjaan perbaikan fisik di lapangan telah selesai 100%.'}\n💬 *Tanggapan Resmi:* ${complaint.tanggapanResmi || 'Saluran/fasilitas telah dinormalisasi.'}\n\n📸 *BUKTI FOTO PENYELESAIAN:*\n${photoUrl}\n\nMohon berikan rating ulasan:\n🔗 http://localhost:3000/#/track?id=${shortId}\n\nTerima kasih!`
    : `*SIP-PUBLIK KELURAHAN AIRMADIDI ATAS*\n🏛️ *Pemberitahuan Resmi Penerimaan Pengaduan*\n\nYth. Bpk/Ibu *${complaint.nama || 'Warga'}*,\n\nPengaduan Anda telah *DITERIMA & DIVERIFIKASI* oleh Kelurahan Airmadidi Atas:\n\n📋 *Nomor Tiket:* ${shortId}\n📍 *Lokasi:* ${complaint.lokasi || '-'}\n📂 *Kategori:* ${complaint.kategori || 'Infrastruktur & Lingkungan'}\n🎯 *Tujuan Disposisi:* ${complaint.tujuanDisposisi || 'Seksi Pembangunan'}\n⏱️ *Estimasi SLA:* 3 Hari Kerja\n\n🔗 *Lacak Progres Real-Time:*\nhttp://localhost:3000/#/track?id=${shortId}\n\nTerima kasih atas laporan Anda.`;

  const waUrl = getWhatsAppLink(rawPhone, messageText);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#efeae2] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#128c7e] border border-white/20 flex items-center justify-center font-bold text-white text-sm">
                🏛️
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                <span>SIP-Publik Airmadidi Atas</span>
                <span className="text-emerald-300 text-xs" title="Akun Resmi Terverifikasi">✓</span>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>Akun Bisnis Resmi Kelurahan</span>
                <span>•</span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#d4cdb4_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Date Badge */}
          <div className="flex justify-center">
            <span className="bg-white/80 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
              Hari Ini
            </span>
          </div>

          {/* Encryption Notice */}
          <div className="bg-[#ffeecd] text-[#54656f] text-[11px] text-center p-2 rounded-lg shadow-2xs border border-amber-200/50 leading-relaxed">
            🔒 Pesan resmi ini dikirimkan otomatis oleh sistem SIP-Publik ke nomor WhatsApp resmi warga <span className="font-semibold text-slate-800">({rawPhone})</span>.
          </div>

          {/* Message Bubble (Outgoing from SIP-Publik) */}
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] text-slate-800 rounded-2xl rounded-tr-xs p-3.5 max-w-[90%] shadow-md border border-[#c1e7a6] text-xs leading-relaxed space-y-2">
              
              {/* Header inside chat */}
              <div className="font-bold text-[#075e54] border-b border-emerald-300/60 pb-1 flex items-center justify-between">
                <span>{isResolved ? '✅ ADUAN SELESAI DITANGANI' : '🏛️ ADUAN DITERIMA & DIVERIFIKASI'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                  {shortId}
                </span>
              </div>

              {/* Greeting */}
              <p>Yth. Bpk/Ibu <strong className="text-slate-900">{complaint.nama || 'Warga'}</strong>,</p>

              {/* Description */}
              {isResolved ? (
                <p>Kabar baik! Pengaduan Anda telah <strong className="text-emerald-700">SELESAI DITANGANI</strong> oleh tim lapangan Kelurahan Airmadidi Atas.</p>
              ) : (
                <p>Pengaduan Anda telah <strong className="text-emerald-700">DITERIMA & DIVERIFIKASI</strong> dan sedang diteruskan ke Seksi terkait untuk penanganan lapangan.</p>
              )}

              {/* Detail Box */}
              <div className="bg-white/70 p-2.5 rounded-lg border border-emerald-200/70 space-y-1 font-mono text-[11px]">
                <div>📍 <strong>Lokasi:</strong> {complaint.lokasi || '-'}</div>
                <div>📂 <strong>Kategori:</strong> {complaint.kategori || 'Infrastruktur'}</div>
                {isResolved && (
                  <>
                    <div>🛠️ <strong>Petugas:</strong> {complaint.petugas || 'Tim Lapangan'}</div>
                    <div>📝 <strong>Catatan:</strong> {complaint.catatanProgres || 'Pekerjaan selesai 100%'}</div>
                  </>
                )}
              </div>

              {/* PHOTO ATTACHMENT CARD (Especially for Selesai) */}
              {isResolved && (
                <div className="mt-2 bg-white rounded-xl overflow-hidden border border-emerald-300 shadow-sm">
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Bukti Foto Pengerjaan"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#075e54] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      📸 Bukti Foto Lapangan (Selesai)
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50/70 text-[11px] text-emerald-900 flex items-center justify-between">
                    <span className="truncate">bukti_pengerjaan_{shortId}.jpg</span>
                    <a
                      href={photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline text-[#075e54] hover:text-emerald-800"
                    >
                      Buka Foto ↗
                    </a>
                  </div>
                </div>
              )}

              {/* Link CTA */}
              <div className="pt-1 border-t border-emerald-200/50 text-[11px] text-slate-600">
                🔗 <strong>Link Portal:</strong> <span className="text-blue-600 underline">http://localhost:3000/#/track?id={shortId}</span>
              </div>

              {/* Timestamp & Blue Double Checkmarks */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-1">
                <span>{currentTime}</span>
                <span className="text-blue-500 font-bold" title="Terkirim & Dibaca (Double Blue Tick)">✓✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white p-3.5 border-t border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
            >
              <span>📲</span>
              <span>Buka Chat WhatsApp Resmi</span>
            </a>
            <button
              onClick={handleCopy}
              className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition border border-slate-300"
              title="Salin teks pesan"
            >
              {copied ? '✓ Tersalin' : '📋 Salin'}
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400">
            Pemberitahuan terkirim ke nomor WhatsApp resmi warga ({rawPhone})
          </p>
        </div>

      </div>
    </div>
  );
};

