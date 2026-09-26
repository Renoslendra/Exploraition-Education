# RULES.md — Modulin

Modulin adalah web app untuk guru Indonesia yang menghasilkan modul ajar sesuai Kurikulum Merdeka. Produk ini adalah AI-assisted document production tool — bukan LMS, bukan platform belajar siswa, bukan pengganti keputusan pedagogis guru. Guru memilih model pembelajaran, mengisi identitas modul, dan AI men-generate draf modul ajar lengkap yang kemudian bisa diedit dan diekspor. File ini mendefinisikan batas tegas apa yang termasuk dan tidak termasuk dalam MVP.

---

## 1. In-Scope MVP

Fitur yang TERMASUK dalam MVP:

- Pemilihan 6 model pembelajaran (PBL, PjBL, Discovery Learning, Inquiry Learning, Cooperative Learning, CIRC) dengan penjelasan di UI
- Form identitas modul: nama guru, instansi, mata pelajaran, jenjang/kelas, bab, tahun ajaran — fase terisi otomatis berdasarkan jenjang/kelas
- AI riset materi bab via Google Search Grounding (Gemini 2.0 Flash)
- Generate draf modul ajar lengkap sesuai struktur resmi 3 komponen:
  1. Informasi Umum
  2. Komponen Inti
  3. Lampiran
- Editor in-app (TipTap) untuk review dan edit hasil AI
- Ekspor PDF dan Word
- Riwayat modul per guru (simpan, buka kembali, hapus)
- Autentikasi via Google OAuth (Supabase Auth)
- Multi-jenjang: PAUD/TK sampai SMA/SMK (fase Fondasi sampai F)
- Regenerasi parsial — guru bisa me-regenerate satu section saja tanpa mengulang seluruh modul

---

## 2. Out-of-Scope (Eksplisit)

Hal yang SENGAJA TIDAK dilakukan oleh produk ini:

- **Bukan LMS (Learning Management System)** — tidak ada manajemen kelas, distribusi tugas, atau tracking kehadiran
- **Bukan platform belajar siswa** — tidak ada konten belajar, video, atau latihan soal untuk murid
- **Bukan sistem penilaian otomatis siswa** — modul ajar berisi instrumen asesmen, tapi nilai siswa tidak diinput atau diolah di sini
- **Tidak menyimpan data individual murid** — hanya data guru dan konten modul
- **Tidak menggantikan keputusan pedagogis guru** — AI menyediakan draf, guru yang memutuskan
- **Tidak menjamin kepatuhan hukum penuh terhadap regulasi kurikulum daerah tertentu** — modul mengikuti struktur nasional Kurikulum Merdeka
- **Bukan alat kolaborasi real-time** — ini roadmap, bukan MVP
- **Tidak menyediakan template modul siap pakai tanpa AI generate** — setiap modul di-generate kontekstual berdasarkan input guru
- **Bukan pengganti Ruangguru/Quipper/Zenius/Google Classroom** — produk ini di segmen berbeda (alat produksi dokumen pedagogis untuk guru)

---

## 3. Batasan Teknis MVP

- **Mata pelajaran yang didukung**: [KEPUTUSAN DIPERLUKAN — semua mapel sekaligus, atau subset prioritas di tahap awal? Jika subset, tentukan daftarnya.]
- **Batas generate per guru per hari**: mengikuti limit tier [KEPUTUSAN DIPERLUKAN — 10 atau 20 per hari?]
- **Gemini 2.0 Flash free tier**: 15 RPM — wajib implementasi rate limiting di server
- **Export PDF**: menggunakan html2pdf.js (client-side) atau Puppeteer (server-side) — [KEPUTUSAN DIPERLUKAN — trade-off: client-side lebih ringan tapi formatting kurang konsisten; server-side lebih akurat tapi terkena Vercel function timeout]
- **Supabase free tier**: 500MB database, 1GB storage, 2GB bandwidth — cukup untuk MVP, perlu monitoring usage
- **Vercel free tier**: 10s function timeout — bisa jadi bottleneck untuk AI generation yang panjang; pertimbangkan streaming response atau background job

---

## 4. Ketentuan Konten AI

- Setiap modul hasil AI WAJIB berstatus "draf" sampai guru secara eksplisit menyimpannya sebagai final
- Tampilkan disclaimer di setiap modul yang di-generate:
  > "Konten ini dihasilkan oleh AI dan mungkin mengandung ketidakakuratan. Guru bertanggung jawab meninjau dan menyesuaikan sebelum digunakan di kelas."
- AI tidak boleh menghasilkan konten yang bertentangan dengan nilai pendidikan nasional
- AI wajib menyertakan sumber referensi saat melakukan riset bab (dari Google Search Grounding)
- Jika AI tidak yakin dengan cakupan materi, AI wajib mengaku terbatas daripada mengarang — lebih baik jujur "informasi terbatas" daripada halusinasi

---

## 5. Ketentuan Kepatuhan Kurikulum

- AI wajib merujuk struktur resmi 3 komponen modul ajar: Informasi Umum, Komponen Inti, Lampiran
- AI **dilarang** membuat Capaian Pembelajaran (CP) sendiri — hanya merujuk CP yang sudah ditetapkan pemerintah
- Alur resmi yang harus diikuti: CP -> TP -> ATP -> Modul Ajar — AI menyusun modul yang selaras dengan alur ini
- Istilah resmi kurikulum tidak boleh diubah atau disederhanakan oleh AI (contoh: "Capaian Pembelajaran" tidak boleh disingkat menjadi istilah informal)
- Fase Fondasi (PAUD) menggunakan istilah "capaian perkembangan", bukan "capaian pembelajaran"
- Setiap model pembelajaran wajib mengikuti sintak/tahapan resminya — sintak tersimpan di tabel `learning_models` di database dan menjadi referensi wajib saat generate

---

## 6. Definition of Done untuk MVP

Kriteria agar MVP dinyatakan demo-ready:

- [ ] Guru bisa registrasi/login via Google OAuth
- [ ] Guru bisa memilih model pembelajaran dan melihat penjelasannya di UI
- [ ] Guru bisa mengisi form identitas modul dan fase terisi otomatis berdasarkan jenjang/kelas
- [ ] AI bisa melakukan riset bab dan generate modul ajar lengkap sesuai struktur resmi 3 komponen
- [ ] Guru bisa mengedit hasil AI di editor TipTap
- [ ] Guru bisa mengekspor modul sebagai PDF dan Word
- [ ] Modul tersimpan di riwayat dan bisa dibuka kembali
- [ ] Satu alur utuh dari nol sampai file terunduh bisa diselesaikan dalam satu sesi tanpa error
- [ ] Disclaimer AI ditampilkan di setiap modul yang di-generate

---

Rujukan silang: PRD.md (fitur lengkap dan user stories), ARSITEKTUR.md (batasan teknis stack), AGENT.md (guardrail konten AI), USERFLOW.md (alur yang harus berfungsi untuk Definition of Done).
