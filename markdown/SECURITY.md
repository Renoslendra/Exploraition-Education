# SECURITY.md — Modulin

Dokumen keamanan aplikasi Modulin. Berlaku untuk seluruh stack: Next.js (Vercel), Supabase (Auth, PostgreSQL, Storage), Gemini 2.0 Flash API.

---

## 1. Autentikasi

Modulin menggunakan Supabase Auth dengan provider Google OAuth. Tidak ada custom auth.

**Alur login:**

1. Guru klik tombol "Masuk dengan Google".
2. Supabase mengarahkan ke Google OAuth consent screen.
3. Google mengembalikan authorization code ke Supabase.
4. Supabase menukar code menjadi access token, membuat/memperbarui record di `auth.users`, dan menerbitkan JWT.
5. JWT disimpan di httpOnly cookie (bukan localStorage — tidak bisa diakses JavaScript client).
6. Setiap request ke API route, server memvalidasi JWT via `supabase.auth.getUser()` sebelum memproses.

**Catatan:**
- Tidak ada form login/password. Satu-satunya metode autentikasi adalah Google OAuth.
- Session refresh ditangani otomatis oleh Supabase client library.
- Logout menghapus cookie dan memanggil `supabase.auth.signOut()`.

---

## 2. Row Level Security (RLS)

Semua tabel mengaktifkan RLS. Tanpa policy yang cocok, akses ditolak secara default.

### users

Guru hanya bisa membaca dan mengubah data sendiri.

```sql
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### modules

CRUD hanya untuk modul milik sendiri.

```sql
CREATE POLICY "modules_select_own" ON modules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "modules_insert_own" ON modules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "modules_update_own" ON modules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "modules_delete_own" ON modules
  FOR DELETE USING (auth.uid() = user_id);
```

### module_sections

Akses melalui kepemilikan parent module.

```sql
CREATE POLICY "module_sections_select_own" ON module_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules WHERE modules.id = module_sections.module_id
      AND modules.user_id = auth.uid()
    )
  );

CREATE POLICY "module_sections_insert_own" ON module_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM modules WHERE modules.id = module_sections.module_id
      AND modules.user_id = auth.uid()
    )
  );

CREATE POLICY "module_sections_update_own" ON module_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM modules WHERE modules.id = module_sections.module_id
      AND modules.user_id = auth.uid()
    )
  );

CREATE POLICY "module_sections_delete_own" ON module_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM modules WHERE modules.id = module_sections.module_id
      AND modules.user_id = auth.uid()
    )
  );
```

### ai_generation_logs

Guru hanya bisa membaca log milik sendiri. Insert dilakukan oleh server (service role).

```sql
CREATE POLICY "ai_logs_select_own" ON ai_generation_logs
  FOR SELECT USING (auth.uid() = user_id);
```

### exports

Akses hanya untuk ekspor milik sendiri.

```sql
CREATE POLICY "exports_select_own" ON exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "exports_insert_own" ON exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exports_delete_own" ON exports
  FOR DELETE USING (auth.uid() = user_id);
```

### learning_models, curriculum_phases, subjects

Data referensi. Semua user boleh baca, tidak ada yang boleh tulis via client.

```sql
-- Berlaku sama untuk ketiga tabel
CREATE POLICY "reference_data_public_read" ON learning_models
  FOR SELECT USING (true);

CREATE POLICY "reference_data_public_read" ON curriculum_phases
  FOR SELECT USING (true);

CREATE POLICY "reference_data_public_read" ON subjects
  FOR SELECT USING (true);

-- Tidak ada policy INSERT/UPDATE/DELETE.
-- Mutasi data referensi hanya via migration atau service role.
```

---

## 3. Proteksi API Key

| Variable | Lokasi | Terekspos ke client? |
|---|---|---|
| `GEMINI_API_KEY` | Vercel env vars (server only) | Tidak |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env vars (server only) | Tidak |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env vars | Ya (aman, bukan secret) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env vars | Ya (aman, dibatasi RLS) |

**Aturan ketat:**
- Prefix `NEXT_PUBLIC_` tidak pernah digunakan untuk `GEMINI_API_KEY` atau `SUPABASE_SERVICE_ROLE_KEY`.
- Semua panggilan ke Gemini API dilakukan dari Next.js API routes (server-side). Client tidak pernah berkomunikasi langsung dengan Gemini.
- `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server untuk operasi yang melewati RLS (contoh: menulis ke `ai_generation_logs`).

---

## 4. Rate Limiting

Generasi modul menggunakan Gemini API yang memiliki biaya per token. Perlu pembatasan untuk mencegah penyalahgunaan.

**Implementasi saat ini:** cek jumlah record di `ai_generation_logs` untuk user tersebut dalam 24 jam terakhir sebelum mengizinkan generasi baru.

```sql
SELECT COUNT(*) FROM ai_generation_logs
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '24 hours'
  AND status = 'success';
```

Jika jumlah >= batas harian, tolak request dengan HTTP 429.

> **KEPUTUSAN DIPERLUKAN:** Batas harian per guru belum ditetapkan. Rekomendasi: 10-20 generate per hari. Pertimbangkan beban biaya API dan pola penggunaan guru setelah launch.

**Alternatif:** Middleware-based rate limiting (misalnya Vercel Edge Middleware atau library `next-rate-limit`) untuk proteksi tambahan terhadap burst request. Ini melindungi di layer HTTP, sebelum request mencapai database.

---

## 5. Privasi Data

### Data yang disimpan

- Nama guru (dari Google profile)
- Email guru (dari Google profile)
- Nama sekolah (opsional, diisi guru)
- Konten modul (judul, tujuan pembelajaran, materi, asesmen)

### UU Pelindungan Data Pribadi (UU PDP)

Semua data di atas diperlakukan sebagai data pribadi sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

**Hak guru:**
- Menghapus semua modul miliknya kapan saja.
- Menghapus akun dan seluruh data terkait (hard delete dari database).
- Meminta salinan data pribadinya (data portability).

**Retensi data:**
- Modul disimpan sampai guru menghapusnya secara manual.
- Setelah penghapusan akun, semua data guru dihapus permanen (cascade delete).

### Pengungkapan ke pihak ketiga

Konten modul dikirim ke Google Gemini API untuk proses generasi. Hal ini berarti:
- Teks prompt (berisi topik, fase kurikulum, model pembelajaran) dikirim ke server Google.
- Berlaku [Google API Terms of Service](https://ai.google.dev/gemini-api/terms) untuk data yang diproses.
- Tidak ada data guru yang dibagikan ke pihak ketiga lain selain untuk keperluan generasi AI.

---

## 6. Validasi Input

### Input dari user (form)

- Semua input dari form divalidasi dengan Zod schema di API route sebelum diproses.
- Sanitasi terhadap XSS: input yang akan dirender sebagai HTML harus di-escape atau di-sanitize.

### Output dari AI

Output Gemini bisa mengandung HTML yang tidak aman (script tag, event handler, dsb). Sebelum dirender di TipTap editor:

1. Sanitize output HTML menggunakan DOMPurify (atau library sejenis) di server sebelum dikirim ke client.
2. Whitelist hanya tag yang dibutuhkan TipTap (p, h1-h6, ul, ol, li, strong, em, table, tr, td, th, blockquote, code, pre).
3. Strip semua atribut kecuali yang dibutuhkan (colspan, rowspan untuk tabel).

```typescript
// ponytail: sanitasi minimal — tambahkan allowlist lebih ketat jika AI output bermasalah
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'strong', 'em', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'code', 'pre', 'br',
];

function sanitizeAIOutput(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: ['colspan', 'rowspan'] });
}
```

### Validasi API route

Setiap API route memvalidasi request body dengan Zod. Request yang tidak valid ditolak dengan HTTP 400 sebelum menyentuh database atau API eksternal.

---

## 7. Backup & Recovery

### Supabase Pro plan

- Backup harian otomatis.
- Point-in-time recovery (PITR) tersedia — bisa restore ke detik tertentu dalam 7 hari terakhir.

### Supabase free tier

- **Tidak ada backup otomatis.** Ini adalah risiko.
- Rekomendasi: jalankan `pg_dump` secara berkala untuk data kritis.

```bash
# Contoh backup manual
pg_dump -h db.xxxx.supabase.co -U postgres -d postgres -F c -f modulin_backup_$(date +%Y%m%d).dump
```

- Simpan hasil backup di lokasi terpisah (bukan di Supabase Storage yang sama).
- Pertimbangkan upgrade ke Pro plan sebelum production dengan data guru yang signifikan.

---

## 8. Audit Log

Tabel `ai_generation_logs` mencatat setiap request generasi AI.

| Kolom | Isi | Catatan |
|---|---|---|
| `user_id` | UUID guru | FK ke `users` |
| `module_id` | UUID modul | FK ke `modules` |
| `prompt_hash` | SHA-256 hash dari prompt | Bukan prompt lengkap — untuk privasi guru |
| `tokens_used` | Jumlah token yang dikonsumsi | Untuk monitoring biaya |
| `status` | `success` / `error` | |
| `created_at` | Timestamp | |

**Tujuan:** Monitoring biaya API dan debugging. Bukan untuk mengawasi konten yang dibuat guru.

Prompt lengkap tidak disimpan di log karena bisa mengandung informasi sensitif tentang materi ajar dan konteks sekolah.

> **KEPUTUSAN DIPERLUKAN:** Berapa lama log disimpan belum ditetapkan. Rekomendasi: 90 hari untuk debugging, lalu hapus otomatis (scheduled delete atau Supabase cron). Data agregat (total token per bulan) bisa dipertahankan lebih lama untuk perencanaan biaya.

---

Rujukan silang: SCHEMA.md (struktur tabel dan RLS), ARSITEKTUR.md (integrasi Supabase), RULES.md (ketentuan privasi).
