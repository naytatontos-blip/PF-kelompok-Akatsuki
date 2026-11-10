/**
 * Modul Validasi dan Pengelolaan Nomor Telepon Resmi Indonesia & Notifikasi WhatsApp
 * Kelurahan Airmadidi Atas - SIP-Publik
 * 
 * Ketentuan:
 * Pada tampilan antarmuka dengan awalan +62, pengguna langsung menginput angka mulai dari 8
 * (contoh: 812-3456-7890) tanpa perlu mengetik 0 atau 08 lagi.
 */

/**
 * Normalisasi nomor telepon ke format angka tanpa awalan 0 atau 62.
 * Menghasilkan string angka yang langsung diawali dengan angka 8.
 */
export const normalizeIndonesianPhone = (phone) => {
  if (!phone) return '';
  // Ambil hanya karakter angka
  let digits = String(phone).replace(/\D/g, '');
  
  // Jika diawali 62, buang 62
  if (digits.startsWith('62')) {
    digits = digits.slice(2);
  }
  
  // Jika diawali 0, buang semua 0 di awal sehingga langsung mulai dari 8
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  return digits;
};

/**
 * Format nomor telepon Indonesia setelah +62 dengan pemisah tanda hubung: 8xx-xxxx-xxxx
 * (Contoh: 812-3456-7890)
 */
export const formatIndonesianPhone = (phone) => {
  const digits = normalizeIndonesianPhone(phone);
  if (!digits) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 12)}`;
};

/**
 * Validasi ketat nomor telepon resmi Indonesia (input mulai dari 8 setelah awalan +62)
 * Ketentuan:
 * 1. Harus diawali dengan '8' (karena +62 sudah ada di UI)
 * 2. Panjang 10 - 12 digit setelah +62 (standar resmi 11 digit, setara 12 digit jika diawali 08)
 * 3. Menggunakan prefix operator seluler resmi Indonesia
 */
export const validateIndonesianPhone12Digit = (phone) => {
  const digits = normalizeIndonesianPhone(phone);
  
  if (!digits) {
    return {
      isValid: false,
      digits: '',
      formatted: '',
      length: 0,
      errorMessage: 'Nomor WhatsApp wajib diisi.'
    };
  }

  if (!digits.startsWith('8')) {
    return {
      isValid: false,
      digits,
      formatted: digits,
      length: digits.length,
      errorMessage: 'Nomor setelah +62 harus langsung diawali angka 8 (contoh: 812-xxxx-xxxx). Tidak perlu mengetik 0 lagi.'
    };
  }

  // Prefix operator Indonesia yang valid (setelah 0 dibuang, 3 digit pertama: 8xx):
  // Telkomsel: 811, 812, 813, 821, 822, 823, 851, 852, 853
  // Indosat: 814, 815, 816, 855, 856, 857, 858
  // XL: 817, 818, 819, 859, 877, 878
  // Axis: 831, 832, 833, 838
  // Tri: 895, 896, 897, 898, 899
  // Smartfren: 881, 882, 883, 884, 885, 886, 887, 888, 889
  const prefix = digits.substring(0, 3);
  const validPrefixes = [
    '811', '812', '813', '814', '815', '816', '817', '818', '819',
    '821', '822', '823',
    '831', '832', '833', '838',
    '851', '852', '853', '855', '856', '857', '858', '859',
    '877', '878',
    '881', '882', '883', '884', '885', '886', '887', '888', '889',
    '895', '896', '897', '898', '899'
  ];

  const hasValidPrefix = validPrefixes.includes(prefix);

  if (digits.length < 10 || digits.length > 12) {
    return {
      isValid: false,
      digits,
      formatted: formatIndonesianPhone(digits),
      length: digits.length,
      errorMessage: `Nomor setelah +62 harus 10-12 digit angka (standar resmi 11 digit). Saat ini: ${digits.length} digit.`
    };
  }

  if (!hasValidPrefix) {
    return {
      isValid: false,
      digits,
      formatted: formatIndonesianPhone(digits),
      length: digits.length,
      errorMessage: `Prefix operator "0${prefix}" tidak dikenal sebagai operator seluler resmi Indonesia.`
    };
  }

  return {
    isValid: true,
    digits,
    formatted: formatIndonesianPhone(digits),
    length: digits.length,
    errorMessage: null
  };
};

/**
 * Buat URL link WhatsApp Web / API (wa.me)
 */
export const getWhatsAppLink = (phone, message) => {
  const digits = normalizeIndonesianPhone(phone);
  return `https://api.whatsapp.com/send?phone=62${digits}&text=${encodeURIComponent(message)}`;
};

/**
 * Buat teks notifikasi resmi WhatsApp saat aduan DITERIMA & DIVERIFIKASI
 */
export const generateWhatsAppReceivedMessage = (complaint) => {
  const shortId = complaint.shortId || complaint.id;
  const baseUrl = typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost:3000';
  
  return (
`*SIP-PUBLIK KELURAHAN AIRMADIDI ATAS*
🏛️ *Pemberitahuan Resmi Penerimaan Pengaduan*

Yth. Bpk/Ibu *${complaint.nama || 'Warga'}*,

Terima kasih atas laporan Anda. Pengaduan Anda telah *DITERIMA & DIVERIFIKASI* dalam sistem SIP-Publik Kelurahan Airmadidi Atas:

📋 *Nomor Tiket:* ${shortId} (${complaint.id})
📍 *Lokasi Kejadian:* ${complaint.lokasi || '-'}
📂 *Kategori:* ${complaint.kategori || 'Infrastruktur & Lingkungan'}
🎯 *Tujuan Disposisi:* ${complaint.tujuanDisposisi || 'Seksi Pembangunan'}
⏱️ *Estimasi SLA:* 3 Hari Kerja

Status saat ini: *Pengaduan Telah Diteruskan ke Tim Teknis Lapangan.*

Anda dapat memantau progres penanganan secara langsung melalui tautan resmi berikut:
🔗 *Lacak Status Pengaduan:*
${baseUrl}/#/track?id=${shortId}

Pesan ini dikirimkan secara otomatis oleh Sistem Informasi Pengaduan Pelayanan Publik (SIP-Publik) Kelurahan Airmadidi Atas.`
  );
};

/**
 * Buat teks notifikasi resmi WhatsApp saat aduan SELESAI DITANGANI + SERTAKAN BUKTI FOTO
 */
export const generateWhatsAppResolvedMessage = (complaint) => {
  const shortId = complaint.shortId || complaint.id;
  const baseUrl = typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost:3000';
  const buktiFotoUrl = complaint.buktiFotoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  
  return (
`*SIP-PUBLIK KELURAHAN AIRMADIDI ATAS*
✅ *Pemberitahuan Resmi Penyelesaian Pengaduan*

Yth. Bpk/Ibu *${complaint.nama || 'Warga'}*,

Kabar baik! Pengaduan Anda dengan nomor tiket *${shortId}* telah *SELESAI DITANGANI* oleh tim petugas lapangan Kelurahan Airmadidi Atas.

📋 *Nomor Tiket:* ${shortId} (${complaint.id})
📍 *Lokasi:* ${complaint.lokasi || '-'}
🛠️ *Petugas Pelaksana:* ${complaint.petugas || 'Tim Lapangan Kelurahan'}
📝 *Catatan Pengerjaan:* ${complaint.catatanProgres || 'Pekerjaan perbaikan fisik di lapangan telah selesai 100%.'}
💬 *Tanggapan Resmi:* ${complaint.tanggapanResmi || 'Terima kasih atas laporan Anda. Saluran/fasilitas telah kembali normal.'}

📸 *DOKUMENTASI BUKTI FOTO PENYELESAIAN:*
Berikut bukti foto hasil pengerjaan di lapangan:
🔗 ${buktiFotoUrl}

Mohon kesediaan Bpk/Ibu untuk memberikan penilaian kepuasan masyarakat (bintang 1 - 5) dan ulasan pada sistem kami:
⭐ *Beri Rating & Ulasan:*
${baseUrl}/#/track?id=${shortId}

Kelurahan Airmadidi Atas — Melayani dengan Cepat, Tepat, dan Transparan.`
  );
};
