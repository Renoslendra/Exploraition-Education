-- =============================================================================
-- MODULIN — Database Schema for Supabase PostgreSQL
-- =============================================================================
-- Versi: 2.1 (Terakhir diperbarui: September 2026)
-- Sesuai Standar: BSKAP Kemendikbudristek No. 032/H/KR/2024 (10 Komponen Modul Ajar)
-- Rujukan Dokumen: SCHEMA.md, AGENT.md, ARSITEKTUR.md, ALUR_OUTPUT_AI.md, TEMPLATE_ACUAN.md
-- Jalankan file ini di Supabase SQL Editor (satu kali, urutan dari atas ke bawah).
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
    singkatan   text,
    nama        text        NOT NULL,
    deskripsi   text,
    fokus       text,
    cocok_untuk text,
    icon        text,
    aliases     text[]      DEFAULT '{}',
    sintak      jsonb       NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE  learning_models             IS 'Model pembelajaran resmi Kurikulum Merdeka. Data statis, di-seed saat setup.';
COMMENT ON COLUMN learning_models.kode        IS 'Identifier standar: pbl, pjbl, dl, il, cooperative, circ.';
COMMENT ON COLUMN learning_models.aliases     IS 'Alias kode model untuk kompatibilitas frontend (misal: discovery untuk dl, inquiry untuk il).';
COMMENT ON COLUMN learning_models.sintak      IS 'Tahapan/langkah sintaks pembelajaran dalam format JSON array.';

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
COMMENT ON COLUMN curriculum_phases.kode     IS 'fondasi | a | b | c | d | e | f (case-insensitive via LOWER)';
COMMENT ON COLUMN curriculum_phases.kelas    IS 'Rentang kelas, NULL untuk Fase Fondasi.';

-- -----------------------------------------------------------------------------
-- subjects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    nama        text        NOT NULL,
    jenjang     text,
    is_custom   boolean     NOT NULL DEFAULT false,
    created_by  uuid,                           -- FK ke users.id jika custom subject
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  subjects            IS 'Daftar mata pelajaran resmi Kemendikbudristek dan mapel kustom guru.';
COMMENT ON COLUMN subjects.jenjang    IS 'SD | SMP | SMA | SMK | PAUD — filter mapel sesuai jenjang guru.';
COMMENT ON COLUMN subjects.is_custom  IS 'true jika diinput mandiri oleh guru, false jika dari daftar resmi pemerintah.';


-- =============================================================================
-- 2. TABEL USERS
--    id harus sama dengan auth.users.id (Supabase Auth)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id          uuid        PRIMARY KEY,            -- dari auth.uid(), BUKAN gen_random_uuid()
    email       text        NOT NULL,
    nama        text        NOT NULL,
    avatar_url  text,                               -- URL foto profil dari Google OAuth
    instansi    text,                               -- nama sekolah (teks bebas, MVP)
    jenjang     text        CHECK (jenjang IN ('PAUD', 'SD', 'SMP', 'SMA', 'SMK')),
    role        text        NOT NULL DEFAULT 'guru'
                            CHECK (role IN ('guru', 'admin')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  users            IS 'Profil guru. id = auth.uid() dari Supabase Auth.';
COMMENT ON COLUMN users.id         IS 'Sama persis dengan auth.users.id. Tidak menggunakan gen_random_uuid().';
COMMENT ON COLUMN users.instansi   IS 'Nama sekolah (teks bebas untuk MVP). Normalisasi ke tabel schools di fase berikutnya.';
COMMENT ON COLUMN users.avatar_url IS 'URL avatar pengguna yang diperoleh dari metadata akun Google.';
COMMENT ON COLUMN users.role       IS 'guru (default) | admin — untuk future admin role.';

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

COMMENT ON TABLE  schools      IS 'Data sekolah resmi. Opsional di MVP — instansi masih disimpan sebagai teks di tabel users.';
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
    
    -- Metadata Modul & Identitas
    mata_pelajaran  text,                           -- Teks nama mapel langsung (menjamin kustom mapel tidak hilang)
    jenjang         text,                           -- PAUD, SD, SMP, SMA, SMK
    fase            text,                           -- Fondasi, A, B, C, D, E, F
    kelas           text,                           -- kelas spesifik (misal: 1, 7, 10)
    judul_bab       text        NOT NULL,           -- Judul bab / materi pokok
    topik           text,                           -- Sub-topik spesifik modul ajar
    tahun_ajaran    text        NOT NULL,           -- contoh: "2026/2027"
    alokasi_waktu   text,                           -- contoh: "2 x 45 menit (1 Pertemuan)"
    
    -- Status Siklus Modul
    status          text        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'generated', 'edited', 'final', 'archived')),
    
    -- Payload Dokumen Lengkap (10 Komponen BSKAP No. 032/H/KR/2024 & Rich Text)
    structured_data jsonb,                          -- JSON StructuredModulAjarData (10 komponen + pengesahan)
    html_content    text,                           -- Konten gabungan TipTap editor siap cetak
    
    -- Audit & Soft Delete
    deleted_at      timestamptz DEFAULT NULL,       -- Soft delete sesuai ARSITEKTUR.md
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  modules                 IS 'Tabel utama perangkat ajar. Satu row = satu modul ajar terstruktur milik satu guru.';
COMMENT ON COLUMN modules.status          IS 'draft | generated | edited | final | archived';
COMMENT ON COLUMN modules.mata_pelajaran  IS 'Nama mapel dalam teks, menjaga integritas jika subject_id bernilai NULL.';
COMMENT ON COLUMN modules.structured_data IS 'Data terstruktur 10 komponen acuan resmi BSKAP No. 032/H/KR/2024.';
COMMENT ON COLUMN modules.html_content    IS 'Konten HTML TipTap Editor untuk kebutuhan pratinjau teks dan ekspor cepat.';
COMMENT ON COLUMN modules.deleted_at      IS 'Timestamp soft delete. Query aktif wajib mengecek WHERE deleted_at IS NULL.';

-- Index Performa
CREATE INDEX IF NOT EXISTS idx_modules_user_id       ON modules (user_id);
CREATE INDEX IF NOT EXISTS idx_modules_status        ON modules (status);
CREATE INDEX IF NOT EXISTS idx_modules_deleted_at    ON modules (deleted_at);
CREATE INDEX IF NOT EXISTS idx_modules_created_at    ON modules (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_modules_user_active   ON modules (user_id, status, created_at DESC) 
    WHERE deleted_at IS NULL;                       -- Composite index teroptimasi untuk query dashboard guru

CREATE OR REPLACE TRIGGER trg_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- 5. TABEL MODULE_SECTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS module_sections (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       uuid        NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    jenis_section   text        NOT NULL,           -- tipe section resmi (10 komponen BSKAP)
    label           text,                           -- nama tampilan di UI
    konten          jsonb,                          -- konten terstruktur per bagian
    konten_html     text,                           -- representasi HTML untuk editor TipTap
    urutan          integer     NOT NULL,
    aktif           boolean     NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  module_sections               IS 'Konten modul per komponen modular. Cascade delete mengikuti modules.';
COMMENT ON COLUMN module_sections.jenis_section IS '10 Komponen BSKAP: informasi_umum | tujuan_pembelajaran | profil_pelajar_pancasila | materi_alat_bahan | model_pembelajaran | kegiatan_pembelajaran | asesmen | refleksi | daftar_pustaka | pengayaan_remedial | lembar_pengesahan | lampiran.';
COMMENT ON COLUMN module_sections.konten        IS 'Konten terstruktur atau node TipTap JSON.';
COMMENT ON COLUMN module_sections.konten_html   IS 'Render HTML spesifik bagian untuk TipTap Editor.';
COMMENT ON COLUMN module_sections.aktif         IS 'Guru dapat menonaktifkan bagian tanpa menghapus data.';

-- Index
CREATE INDEX IF NOT EXISTS idx_module_sections_module_id
    ON module_sections (module_id);
CREATE INDEX IF NOT EXISTS idx_module_sections_module_urutan
    ON module_sections (module_id, urutan);         -- Sorted retrieval

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
    model_name      text        DEFAULT 'gemini-2.0-flash', -- Versi model AI yang digunakan
    prompt_hash     text,                           -- SHA-256 hash dari prompt (bukan prompt lengkap demi privasi)
    tokens_used     integer,
    durasi_ms       integer,
    status          text        CHECK (status IN ('success', 'error', 'timeout')),
    error_message   text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  ai_generation_logs              IS 'Audit log setiap pemanggilan Gemini AI untuk debugging dan pemantauan kuota.';
COMMENT ON COLUMN ai_generation_logs.prompt_hash  IS 'SHA-256 hash dari prompt — bukan prompt lengkap demi privasi guru.';
COMMENT ON COLUMN ai_generation_logs.tipe         IS 'full = seluruh modul, partial = regenerasi satu section.';
COMMENT ON COLUMN ai_generation_logs.model_name    IS 'Nama model Gemini yang dieksekusi (contoh: gemini-2.0-flash).';

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

COMMENT ON TABLE  exports          IS 'Riwayat berkas yang diekspor. Berkas fisik disimpan di Supabase Storage.';
COMMENT ON COLUMN exports.file_url IS 'URL berkas di Supabase Storage (bucket "exports").';
COMMENT ON COLUMN exports.user_id  IS 'Redundan dengan modules.user_id untuk mempercepat evaluasi RLS tanpa JOIN.';

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
-- subjects — public read mapel resmi; guru bisa kelola mapel custom sendiri
-- -----------------------------------------------------------------------
CREATE POLICY "subjects_public_read" ON subjects
    FOR SELECT USING (is_custom = false OR created_by = auth.uid());

CREATE POLICY "subjects_insert_custom" ON subjects
    FOR INSERT WITH CHECK (auth.uid() = created_by AND is_custom = true);

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
-- ai_generation_logs — guru bisa baca log milik sendiri.
--   INSERT diizinkan baik via server service-role maupun autentikasi user guru.
-- -----------------------------------------------------------------------
CREATE POLICY "ai_logs_select_own" ON ai_generation_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_logs_insert_own" ON ai_generation_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- exports — akses riwayat ekspor berkas milik sendiri
-- -----------------------------------------------------------------------
CREATE POLICY "exports_select_own" ON exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "exports_insert_own" ON exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exports_update_own" ON exports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "exports_delete_own" ON exports
    FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- 9. SEED DATA — REFERENSI STATIS
-- =============================================================================

-- -----------------------------------------------------------------------
-- learning_models (6 model pembelajaran Kurikulum Merdeka)
-- -----------------------------------------------------------------------
INSERT INTO learning_models (kode, singkatan, nama, deskripsi, fokus, cocok_untuk, icon, aliases, sintak) VALUES
(
    'pbl',
    'PBL',
    'Problem-Based Learning',
    'Pembelajaran berbasis masalah kontekstual. Peserta didik menganalisis dan merumuskan solusi atas masalah nyata.',
    'Pemecahan masalah kontekstual yang berfokus pada perumusan solusi konkret.',
    'Materi analitis yang menuntut penalaran kritis dan pemecahan kasus kontekstual (IPA, IPS, Matematika, PKn).',
    '🧩',
    ARRAY['problem-based-learning', 'pbl'],
    '[
        {"fase": 1, "nama": "Orientasi Murid pada Masalah", "deskripsi": "Guru menyajikan masalah kontekstual. Siswa mengidentifikasi dan mencatat pertanyaan pemantik."},
        {"fase": 2, "nama": "Pengorganisasian Belajar", "deskripsi": "Siswa membagi peran dalam kelompok untuk menyelidiki batasan masalah."},
        {"fase": 3, "nama": "Penyelidikan Mandiri & Kelompok", "deskripsi": "Siswa mengumpulkan data empiris, melakukan eksperimen, atau mengkaji referensi."},
        {"fase": 4, "nama": "Pengembangan & Penyajian Solusi", "deskripsi": "Siswa merumuskan hipotesis akhir dan menyajikan hasil telaah karya."},
        {"fase": 5, "nama": "Analisis & Evaluasi Pemecahan Masalah", "deskripsi": "Siswa dan guru mengevaluasi alur penalaran dan efektivitas solusi yang dirumuskan."}
    ]'::jsonb
),
(
    'pjbl',
    'PjBL',
    'Project-Based Learning',
    'Pembelajaran berbasis proyek berjangka waktu. Peserta didik merancang, mewujudkan, dan mempresentasikan karya nyata.',
    'Penyusunan karya dan artefak nyata melalui tahapan proyek terencana.',
    'Proyek interdisipliner, Praktik Kejuruan (SMK), Prakarya, Seni, IPAS, Bahasa, P5.',
    '🚀',
    ARRAY['project-based-learning', 'pjbl'],
    '[
        {"fase": 1, "nama": "Penentuan Pertanyaan Mendasar", "deskripsi": "Guru memberikan pertanyaan pemantik esensial yang memicu penciptaan karya nyata."},
        {"fase": 2, "nama": "Perancangan Desain Proyek", "deskripsi": "Siswa merancang pembagian peran, aturan main, dan kebutuhan alat bahan proyek."},
        {"fase": 3, "nama": "Penyusunan Jadwal & Linimasa", "deskripsi": "Guru dan siswa menyepakati tenggat waktu setiap milestone proyek."},
        {"fase": 4, "nama": "Pemantauan Keaktifan & Kemajuan Proyek", "deskripsi": "Guru memfasilitasi bimbingan teknis dan mencatat perkembangan berkala kelompok."},
        {"fase": 5, "nama": "Penilaian Hasil Karya (Gelar Karya)", "deskripsi": "Kelompok memamerkan produk dan menerima umpan balik apresiatif dari rekan sejawat."},
        {"fase": 6, "nama": "Evaluasi Pengalaman Belajar", "deskripsi": "Siswa dan guru merefleksikan proses belajar serta kendala selama pengerjaan proyek."}
    ]'::jsonb
),
(
    'dl',
    'DL',
    'Discovery Learning',
    'Pembelajaran melalui observasi dan eksplorasi terarah untuk membuktikan konsep keilmuan secara mandiri.',
    'Penemuan konsep melalui eksplorasi terarah dan verifikasi data empiris.',
    'Sains, Matematika, dan materi yang membutuhkan pembuktian hukum alam atau fakta empiris.',
    '🔍',
    ARRAY['discovery', 'discovery-learning', 'dl'],
    '[
        {"fase": 1, "nama": "Pemberian Rangsangan (Stimulation)", "deskripsi": "Guru menyajikan fenomena atau gambar pemantik rasa ingin tahu siswa."},
        {"fase": 2, "nama": "Identifikasi Masalah (Problem Statement)", "deskripsi": "Siswa mengidentifikasi masalah relevan dan merumuskan dugaan sementara."},
        {"fase": 3, "nama": "Pengumpulan Data (Data Collection)", "deskripsi": "Siswa mengumpulkan bukti melalui studi pustaka, observasi lingkungan, atau eksperimen."},
        {"fase": 4, "nama": "Pengolahan Data (Data Processing)", "deskripsi": "Siswa menafsirkan informasi dan menghubungkan konsep yang sedang dipelajari."},
        {"fase": 5, "nama": "Pembuktian (Verification)", "deskripsi": "Siswa membuktikan kebenaran hipotesis awal berdasarkan data yang diperoleh."},
        {"fase": 6, "nama": "Penarikan Kesimpulan (Generalization)", "deskripsi": "Siswa merumuskan prinsip umum atau kaidah konsep yang telah terbukti."}
    ]'::jsonb
),
(
    'il',
    'IL',
    'Inquiry Learning',
    'Pembelajaran berbasis penyelidikan ilmiah melalui perumusan pertanyaan kritis dan uji hipotesis.',
    'Penyelidikan ilmiah untuk menjawab pertanyaan penelitian berbasis bukti.',
    'IPA, Fisika, Kimia, Biologi, IPS Terpadu, Sejarah, dan riset ilmiah.',
    '🔬',
    ARRAY['inquiry', 'inquiry-learning', 'il'],
    '[
        {"fase": 1, "nama": "Orientasi Fenomena", "deskripsi": "Guru membimbing pengamatan terhadap fenomena kontekstual."},
        {"fase": 2, "nama": "Perumusan Masalah Penyelidikan", "deskripsi": "Siswa merumuskan pertanyaan terarah yang dapat diuji secara objektif."},
        {"fase": 3, "nama": "Perumusan Hipotesis", "deskripsi": "Siswa menyusun dugaan logis sebelum pengumpulan data dimulai."},
        {"fase": 4, "nama": "Pengumpulan Data Investigatif", "deskripsi": "Siswa merancang percobaan dan mencatat hasil pengukuran secara teliti."},
        {"fase": 5, "nama": "Pengujian Hipotesis", "deskripsi": "Siswa mencocokkan hasil analisis data dengan dugaan awal."},
        {"fase": 6, "nama": "Penarikan Simpulan & Komunikasi", "deskripsi": "Siswa mempublikasikan laporan penyelidikan dan menarik simpulan ilmiah."}
    ]'::jsonb
),
(
    'cooperative',
    'CL',
    'Cooperative Learning',
    'Pembelajaran kelompok kecil dengan pembagian peran terstruktur dan tanggung jawab individu.',
    'Kolaborasi terstruktur dalam kelompok untuk mencapai tujuan belajar bersama.',
    'Mata pelajaran umum, penguatan gotong royong, komunikasi, dan kecerdasan sosial.',
    '🤝',
    ARRAY['cooperative-learning', 'cooperative', 'cl'],
    '[
        {"fase": 1, "nama": "Penyampaian Tujuan & Motivasi", "deskripsi": "Guru menyampaikan target capaian pembelajaran dan pentingnya gotong royong."},
        {"fase": 2, "nama": "Penyajian Informasi Pengantar", "deskripsi": "Guru memberikan paparan konsep kunci sebelum siswa berdiskusi."},
        {"fase": 3, "nama": "Pengorganisasian Tim Kooperatif", "deskripsi": "Siswa dibagi ke dalam kelompok heterogen dengan pembagian peran spesifik."},
        {"fase": 4, "nama": "Bimbingan Kerja Kelompok", "deskripsi": "Guru berkeliling memberikan scaffolding pada kelompok yang membutuhkan bimbingan."},
        {"fase": 5, "nama": "Evaluasi Hasil Belajar", "deskripsi": "Kelompok mempresentasikan hasil kerja dan dinilai berdasarkan rubrik keaktifan."},
        {"fase": 6, "nama": "Pemberian Penghargaan Tim", "deskripsi": "Guru memberikan apresiasi kepada tim dan kontributor terbaik."}
    ]'::jsonb
),
(
    'circ',
    'CIRC',
    'Cooperative Integrated Reading and Composition',
    'Model kooperatif terpadu untuk penguatan keterampilan membaca analitis dan penulisan teks.',
    'Literasi membaca analitis dan penulisan teks secara kolaboratif.',
    'Bahasa Indonesia, Bahasa Inggris, Literasi Teks, Sejarah, dan Pendidikan Agama.',
    '📖',
    ARRAY['circ', 'cooperative-reading'],
    '[
        {"fase": 1, "nama": "Orientasi Wacana & Prediksi", "deskripsi": "Guru membagikan teks tematik; siswa memprediksi garis besar isi wacana."},
        {"fase": 2, "nama": "Pembentukan Tim Pembaca (Jigsaw)", "deskripsi": "Siswa dibagi dalam kelompok kecil untuk menelaah bagian paragraf teks spesifik."},
        {"fase": 3, "nama": "Membaca Mandiri & Analisis Kosakata", "deskripsi": "Siswa membaca cermat, mencatat ide pokok, dan mengidentifikasi istilah baru."},
        {"fase": 4, "nama": "Diskusi Saling Berbagi Telaah", "deskripsi": "Siswa saling bertukar pemahaman antarbagian teks untuk merekonstruksi makna utuh."},
        {"fase": 5, "nama": "Latihan Menulis Terpadu", "deskripsi": "Kelompok menyusun draf ringkasan atau esai pendek berdasarkan pemahaman bersama."},
        {"fase": 6, "nama": "Evaluasi & Umpan Balik Rubrik", "deskripsi": "Hasil karya tulis dinilai bersama menggunakan rubrik literasi membaca-menulis."}
    ]'::jsonb
)
ON CONFLICT (kode) DO UPDATE SET
    singkatan   = EXCLUDED.singkatan,
    nama        = EXCLUDED.nama,
    deskripsi   = EXCLUDED.deskripsi,
    fokus       = EXCLUDED.fokus,
    cocok_untuk = EXCLUDED.cocok_untuk,
    icon        = EXCLUDED.icon,
    aliases     = EXCLUDED.aliases,
    sintak      = EXCLUDED.sintak;

-- -----------------------------------------------------------------------
-- curriculum_phases (Fase Fondasi + A–F Kurikulum Merdeka)
-- -----------------------------------------------------------------------
INSERT INTO curriculum_phases (kode, nama, jenjang, kelas, keterangan) VALUES
(
    'fondasi', 'Fase Fondasi', 'PAUD/TK/RA', NULL,
    'Menggunakan Capaian Perkembangan (bukan Capaian Pembelajaran) dengan pendekatan bermain-belajar kontekstual.'
),
('a', 'Fase A', 'SD/MI',        '1-2', 'Literasi awal dan pengenalan konsep konkret.'),
('b', 'Fase B', 'SD/MI',        '3-4', 'Transisi dari pemahaman konkret ke semi-abstrak.'),
('c', 'Fase C', 'SD/MI',        '5-6', 'Pemahaman konsep mandiri dan keterampilan analisis dasar.'),
('d', 'Fase D', 'SMP/MTs',      '7-9', 'Penalaran logis, penalaran kritis, dan analisis menengah.'),
('e', 'Fase E', 'SMA/SMK/MA',   '10',  'Eksplorasi minat, pemantapan keilmuan, dan analisis kritis.'),
('f', 'Fase F', 'SMA/SMK/MA',   '11-12', 'Penjurusan bidang keilmuan dan kematangan akademik/kejuruan.')
ON CONFLICT (kode) DO UPDATE SET
    nama       = EXCLUDED.nama,
    jenjang    = EXCLUDED.jenjang,
    kelas      = EXCLUDED.kelas,
    keterangan = EXCLUDED.keterangan;

-- -----------------------------------------------------------------------
-- subjects — daftar mata pelajaran umum per jenjang
-- -----------------------------------------------------------------------
INSERT INTO subjects (nama, jenjang, is_custom) VALUES
-- SD/MI
('Pendidikan Agama & Budi Pekerti',         'SD', false),
('Pendidikan Pancasila',                     'SD', false),
('Bahasa Indonesia',                         'SD', false),
('Matematika',                               'SD', false),
('Ilmu Pengetahuan Alam & Sosial (IPAS)',    'SD', false),
('Seni (Rupa/Musik/Teater/Tari)',            'SD', false),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SD', false),
('Bahasa Inggris',                           'SD', false),
-- SMP/MTs
('Pendidikan Agama & Budi Pekerti',         'SMP', false),
('Pendidikan Pancasila',                     'SMP', false),
('Bahasa Indonesia',                         'SMP', false),
('Matematika',                               'SMP', false),
('Ilmu Pengetahuan Alam (IPA)',              'SMP', false),
('Ilmu Pengetahuan Sosial (IPS)',            'SMP', false),
('Bahasa Inggris',                           'SMP', false),
('Informatika',                              'SMP', false),
('Seni Budaya',                              'SMP', false),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SMP', false),
-- SMA/SMK
('Pendidikan Agama & Budi Pekerti',         'SMA', false),
('Pendidikan Pancasila',                     'SMA', false),
('Bahasa Indonesia',                         'SMA', false),
('Matematika',                               'SMA', false),
('Bahasa Inggris',                           'SMA', false),
('Biologi',                                  'SMA', false),
('Fisika',                                   'SMA', false),
('Kimia',                                    'SMA', false),
('Sejarah Indonesia',                        'SMA', false),
('Geografi',                                 'SMA', false),
('Ekonomi',                                  'SMA', false),
('Sosiologi',                                'SMA', false),
('Informatika',                              'SMA', false),
('Seni Budaya',                              'SMA', false),
('Pendidikan Jasmani Olahraga & Kesehatan', 'SMA', false),
-- PAUD / TK
('Nilai Agama & Budi Pekerti',              'PAUD', false),
('Jati Diri',                               'PAUD', false),
('Dasar Literasi & STEAM',                  'PAUD', false)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- 10. HELPER FUNCTION — Rate Limiting AI Generation
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
    'Menghitung jumlah generasi AI yang berhasil dalam 24 jam terakhir untuk satu guru. Digunakan untuk rate limiting harian.';


-- =============================================================================
-- 11. TRIGGER — Auto-sync users dari Supabase Auth
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, nama, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture'
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        email      = EXCLUDED.email,
        nama       = COALESCE(EXCLUDED.nama, users.nama),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        updated_at = now();

    RETURN NEW;
END;
$$;

-- Pasang trigger ke auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user IS
    'Trigger: saat user baru terdaftar via Supabase Auth (Google OAuth), otomatis membuat atau memperbarui profil di tabel public.users.';


-- =============================================================================
-- 12. SUPABASE STORAGE BUCKET (Instruksi & Policy 'exports')
-- =============================================================================
-- Jalankan blok di bawah ini jika storage bucket "exports" belum dibuat via Dashboard:

INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: guru hanya bisa membaca file ekspor miliknya sendiri (folder = user_id)
CREATE POLICY "exports_storage_select_own" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'exports' AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );

CREATE POLICY "exports_storage_insert_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'exports' AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );

CREATE POLICY "exports_storage_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'exports' AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );


-- =============================================================================
-- SELESAI
-- =============================================================================
-- Ringkasan Audit Skema v2.1:
--   [x] Dukungan penuh 10 Komponen Modul Ajar (BSKAP Kemendikbud No. 032/H/KR/2024).
--   [x] Kolom structured_data jsonb & html_content pada tabel modules untuk sinkronisasi seketika.
--   [x] Kolom deleted_at timestamptz & index terfilter untuk soft delete (ARSITEKTUR.md).
--   [x] Sinkronisasi status modul ('draft', 'generated', 'edited', 'final', 'archived').
--   [x] Dukungan alias model pembelajaran ('discovery', 'inquiry') dan metadata model lengkap.
--   [x] Dukungan mata pelajaran kustom (is_custom & created_by) dengan RLS terisolasi.
--   [x] Sinkronisasi nama & avatar dari Google OAuth pada trigger handle_new_user.
--   [x] Konfigurasi Storage Bucket & RLS untuk file ekspor .docx/.pdf.
-- =============================================================================
