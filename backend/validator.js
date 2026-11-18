/**
 * Helper Validasi Server SIP-Publik
 * Kelurahan Airmadidi Atas
 */

/**
 * 1. Validasi Nama Pelapor (Sesuai KTP):
 * - Input wajib diisi dan harus menggunakan nama lengkap sesuai KTP.
 * - Tolak input jika hanya berisi 1 kata atau hanya berupa inisial (misalnya: "Budi", "A", "B. S.", "M. Iqbal").
 * - Setiap kata nama minimal terdiri dari 2 huruf.
 * - Wajib memasukkan minimal dua kata (nama depan dan nama belakang).
 * - Tidak boleh mengandung angka atau karakter simbol aneh.
 */
export const validateCitizenName = (name) => {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      message: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  // Tolak jika mengandung angka
  if (/[0-9]/.test(trimmed)) {
    return {
      isValid: false,
      message: 'Nama tidak boleh mengandung angka.'
    };
  }

  // Tolak jika mengandung karakter simbol atau tanda baca inisial (seperti titik, tanda tanya, dsb)
  if (/[^a-zA-Z\s']/.test(trimmed)) {
    return {
      isValid: false,
      message: 'Nama tidak boleh mengandung karakter simbol atau tanda baca singkatan/inisial.'
    };
  }

  // Pisahkan berdasarkan spasi
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return {
      isValid: false,
      message: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
    };
  }

  // Setiap kata nama minimal terdiri dari 2 huruf alfabet
  for (const word of words) {
    const letters = word.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 2) {
      return {
        isValid: false,
        message: 'Masukkan nama lengkap sesuai KTP (minimal nama depan dan nama belakang, tanpa singkatan/inisial).'
      };
    }
  }

  return { isValid: true, message: '' };
};

/**
 * 2. Validasi Lokasi Kejadian (Khusus Kelurahan Airmadidi Atas):
 * - Sistem hanya boleh menerima laporan yang berlokasi di wilayah "Kelurahan Airmadidi Atas".
 * - Tolak jika di luar Kelurahan Airmadidi Atas.
 */
export const validateLocationAirmadidiAtas = (location) => {
  if (!location || typeof location !== 'string' || !location.trim()) {
    return {
      isValid: false,
      message: 'Lokasi kejadian wajib diisi.'
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
      message: 'Maaf, sistem ini hanya menerima laporan kejadian yang berlokasi di Kelurahan Airmadidi Atas.'
    };
  }

  return { isValid: true, message: '' };
};

/**
 * 3. Validasi Wajib Unggah Foto Bukti:
 * - Wajib ada foto bukti kejadian dan lokasi
 * - Format hanya gambar (JPG, JPEG, PNG)
 * - Ukuran maksimal 5MB
 */
export const validateEvidencePhoto = (fotoUrl) => {
  if (!fotoUrl || typeof fotoUrl !== 'string' || !fotoUrl.trim()) {
    return {
      isValid: false,
      message: 'Wajib mengunggah foto bukti kejadian dan lokasi sebelum mengirim laporan.'
    };
  }

  // Jika berupa data URL base64
  if (fotoUrl.startsWith('data:')) {
    const matches = fotoUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return {
        isValid: false,
        message: 'Format data foto tidak valid.'
      };
    }

    const mime = matches[1].toLowerCase();
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
      return {
        isValid: false,
        message: 'Format foto bukti harus berupa gambar (JPG, JPEG, atau PNG).'
      };
    }

    // Periksa ukuran maksimal 5MB (5.242.880 bytes)
    const base64Str = matches[2];
    const approxBytes = (base64Str.length * 3) / 4;
    if (approxBytes > 5 * 1024 * 1024) {
      return {
        isValid: false,
        message: 'Ukuran foto terlalu besar. Maksimal ukuran file adalah 5MB.'
      };
    }
  }

  return { isValid: true, message: '' };
};
