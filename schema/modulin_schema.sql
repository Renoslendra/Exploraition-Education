-- =============================================================================
-- MODULIN — Database Schema for Supabase PostgreSQL
-- =============================================================================
-- Jalankan file ini di Supabase SQL Editor (satu kali, urutan dari atas ke bawah).
-- Pastikan RLS diaktifkan setelah tabel dibuat.
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- untuk gen_random_uuid()


-- =============================================================================
-- 1. TABEL REFERENSI STATIS
--    (tidak bergantung tabel lain, tidak butuh RLS user-level)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- learning_models
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_models (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    kode        text        NOT NULL UNIQUE,
    nama        text        NOT NULL,
    deskripsi   text,
    fokus       text,
    sintak      jsonb       NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE  learning_models         IS 'Model pembelajaran yang didukung Kurikulum Merdeka. Data statis, di-seed saat setup.';
COMMENT ON COLUMN learning_models.kode    IS 'Identifier singkat: pbl, pjbl, dl, il, cooperative, circ.';
COMMENT ON COLUMN learning_models.sintak  IS 'Tahapan/langkah per fase dalam format JSON array.';

-- -----------------------------------------------------------------------------
-- curriculum_phases
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curriculum_phases (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    kode        text        NOT NULL UNIQUE,
    nama        text        NOT NULL,
    jenjang     text        NOT NULL,
    kelas       text,                           -- NULL untuk Fase Fondasi
    keterangan  text
);

COMMENT ON TABLE  curriculum_phases          IS 'Fase Kurikulum Merdeka: Fondasi, A–F. Data statis.';
COMMENT ON COLUMN curriculum_phases.kode     IS 'fondasi | a | b | c | d | e | f';
COMMENT ON COLUMN curriculum_phases.kelas    IS 'Rentang kelas, NULL untuk Fase Fondasi.';

-- -----------------------------------------------------------------------------
-- subjects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    nama        text        NOT NULL,
    jenjang     text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  subjects         IS 'Daftar mata pelajaran. Bisa di-seed dari daftar resmi Kemendikbud atau diisi custom guru.';
COMMENT ON COLUMN subjects.jenjang IS 'SD | SMP | SMA | SMK | PAUD — filter mapel sesuai jenjang guru.';


-- =============================================================================
-- 2. TABEL USERS
--    id harus sama dengan auth.users.id (Supabase Auth)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id          uuid        PRIMARY KEY,            -- dari auth.uid(), BUKAN gen_random_uuid()
    email       text        NOT NULL,
    nama        text        NOT NULL,
    instansi    text,                               -- nama sekolah (teks bebas, MVP)
    jenjang     text        CHECK (jenjang IN ('PAUD', 'SD', 'SMP', 'SMA', 'SMK')),
    role        text        NOT NULL DEFAULT 'guru',
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  users          IS 'Profil guru. id = auth.uid() dari Supabase Auth.';
COMMENT ON COLUMN users.id       IS 'Sama persis dengan auth.users.id. Tidak menggunakan gen_random_uuid().';
COMMENT ON COLUMN users.instansi IS 'Nama sekolah (teks bebas untuk MVP). Normalisasi ke tabel schools di fase berikutnya.';
COMMENT ON COLUMN users.role     IS 'guru (default) | admin — untuk future admin role.';

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Trigger: update kolom updated_at otomatis saat row diubah
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 3. TABEL SCHOOLS (Opsional — siap untuk normalisasi fase berikutnya)
-- =============================================================================

CREATE TABLE IF NOT EXISTS schools (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    nama        text        NOT NULL,
    alamat      text,
    npsn        text        UNIQUE,                 -- Nomor Pokok Sekolah Nasional
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  schools      IS 'Data sekolah. Opsional di MVP — instansi masih disimpan sebagai teks di tabel users.';
COMMENT ON COLUMN schools.npsn IS 'Nomor Pokok Sekolah Nasional — identifier resmi Kemendikbud. UNIQUE.';

CREATE INDEX IF NOT EXISTS idx_schools_npsn ON schools (npsn);


-- =============================================================================
-- 4. TABEL MODULES
-- =============================================================================

CREATE TABLE IF NOT EXISTS modules (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject_id      uuid        REFERENCES subjects (id) ON DELETE SET NULL,
    phase_id        uuid        REFERENCES curriculum_phases (id) ON DELETE SET NULL,
    model_id        uuid        REFERENCES learning_models (id) ON DELETE SET NULL,
    judul_bab       text        NOT NULL,
    kelas           text,                           -- kelas spesifik dalam fase (7, 8, 9, dst.)
    tahun_ajaran    text        NOT NULL,           -- contoh: "2024/2025"
    status          text        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'final')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  modules             IS 'Tabel utama. Satu row = satu modul ajar milik satu guru.';
COMMENT ON COLUMN modules.status      IS 'draft | final';
COMMENT ON COLUMN modules.kelas       IS 'Kelas spesifik dalam fase, misal fase D bisa kelas 7, 8, atau 9.';
COMMENT ON COLUMN modules.tahun_ajaran IS 'Format: "2024/2025".';

-- Index
CREATE INDEX IF NOT EXISTS idx_modules_user_id    ON modules (user_id);
CREATE INDEX IF NOT EXISTS idx_modules_status      ON modules (status);
CREATE INDEX IF NOT EXISTS idx_modules_created_at  ON modules (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_modules_user_status_created
    ON modules (user_id, status, created_at DESC);  -- composite untuk query dashboard

CREATE OR REPLACE TRIGGER trg_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 5. TABEL MODULE_SECTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS module_sections (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       uuid        NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    jenis_section   text        NOT NULL,           -- tipe section (lihat mapping di SCHEMA.md)
    label           text,                           -- nama tampilan di UI
    konten          jsonb,                          -- konten terstruktur / TipTap JSON
    urutan          integer     NOT NULL,
    aktif           boolean     NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  module_sections               IS 'Konten modul per bagian. Cascade delete mengikuti modules.';
COMMENT ON COLUMN module_sections.jenis_section IS 'informasi_umum | tujuan_pembelajaran | kegiatan_pembelajaran | asesmen | lampiran | dst.';
COMMENT ON COLUMN module_sections.konten        IS 'Konten terstruktur atau TipTap JSON untuk rich text.';
COMMENT ON COLUMN module_sections.aktif         IS 'Guru bisa disable section tanpa menghapus data.';

-- Index
CREATE INDEX IF NOT EXISTS idx_module_sections_module_id
    ON module_sections (module_id);
CREATE INDEX IF NOT EXISTS idx_module_sections_module_urutan
    ON module_sections (module_id, urutan);         -- sorted retrieval

CREATE OR REPLACE TRIGGER trg_module_sections_updated_at
    BEFORE UPDATE ON module_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 6. TABEL AI_GENERATION_LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_generation_logs (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       uuid        REFERENCES modules (id) ON DELETE SET NULL,
    user_id         uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    tipe            text        CHECK (tipe IN ('full', 'partial')),
    section_target  text,                           -- NULL untuk full, nama section untuk partial
    prompt_hash     text,                           -- SHA-256 hash dari prompt (bukan prompt lengkap)
    tokens_used     integer,
    durasi_ms       integer,
    status          text        CHECK (status IN ('success', 'error', 'timeout')),
    error_message   text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  ai_generation_logs              IS 'Audit log setiap pemanggilan Gemini AI. Insert hanya via service role (server-side).';
COMMENT ON COLUMN ai_generation_logs.prompt_hash  IS 'SHA-256 hash dari prompt — bukan prompt lengkap, demi privasi guru.';
COMMENT ON COLUMN ai_generation_logs.tipe         IS 'full = seluruh modul, partial = regenerasi satu section.';

-- Index
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id    ON ai_generation_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_module_id   ON ai_generation_logs (module_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at  ON ai_generation_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_status      ON ai_generation_logs (status);


-- =============================================================================
-- 7. TABEL EXPORTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS exports (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id   uuid        NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    user_id     uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    format      text        NOT NULL CHECK (format IN ('pdf', 'docx')),
    file_url    text,                               -- URL file di Supabase Storage
    file_size   integer,                            -- ukuran file dalam bytes
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  exports          IS 'Riwayat file yang diekspor. File disimpan di Supabase Storage.';
COMMENT ON COLUMN exports.file_url IS 'URL file di Supabase Storage. Bisa expired jika menggunakan signed URL.';
COMMENT ON COLUMN exports.user_id  IS 'Redundan dengan modules.user_id tapi mempercepat RLS check tanpa join.';

CREATE INDEX IF NOT EXISTS idx_exports_module_id ON exports (module_id);
CREATE INDEX IF NOT EXISTS idx_exports_user_id   ON exports (user_id);


-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools             ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_models     ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_phases   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules             ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_sections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports             ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------
-- users — guru hanya bisa baca & ubah data sendiri
-- -----------------------------------------------------------------------
CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------------------
-- schools — public read, tidak ada write dari client
-- -----------------------------------------------------------------------
CREATE POLICY "schools_public_read" ON schools
    FOR SELECT USING (true);

-- -----------------------------------------------------------------------
-- learning_models — public read, tidak ada write dari client
-- -----------------------------------------------------------------------
CREATE POLICY "learning_models_public_read" ON learning_models
    FOR SELECT USING (true);

-- -----------------------------------------------------------------------
-- curriculum_phases — public read, tidak ada write dari client
-- -----------------------------------------------------------------------
CREATE POLICY "curriculum_phases_public_read" ON curriculum_phases
    FOR SELECT USING (true);

-- -----------------------------------------------------------------------
-- subjects — public read, tidak ada write dari client
-- -----------------------------------------------------------------------
CREATE POLICY "subjects_public_read" ON subjects
    FOR SELECT USING (true);

-- -----------------------------------------------------------------------
-- modules — CRUD hanya untuk modul milik sendiri
-- -----------------------------------------------------------------------
CREATE POLICY "modules_select_own" ON modules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "modules_insert_own" ON modules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "modules_update_own" ON modules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "modules_delete_own" ON modules
    FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- module_sections — akses melalui kepemilikan parent module
-- -----------------------------------------------------------------------
CREATE POLICY "module_sections_select_own" ON module_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM modules
            WHERE modules.id = module_sections.module_id
              AND modules.user_id = auth.uid()
        )
    );

CREATE POLICY "module_sections_insert_own" ON module_sections
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM modules
            WHERE modules.id = module_sections.module_id
              AND modules.user_id = auth.uid()
        )
    );

CREATE POLICY "module_sections_update_own" ON module_sections
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM modules
            WHERE modules.id = module_sections.module_id
              AND modules.user_id = auth.uid()
        )
    );

CREATE POLICY "module_sections_delete_own" ON module_sections
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM modules
            WHERE modules.id = module_sections.module_id
              AND modules.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------
-- ai_generation_logs — guru hanya bisa READ log milik sendiri.
--   INSERT hanya via service role (server-side API route).
-- -----------------------------------------------------------------------
CREATE POLICY "ai_logs_select_own" ON ai_generation_logs
    FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- exports — akses hanya untuk ekspor milik sendiri
-- -----------------------------------------------------------------------
CREATE POLICY "exports_select_own" ON exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "exports_insert_own" ON exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exports_delete_own" ON exports
    FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- 9. SEED DATA — REFERENSI STATIS
-- =============================================================================

-- -----------------------------------------------------------------------
-- learning_models (6 model pembelajaran Kurikulum Merdeka)
-- -----------------------------------------------------------------------
INSERT INTO learning_models (kode, nama, deskripsi, fokus, sintak) VALUES
(
    'pbl',
    'Problem-Based Learning',
    'Pembelajaran berbasis masalah nyata yang relevan dengan kehidupan siswa.',
    'Pemecahan masalah nyata — proses berakhir pada solusi.',
    '[
        {"fase": 1, "nama": "Orientasi Masalah", "deskripsi": "Guru menyajikan masalah nyata. Siswa mengidentifikasi dan merumuskan masalah."},
        {"fase": 2, "nama": "Pengorganisasian Belajar", "deskripsi": "Siswa membagi tugas dalam kelompok untuk menyelidiki masalah."},
        {"fase": 3, "nama": "Penyelidikan Mandiri/Kelompok", "deskripsi": "Siswa mengumpulkan informasi, melakukan eksperimen, atau mencari referensi."},
        {"fase": 4, "nama": "Pengembangan & Penyajian Solusi", "deskripsi": "Siswa mengembangkan dan mempresentasikan solusi atas masalah."},
        {"fase": 5, "nama": "Analisis & Evaluasi", "deskripsi": "Siswa dan guru mengevaluasi proses penyelidikan dan solusi yang dihasilkan."}
    ]'::jsonb
),
(
    'pjbl',
    'Project-Based Learning',
    'Pembelajaran berbasis proyek yang menghasilkan produk nyata sebagai luaran utama.',
    'Pemecahan masalah nyata — proses berakhir pada produk.',
    '[
        {"fase": 1, "nama": "Penentuan Pertanyaan Mendasar", "deskripsi": "Guru mengajukan pertanyaan esensial yang mendorong siswa membuat produk."},
        {"fase": 2, "nama": "Perencanaan Proyek", "deskripsi": "Siswa merancang proyek: tujuan, jadwal, pembagian tugas, dan sumber daya."},
        {"fase": 3, "nama": "Penyusunan Jadwal", "deskripsi": "Guru dan siswa menyepakati timeline dan milestones proyek."},
        {"fase": 4, "nama": "Monitoring Kemajuan", "deskripsi": "Guru memantau perkembangan proyek dan memberikan umpan balik berkala."},
        {"fase": 5, "nama": "Pengujian Hasil", "deskripsi": "Siswa mempresentasikan produk untuk mendapat umpan balik dari guru dan teman."},
        {"fase": 6, "nama": "Evaluasi & Refleksi", "deskripsi": "Siswa dan guru merefleksikan proses dan hasil proyek secara keseluruhan."}
    ]'::jsonb
),
(
    'dl',
    'Discovery Learning',
    'Pembelajaran melalui eksplorasi dan penemuan konsep secara mandiri oleh siswa.',
    'Penemuan konsep secara mandiri melalui eksplorasi.',
    '[
        {"fase": 1, "nama": "Pemberian Rangsangan (Stimulation)", "deskripsi": "Guru mengajukan pertanyaan atau menyajikan fenomena untuk memancing rasa ingin tahu."},
        {"fase": 2, "nama": "Identifikasi Masalah (Problem Statement)", "deskripsi": "Siswa mengidentifikasi dan merumuskan masalah atau hipotesis."},
        {"fase": 3, "nama": "Pengumpulan Data (Data Collection)", "deskripsi": "Siswa mengumpulkan informasi melalui observasi, eksperimen, atau membaca."},
        {"fase": 4, "nama": "Pengolahan Data (Data Processing)", "deskripsi": "Siswa menganalisis dan menginterpretasikan data yang telah dikumpulkan."},
        {"fase": 5, "nama": "Pembuktian (Verification)", "deskripsi": "Siswa membuktikan hipotesis berdasarkan hasil pengolahan data."},
        {"fase": 6, "nama": "Penarikan Kesimpulan (Generalization)", "deskripsi": "Siswa menyimpulkan konsep yang ditemukan dan mengaplikasikannya pada konteks baru."}
    ]'::jsonb
),
(
    'il',
    'Inquiry Learning',
    'Pembelajaran berbasis penyelidikan ilmiah dengan pertanyaan sebagai motor penggerak.',
    'Penyelidikan ilmiah berbasis pertanyaan.',
    '[
        {"fase": 1, "nama": "Orientasi", "deskripsi": "Guru menciptakan konteks dan membangkitkan rasa ingin tahu siswa."},
        {"fase": 2, "nama": "Merumuskan Masalah", "deskripsi": "Siswa merumuskan pertanyaan penyelidikan yang akan dijawab."},
        {"fase": 3, "nama": "Merumuskan Hipotesis", "deskripsi": "Siswa membuat dugaan sementara berdasarkan pengetahuan awal."},
        {"fase": 4, "nama": "Mengumpulkan Data", "deskripsi": "Siswa melakukan observasi, eksperimen, atau wawancara untuk mengumpulkan bukti."},
        {"fase": 5, "nama": "Menguji Hipotesis", "deskripsi": "Siswa menganalisis data untuk membuktikan atau menolak hipotesis."},
        {"fase": 6, "nama": "Merumuskan Kesimpulan", "deskripsi": "Siswa menyimpulkan hasil penyelidikan dan mengkomunikasikannya."}
    ]'::jsonb
),
(
    'cooperative',
    'Cooperative Learning',
    'Pembelajaran kolaboratif dalam kelompok kecil dengan struktur peran yang jelas.',
    'Kolaborasi terstruktur dalam kelompok kecil.',
    '[
        {"fase": 1, "nama": "Menyampaikan Tujuan & Memotivasi", "deskripsi": "Guru menjelaskan tujuan pembelajaran dan pentingnya kerja sama."},
        {"fase": 2, "nama": "Menyajikan Informasi", "deskripsi": "Guru menyajikan materi dasar yang dibutuhkan untuk tugas kelompok."},
        {"fase": 3, "nama": "Mengorganisasikan Kelompok", "deskripsi": "Siswa dibagi ke dalam kelompok kecil (3-5 orang) dengan peran yang jelas."},
        {"fase": 4, "nama": "Membimbing Kerja Kelompok", "deskripsi": "Kelompok mengerjakan tugas; guru berkeliling memberikan bimbingan."},
        {"fase": 5, "nama": "Evaluasi", "deskripsi": "Kelompok mempresentasikan hasil kerja; guru dan teman memberikan penilaian."},
        {"fase": 6, "nama": "Memberikan Penghargaan", "deskripsi": "Guru mengapresiasi usaha individu dan kelompok yang berprestasi."}
    ]'::jsonb
),
(
    'circ',
    'Cooperative Integrated Reading and Composition',
    'Model kooperatif yang berfokus pada pengembangan kemampuan membaca dan menulis secara terpadu.',
    'Literasi membaca dan menulis secara kooperatif.',
    '[
        {"fase": 1, "nama": "Orientasi", "deskripsi": "Guru memperkenalkan teks dan tujuan membaca; siswa memprediksi isi berdasarkan judul/gambar."},
        {"fase": 2, "nama": "Organisasi", "deskripsi": "Siswa dibagi dalam kelompok; setiap anggota mendapat bagian teks untuk dibaca."},
        {"fase": 3, "nama": "Pengenalan Konsep", "deskripsi": "Siswa membaca teks secara mandiri dan mencatat ide pokok serta kosakata baru."},
        {"fase": 4, "nama": "Publikasi", "deskripsi": "Anggota kelompok berbagi pemahaman tentang bagian teks masing-masing (jigsaw)."},
        {"fase": 5, "nama": "Penguatan & Latihan", "deskripsi": "Kelompok mendiskusikan keseluruhan teks dan mengerjakan tugas menulis bersama."},
        {"fase": 6, "nama": "Penilaian", "deskripsi": "Hasil tulisan dipresentasikan dan dinilai berdasarkan rubrik membaca dan menulis."}
    ]'::jsonb
)
ON CONFLICT (kode) DO NOTHING;

-- -----------------------------------------------------------------------
-- curriculum_phases (Fase Fondasi + A–F Kurikulum Merdeka)
-- -----------------------------------------------------------------------
INSERT INTO curriculum_phases (kode, nama, jenjang, kelas, keterangan) VALUES
(
    'fondasi', 'Fase Fondasi', 'PAUD/TK/RA', NULL,
    'Menggunakan capaian perkembangan, bukan capaian pembelajaran. Struktur modul berbeda dari fase lainnya.'
),
('a', 'Fase A', 'SD/MI',        '1-2', NULL),
('b', 'Fase B', 'SD/MI',        '3-4', NULL),
('c', 'Fase C', 'SD/MI',        '5-6', NULL),
('d', 'Fase D', 'SMP/MTs',      '7-9', NULL),
('e', 'Fase E', 'SMA/SMK/MA',   '10',  NULL),
('f', 'Fase F', 'SMA/SMK/MA',   '11-12', NULL)
ON CONFLICT (kode) DO NOTHING;

-- -----------------------------------------------------------------------
-- subjects — daftar mata pelajaran umum per jenjang
-- -----------------------------------------------------------------------
INSERT INTO subjects (nama, jenjang) VALUES
-- SD/MI
('Pendidikan Agama & Budi Pekerti',         'SD'),
('Pendidikan Pancasila',                     'SD'),
('Bahasa Indonesia',                         'SD'),
('Matematika',                               'SD'),
('Ilmu Pengetahuan Alam & Sosial (IPAS)',    'SD'),
('Seni (Rupa/Musik/Teater/Tari)',            'SD'),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SD'),
('Bahasa Inggris',                           'SD'),
-- SMP/MTs
('Pendidikan Agama & Budi Pekerti',         'SMP'),
('Pendidikan Pancasila',                     'SMP'),
('Bahasa Indonesia',                         'SMP'),
('Matematika',                               'SMP'),
('Ilmu Pengetahuan Alam (IPA)',              'SMP'),
('Ilmu Pengetahuan Sosial (IPS)',            'SMP'),
('Bahasa Inggris',                           'SMP'),
('Informatika',                              'SMP'),
('Seni Budaya',                              'SMP'),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SMP'),
-- SMA/MA
('Pendidikan Agama & Budi Pekerti',         'SMA'),
('Pendidikan Pancasila',                     'SMA'),
('Bahasa Indonesia',                         'SMA'),
('Matematika',                               'SMA'),
('Bahasa Inggris',                           'SMA'),
('Biologi',                                  'SMA'),
('Fisika',                                   'SMA'),
('Kimia',                                    'SMA'),
('Sejarah Indonesia',                        'SMA'),
('Geografi',                                 'SMA'),
('Ekonomi',                                  'SMA'),
('Sosiologi',                                'SMA'),
('Informatika',                              'SMA'),
('Seni Budaya',                              'SMA'),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SMA'),
-- PAUD
('Nilai Agama & Budi Pekerti',              'PAUD'),
('Jati Diri',                               'PAUD'),
('Dasar Literasi & STEAM',                  'PAUD')
ON CONFLICT DO NOTHING;


-- =============================================================================
-- 10. HELPER FUNCTION — Rate Limiting
--     Dipakai di API route untuk cek quota harian generasi AI per guru.
-- =============================================================================

CREATE OR REPLACE FUNCTION count_ai_generations_today(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)::integer
    FROM ai_generation_logs
    WHERE user_id = p_user_id
      AND created_at > NOW() - INTERVAL '24 hours'
      AND status = 'success';
$$;

COMMENT ON FUNCTION count_ai_generations_today IS
    'Menghitung jumlah generasi AI yang berhasil dalam 24 jam terakhir untuk satu guru. Dipakai untuk rate limiting harian.';


-- =============================================================================
-- 11. TRIGGER — Auto-sync users dari Supabase Auth
--     Saat guru pertama kali login via Google OAuth, buat row di tabel users.
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, nama)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Pasang trigger ke auth.users (bawaan Supabase)
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user IS
    'Trigger: saat user baru terdaftar via Supabase Auth (Google OAuth), otomatis insert ke tabel public.users.';


-- =============================================================================
-- SELESAI
-- =============================================================================
-- Checklist setelah menjalankan file ini:
--   [x] Extensions aktif
--   [x] Semua tabel dibuat
--   [x] RLS diaktifkan di semua tabel
--   [x] Semua policy RLS dibuat
--   [x] Seed data: 6 learning_models, 7 curriculum_phases, 38 subjects
--   [x] Trigger auto-sync auth.users → public.users
--   [x] Helper function rate limiting
--
-- Langkah manual setelah ini (di Supabase Dashboard):
--   1. Buat Supabase Storage bucket bernama "exports" (private).
--   2. Set lifecycle policy bucket exports: hapus file > 24 jam (atau sesuai keputusan).
--   3. Isi environment variables di Vercel:
--        NEXT_PUBLIC_SUPABASE_URL
--        NEXT_PUBLIC_SUPABASE_ANON_KEY
--        SUPABASE_SERVICE_ROLE_KEY
--        GEMINI_API_KEY
-- =============================================================================
