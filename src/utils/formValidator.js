
/**
 * Modul Validasi Formulir Pelaporan Pengaduan Masyarakat
 * Kelurahan Airmadidi Atas - SIP-Publik
 */

/**
 * 1. Validasi Nama Pelapor (Sesuai KTP)
 * - Input wajib diisi dan harus menggunakan nama lengkap sesuai KTP.
 * - Tolak input jika hanya berisi 1 kata atau hanya berupa inisial (misal: "Budi", "A", "B. S.", "M. Iqbal").
 * - Setiap kata nama minimal terdiri dari 2 huruf.
 * - Wajib memasukkan minimal dua kata (nama depan dan nama belakang).
 * - Tidak boleh mengandung angka atau karakter simbol aneh.
 */
export const validateCitizenName = (name) => {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      errorMessage: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  // Tidak boleh ada angka
  if (/[0-9]/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Nama tidak boleh mengandung angka.'
    };
  }

  // Tidak boleh ada simbol aneh atau tanda baca inisial (seperti titik, tanda tanya, koma, dsb)
  // Hanya memperbolehkan huruf alfabet, spasi, dan petik tunggal (') untuk nama lokal
  if (/[^a-zA-Z\s']/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Nama tidak boleh mengandung karakter simbol atau tanda baca inisial.'
    };
  }

  // Pisahkan berdasarkan spasi
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  // Setiap kata nama minimal terdiri dari 2 huruf
  for (const word of words) {
    const letters = word.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 2) {
      return {
        isValid: false,
        errorMessage: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
      };
    }
  }

  return { isValid: true, errorMessage: null };
};

/**
 * 2. Validasi Lokasi Kejadian (Khusus Kelurahan Airmadidi Atas)
 * - Sistem hanya boleh menerima laporan yang berlokasi di wilayah "Kelurahan Airmadidi Atas".
 * - Tolak jika di luar Kelurahan Airmadidi Atas.
 */
export const validateLocationAirmadidiAtas = (location) => {
  if (!location || typeof location !== 'string' || !location.trim()) {
    return {
      isValid: false,
      errorMessage: 'Lokasi kejadian wajib diisi.'
    };
  }

  const normalized = location.toLowerCase().trim();

  // Kata kunci wilayah luar yang harus ditolak
  const outsideLocations = [
    'airmadidi bawah', 'sarongsong', 'sukur', 'kolongan', 'kawatak',
    'kauditan', 'manado', 'bitung', 'dimembe', 'kalawat', 'likupang',
    'kema', 'wori', 'tomohon'
  ];

  const hasOutside = outsideLocations.some(outside => normalized.includes(outside));
  const hasAirmadidiAtas = normalized.includes('airmadidi atas');

  if (hasOutside || !hasAirmadidiAtas) {
    return {
      isValid: false,
      errorMessage: 'Maaf, sistem ini hanya menerima laporan kejadian yang berlokasi di Kelurahan Airmadidi Atas.'
    };
  }

  return { isValid: true, errorMessage: null };
};

/**
 * 3. Validasi Wajib Unggah Foto Bukti
 * - Wajib minimal 1 foto kejadian dan lokasi
 * - Format hanya gambar (JPG, JPEG, PNG)
 * - Ukuran maksimal 5MB
 */
export const validateEvidencePhoto = (fotoUrl, fileObj = null) => {
  if (!fotoUrl) {
    return {
      isValid: false,
      errorMessage: 'Wajib mengunggah foto bukti kejadian dan lokasi sebelum mengirim laporan.'
    };
  }

  // Jika memvalidasi langsung objek File saat pemilihan berkas
  if (fileObj) {
    const validMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validExts = ['.jpg', '.jpeg', '.png'];
    const fileName = (fileObj.name || '').toLowerCase();
    const isExtValid = validExts.some(ext => fileName.endsWith(ext));
    const isMimeValid = validMimes.includes((fileObj.type || '').toLowerCase());

    if (!isExtValid && !isMimeValid) {
      return {
        isValid: false,
        errorMessage: 'Format file tidak didukung. Wajib menggunakan format gambar (JPG, JPEG, PNG).'
      };
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (fileObj.size > maxSizeBytes) {
      return {
        isValid: false,
        errorMessage: 'Ukuran foto terlalu besar. Maksimal ukuran file adalah 5MB.'
      };
    }
  }

  // Jika memeriksa data URL Base64
  if (typeof fotoUrl === 'string' && fotoUrl.startsWith('data:')) {
    const matches = fotoUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const mime = matches[1].toLowerCase();
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
        return {
          isValid: false,
          errorMessage: 'Format file tidak didukung. Wajib menggunakan format gambar (JPG, JPEG, PNG).'
        };
      }
      const approxBytes = (matches[2].length * 3) / 4;
      if (approxBytes > 5 * 1024 * 1024) {
        return {
          isValid: false,
          errorMessage: 'Ukuran foto terlalu besar. Maksimal ukuran file adalah 5MB.'
        };
      }
    }
  }

  return { isValid: true, errorMessage: null };
};
