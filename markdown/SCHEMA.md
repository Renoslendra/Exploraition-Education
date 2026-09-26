# SCHEMA.md — Modulin Database Schema

Dokumen ini mendefinisikan skema database PostgreSQL (via Supabase) untuk Modulin, aplikasi web yang membantu guru Indonesia membuat modul ajar sesuai Kurikulum Merdeka. Autentikasi menggunakan Supabase Auth dengan Google OAuth. Semua tabel menggunakan UUID sebagai primary key dan Row Level Security (RLS) diaktifkan di sisi Supabase. Dokumen ini bersifat mandiri — cukup dibaca sendiri untuk memahami struktur data lengkap.

---

## 1. Diagram ERD

```mermaid
erDiagram
    users ||--o{ modules : "membuat"
    modules ||--o{ module_sections : "memiliki"
    modules ||--o{ ai_generation_logs : "mencatat"
    modules ||--o{ exports : "mengekspor"
    modules }o--|| learning_models : "menggunakan"
    modules }o--|| curriculum_phases : "merujuk"
    modules }o--|| subjects : "untuk"

    users {
        uuid id PK
        text email
        text nama
        text instansi
        text jenjang
        text role
        timestamptz created_at
        timestamptz updated_at
    }

    schools {
        uuid id PK
        text nama
        text alamat
        text npsn
        timestamptz created_at
    }

    learning_models {
        uuid id PK
        text kode
        text nama
        text deskripsi
        text fokus
        jsonb sintak
    }

    curriculum_phases {
        uuid id PK
        text kode
        text nama
        text jenjang
        text kelas
        text keterangan
    }

    subjects {
        uuid id PK
        text nama
        text jenjang
        timestamptz created_at
    }

    modules {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        uuid phase_id FK
        uuid model_id FK
        text judul_bab
        text kelas
        text tahun_ajaran
        text status
        timestamptz created_at
        timestamptz updated_at
    }

    module_sections {
        uuid id PK
        uuid module_id FK
        text jenis_section
        text label
        jsonb konten
        integer urutan
        boolean aktif
        timestamptz created_at
        timestamptz updated_at
    }

    ai_generation_logs {
        uuid id PK
        uuid module_id FK
        uuid user_id FK
        text tipe
        text section_target
        text prompt_hash
        integer tokens_used
        integer durasi_ms
        text status
        text error_message
        timestamptz created_at
    }

    exports {
        uuid id PK
        uuid module_id FK
        text format
        text file_url
        integer file_size
        timestamptz created_at
    }
```

---

## 2. Tabel `users`

Menyimpan profil guru yang terdaftar. Field `id` berasal langsung dari Supabase Auth (`auth.uid()`), bukan auto-generated di tabel ini.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | Dari Supabase Auth (`auth.uid()`). Tidak menggunakan `gen_random_uuid()` — nilainya harus sama dengan `auth.users.id`. |
| email | text NOT NULL | Email dari Google OAuth. |
| nama | text NOT NULL | Nama lengkap guru. |
| instansi | text | Nama sekolah (teks bebas untuk MVP). |
| jenjang | text | Jenjang pendidikan: `PAUD`, `SD`, `SMP`, `SMA`, `SMK`. |
| role | text DEFAULT `'guru'` | Untuk future admin role. Saat ini selalu `'guru'`. |
| created_at | timestamptz DEFAULT `now()` | |
| updated_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Constraints:** `email` harus NOT NULL.
**Recommended indexes:** `email` (unique lookup saat login).

---

## 3. Tabel `schools`

**(Opsional — untuk MVP, data instansi cukup disimpan sebagai field teks di tabel `users`. Tabel ini disiapkan untuk normalisasi di fase berikutnya.)**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| nama | text NOT NULL | Nama sekolah. |
| alamat | text | Alamat lengkap. |
| npsn | text UNIQUE | Nomor Pokok Sekolah Nasional — identifier resmi Kemendikbud. |
| created_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Constraints:** `npsn` UNIQUE (satu NPSN = satu sekolah).
**Recommended indexes:** `npsn` (lookup by official ID).

---

## 4. Tabel `learning_models`

Tabel referensi statis berisi 6 model pembelajaran yang didukung Kurikulum Merdeka. Data di-seed saat setup, tidak diubah oleh user.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| kode | text UNIQUE NOT NULL | Identifier singkat: `pbl`, `pjbl`, `dl`, `il`, `cooperative`, `circ`. |
| nama | text NOT NULL | Nama lengkap model. |
| deskripsi | text | Penjelasan singkat model. |
| fokus | text | Fokus utama model. |
| sintak | jsonb NOT NULL | Tahapan/langkah per fase dalam format JSON. |

**Primary key:** `id`
**Constraints:** `kode` UNIQUE NOT NULL.
**Recommended indexes:** `kode` (lookup saat form selection).

### 6 Model Pembelajaran

| Kode | Nama | Fokus |
|---|---|---|
| `pbl` | Problem-Based Learning | Pemecahan masalah nyata — proses berakhir pada **solusi**. |
| `pjbl` | Project-Based Learning | Pemecahan masalah nyata — proses berakhir pada **produk**. |
| `dl` | Discovery Learning | Penemuan konsep secara mandiri melalui eksplorasi. |
| `il` | Inquiry Learning | Penyelidikan ilmiah berbasis pertanyaan. |
| `cooperative` | Cooperative Learning | Kolaborasi terstruktur dalam kelompok kecil. |
| `circ` | Cooperative Integrated Reading and Composition | Literasi membaca dan menulis secara kooperatif. |

**Catatan penting:** PBL dan PjBL sering tertukar. Perbedaan kunci: PBL berakhir pada **solusi** (analisis masalah), PjBL berakhir pada **produk** (artefak nyata yang dihasilkan siswa). Sintak keduanya berbeda dan disimpan terpisah di kolom `sintak`.

---

## 5. Tabel `curriculum_phases`

Tabel referensi statis berisi fase-fase Kurikulum Merdeka. Data di-seed saat setup.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| kode | text UNIQUE NOT NULL | `fondasi`, `a`, `b`, `c`, `d`, `e`, `f`. |
| nama | text NOT NULL | Fase Fondasi, Fase A, dst. |
| jenjang | text NOT NULL | Jenjang yang sesuai. |
| kelas | text | Rentang kelas. `null` untuk Fondasi. |
| keterangan | text | Catatan khusus. |

**Primary key:** `id`
**Constraints:** `kode` UNIQUE NOT NULL.
**Recommended indexes:** `kode`, `jenjang`.

### Pemetaan Fase Kurikulum Merdeka

| Kode | Nama | Jenjang | Kelas | Keterangan |
|---|---|---|---|---|
| `fondasi` | Fase Fondasi | PAUD/TK/RA | — | Menggunakan **capaian perkembangan**, bukan capaian pembelajaran. Struktur modul berbeda dari fase lainnya. |
| `a` | Fase A | SD/MI | 1-2 | |
| `b` | Fase B | SD/MI | 3-4 | |
| `c` | Fase C | SD/MI | 5-6 | |
| `d` | Fase D | SMP/MTs | 7-9 | |
| `e` | Fase E | SMA/SMK/MA | 10 | |
| `f` | Fase F | SMA/SMK/MA | 11-12 | |

---

## 6. Tabel `subjects`

Menyimpan daftar mata pelajaran.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| nama | text NOT NULL | Nama mata pelajaran. |
| jenjang | text | Jenjang di mana mapel ini berlaku (SD, SMP, SMA, dst). |
| created_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Recommended indexes:** `jenjang` (filter mapel berdasarkan jenjang guru).

> **[KEPUTUSAN DIPERLUKAN]** Apakah daftar mata pelajaran di-hardcode sebagai seed data, atau guru bisa input custom? Jika hardcode: seed dari daftar resmi Kemendikbud per jenjang. Jika custom: tambahkan kolom `is_custom boolean DEFAULT false` dan `created_by uuid FK → users.id` untuk membedakan data resmi dari input guru.

---

## 7. Tabel `modules`

Tabel utama. Satu row = satu modul ajar yang dibuat guru.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| user_id | uuid FK → `users.id` NOT NULL | Guru pembuat modul. |
| subject_id | uuid FK → `subjects.id` | Mata pelajaran. |
| phase_id | uuid FK → `curriculum_phases.id` | Fase kurikulum. |
| model_id | uuid FK → `learning_models.id` | Model pembelajaran yang dipilih. |
| judul_bab | text NOT NULL | Judul bab / topik modul. |
| kelas | text | Kelas spesifik dalam fase (misal: fase D bisa kelas 7, 8, atau 9). |
| tahun_ajaran | text NOT NULL | Contoh: `"2024/2025"`. |
| status | text DEFAULT `'draft'` | CHECK (`status IN ('draft', 'final')`). |
| created_at | timestamptz DEFAULT `now()` | |
| updated_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Foreign keys:**
- `user_id` → `users.id`
- `subject_id` → `subjects.id`
- `phase_id` → `curriculum_phases.id`
- `model_id` → `learning_models.id`

**Constraints:** `status` CHECK IN (`'draft'`, `'final'`).
**Recommended indexes:**
- `user_id` — query semua modul milik guru.
- `status` — filter draft vs final.
- `created_at DESC` — sorting terbaru di dashboard.
- Composite: `(user_id, status, created_at DESC)` untuk query dashboard yang paling sering dijalankan.

---

## 8. Tabel `module_sections`

Menyimpan konten modul per bagian. Satu modul terdiri dari banyak section yang bisa diaktifkan/nonaktifkan oleh guru.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| module_id | uuid FK → `modules.id` ON DELETE CASCADE | Cascade delete: hapus modul = hapus semua section-nya. |
| jenis_section | text NOT NULL | Tipe section (lihat daftar di bawah). |
| label | text | Nama tampilan di UI. |
| konten | jsonb | Konten terstruktur atau TipTap JSON untuk rich text. |
| urutan | integer NOT NULL | Urutan tampil. |
| aktif | boolean DEFAULT `true` | Guru bisa enable/disable section tanpa menghapus data. |
| created_at | timestamptz DEFAULT `now()` | |
| updated_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Foreign keys:** `module_id` → `modules.id` ON DELETE CASCADE.
**Constraints:** `jenis_section` NOT NULL, `urutan` NOT NULL.
**Recommended indexes:**
- `module_id` — query semua section dalam satu modul.
- `(module_id, urutan)` — sorted retrieval.

### Pemetaan Section ke Komponen Resmi Modul Ajar

Modul ajar Kurikulum Merdeka memiliki 3 komponen utama. Kolom `jenis_section` memetakan ke struktur berikut:

1. **Informasi Umum** (`informasi_umum`)
   - Identitas modul, kompetensi awal, profil pelajar Pancasila, sarana prasarana, target peserta didik, model pembelajaran.

2. **Komponen Inti** (`komponen_inti`)
   - Tujuan pembelajaran, pemahaman bermakna, pertanyaan pemantik, kegiatan pembelajaran (per pertemuan/sintak), asesmen, pengayaan & remediasi.

3. **Lampiran** (`lampiran`)
   - LKPD, bahan bacaan, glosarium, daftar pustaka, rubrik asesmen.

Sub-section disimpan sebagai row terpisah dengan `jenis_section` yang lebih spesifik (misal: `tujuan_pembelajaran`, `kegiatan_pembelajaran`, `asesmen`), dikelompokkan secara logis oleh aplikasi berdasarkan prefix atau mapping di application layer.

---

## 9. Tabel `ai_generation_logs`

Mencatat setiap pemanggilan AI untuk audit, debugging, dan analisis usage. Tidak menyimpan prompt lengkap demi privasi — hanya hash-nya.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| module_id | uuid FK → `modules.id` | Modul yang di-generate. |
| user_id | uuid FK → `users.id` | Guru yang memicu generasi. |
| tipe | text | `'full'` (seluruh modul) atau `'partial'` (regenerasi satu section). |
| section_target | text | `null` untuk full generation, nama section untuk partial. |
| prompt_hash | text | Hash dari prompt yang dikirim ke AI. **Bukan** prompt lengkap — untuk alasan privasi. |
| tokens_used | integer | Total token yang digunakan (input + output). |
| durasi_ms | integer | Waktu proses dalam milidetik. |
| status | text | `'success'`, `'error'`, `'timeout'`. |
| error_message | text | Pesan error jika `status != 'success'`. |
| created_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Foreign keys:**
- `module_id` → `modules.id`
- `user_id` → `users.id`

**Recommended indexes:**
- `user_id` — query usage per guru.
- `module_id` — history generasi per modul.
- `created_at` — analisis trend.
- `status` — filter error untuk monitoring.

---

## 10. Tabel `exports`

Mencatat setiap file yang diekspor. File disimpan di Supabase Storage, URL-nya dicatat di sini.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK DEFAULT `gen_random_uuid()` | |
| module_id | uuid FK → `modules.id` | Modul yang diekspor. |
| format | text | CHECK (`format IN ('pdf', 'docx')`). |
| file_url | text | URL file di Supabase Storage. |
| file_size | integer | Ukuran file dalam bytes. |
| created_at | timestamptz DEFAULT `now()` | |

**Primary key:** `id`
**Foreign keys:** `module_id` → `modules.id`.
**Constraints:** `format` CHECK IN (`'pdf'`, `'docx'`).
**Recommended indexes:** `module_id` (lookup export history per modul).

---

Rujukan silang: SECURITY.md (kebijakan RLS per tabel), ARSITEKTUR.md (integrasi Supabase), AGENT.md (skema output AI yang dipetakan ke module_sections). Data referensi learning_models dan curriculum_phases bersumber dari riset kurikulum di master prompt bagian 5.
