-- ==========================================================
-- SKEMA BASIS DATA: SIP-PUBLIK (KELURAHAN AIRMADIDI ATAS)
-- Kompatibel dengan PostgreSQL 13+ & MySQL 8.0+
-- ==========================================================

-- 1. TABEL PENGGUNA INTERNAL (USERS)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'Front Office', 'Tindak Lanjut', 'Kepala Seksi', 'Lurah / Seklur', 'Administrator Sistem'
    role_key VARCHAR(50) NOT NULL, -- 'front_office', 'field_officer', 'section_head', 'leader', 'admin'
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL MASTER KATEGORI & SEKSI
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) UNIQUE NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    nama_seksi VARCHAR(100) UNIQUE NOT NULL,
    kode_seksi VARCHAR(20)
);

-- 3. TABEL PENGADUAN WARGA (COMPLAINTS)
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(50) PRIMARY KEY, -- Contoh: 'ADU-2026-0001'
    short_id VARCHAR(20) UNIQUE NOT NULL, -- Contoh: 'ADU-0001'
    nama VARCHAR(150) NOT NULL,
    kontak VARCHAR(50) NOT NULL,
    lokasi TEXT NOT NULL,
    detail TEXT NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Infrastruktur & Lingkungan',
    tujuan_disposisi VARCHAR(100) DEFAULT 'Seksi Pembangunan',
    catatan_disposisi TEXT,
    status VARCHAR(50) DEFAULT 'Baru' CHECK (status IN ('Baru', 'Terverifikasi', 'Didisposisikan', 'Diproses', 'Selesai Penanganan', 'Selesai', 'Ditolak')),
    status_timeline VARCHAR(100) DEFAULT 'Pengaduan diterima',
    petugas VARCHAR(100) DEFAULT 'Belum Ditugaskan',
    timer_sla VARCHAR(50) DEFAULT 'Sisa 3 hari',
    is_overdue BOOLEAN DEFAULT FALSE,
    prioritas VARCHAR(20) DEFAULT 'Sedang' CHECK (prioritas IN ('Rendah', 'Sedang', 'Tinggi', 'Darurat')),
    instruksi_khusus TEXT,
    bukti_penyelesaian TEXT,
    tanggapan_resmi TEXT,
    catatan_progres TEXT,
    catatan_revisi TEXT,
    rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    ulasan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL LAMPIRAN BERKAS / FOTO PENGADUAN
CREATE TABLE IF NOT EXISTS complaint_attachments (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(50) REFERENCES complaints(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size_kb INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL LOG AUDIT JEJAK AKTIVITAS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    aktivitas VARCHAR(255) NOT NULL,
    username VARCHAR(80) NOT NULL,
    waktu VARCHAR(10) NOT NULL, -- Format '08.02'
    tanggal DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL KONFIGURASI SISTEM
CREATE TABLE IF NOT EXISTS system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA AWAL PERSIS SESUAI PROTOTIPE
INSERT INTO users (nama, username, password_hash, role, role_key, status) VALUES
('Petugas A', 'petugas.a', 'argon2i$mockhash', 'Front Office', 'front_office', 'Aktif'),
('Petugas B', 'petugas.b', 'argon2i$mockhash', 'Tindak Lanjut', 'field_officer', 'Aktif'),
('Kepala Seksi Pembangunan', 'kasie.bang', 'argon2i$mockhash', 'Kepala Seksi', 'section_head', 'Aktif'),
('Lurah Airmadidi Atas', 'lurah.airmadidi', 'argon2i$mockhash', 'Lurah / Seklur', 'leader', 'Aktif'),
('Administrator Utama', 'admin.sip', 'argon2i$mockhash', 'Administrator Sistem', 'admin', 'Aktif')
ON CONFLICT (username) DO NOTHING;

INSERT INTO categories (nama_kategori) VALUES
('Infrastruktur & Lingkungan'),
('Kebersihan'),
('Layanan Adminduk'),
('Keamanan')
ON CONFLICT (nama_kategori) DO NOTHING;

INSERT INTO sections (nama_seksi, kode_seksi) VALUES
('Seksi Pembangunan', 'SEK-BANG'),
('Seksi Ketenteraman & Ketertiban', 'SEK-TRANTIB'),
('Seksi Kesejahteraan Sosial', 'SEK-KESRA'),
('Seksi Tata Kelola Pemerintahan', 'SEK-PEM')
ON CONFLICT (nama_seksi) DO NOTHING;

INSERT INTO system_config (config_key, config_value) VALUES
('kelurahan_name', 'Kelurahan Airmadidi Atas'),
('api_notifikasi', 'API Notifikasi (WA / SMS)'),
('file_limit', 'Limit ukuran file: 10MB')
ON CONFLICT (config_key) DO NOTHING;

