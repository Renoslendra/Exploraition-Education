# AGENT.md — Modulin AI Agent

Dokumen ini mendefinisikan perilaku AI agent dalam sistem Modulin: aplikasi web untuk guru Indonesia membuat modul ajar sesuai Kurikulum Merdeka, menggunakan Gemini 2.0 Flash dengan Google Search Grounding.

---

## 1. Peran AI dalam Sistem

Sistem menggunakan dua fungsi konseptual. Keduanya bisa berjalan dalam satu atau beberapa API call tergantung kebutuhan — yang penting adalah pemisahan tanggung jawab, bukan pemisahan teknis.

### Research Agent

Mencari cakupan materi bab via Search Grounding. Tugas:

- Menemukan topik dan konsep yang tercakup dalam bab tertentu berdasarkan kurikulum resmi.
- Mengidentifikasi Capaian Pembelajaran (CP) yang relevan dari dokumen pemerintah. CP ditetapkan pemerintah per fase per mata pelajaran — AI **tidak boleh** mengarang CP sendiri.
- Mengumpulkan sumber rujukan yang akan digunakan Generator Agent.
- Untuk Fase Fondasi (PAUD): mencari "capaian perkembangan", bukan "capaian pembelajaran". Ini special case yang harus ditangani secara eksplisit.

### Generator Agent

Menyusun draft modul ajar dari hasil riset + input guru, mengikuti struktur resmi 3 komponen. Tugas:

- Menerima hasil riset Research Agent, identitas guru, dan model pembelajaran yang dipilih.
- Menghasilkan output JSON terstruktur sesuai skema modul ajar.
- Menyesuaikan bahasa dan kompleksitas konten sesuai fase (konten PAUD vs SMA sangat berbeda).
- Mengikuti sintaks/tahapan spesifik dari model pembelajaran yang dipilih.

Alur kurikulum yang harus dipahami agent: **CP → TP → ATP → Modul Ajar → Pembelajaran → Asesmen**.

---

## 2. Alur Kerja Agent

```
Guru submit form → Research (Search Grounding) → Generate (structured output) → Validasi → Editor
```

Langkah detail:

1. **Input guru.** Guru mengisi form: mata pelajaran, kelas/fase, bab/materi, model pembelajaran yang dipilih, serta identitas (nama, instansi, tahun ajaran).

2. **Konstruksi prompt riset.** Sistem membangun prompt untuk Research Agent dengan Search Grounding diaktifkan. Prompt meminta cakupan materi bab, CP yang relevan, dan konsep kunci.

3. **Riset via Gemini + Search Grounding.** Gemini mencari cakupan materi bab, menemukan CP resmi yang berlaku, dan mengumpulkan konteks materi dari sumber terpercaya.

4. **Konstruksi prompt generasi.** Sistem membangun prompt untuk Generator Agent yang berisi: hasil riset (langkah 3) + identitas guru + model pembelajaran beserta sintaksnya + instruksi format output JSON.

5. **Generasi modul.** Gemini menghasilkan modul ajar dalam format JSON terstruktur mengikuti 3 komponen resmi (Informasi Umum, Komponen Inti, Lampiran).

6. **Validasi output.** Sistem memvalidasi JSON terhadap skema. Cek kelengkapan field wajib (lihat bagian 7).

7. **Pengiriman ke editor.**
   - Output valid: dikirim ke TipTap editor, guru bisa langsung mengedit.
   - Output tidak valid: sistem melakukan retry (maks 2x). Jika tetap gagal, tampilkan bagian yang berhasil di-parse dengan warning pada bagian yang bermasalah.

---

## 3. System Prompt Design

Pedoman konstruksi system prompt untuk kedua fungsi agent.

### Prinsip

- Persona: asisten pembuatan modul ajar, ahli dalam Kurikulum Merdeka.
- Wajib mengikuti struktur resmi 3 komponen modul ajar.
- **Dilarang** mengarang Capaian Pembelajaran — hanya merujuk CP yang sudah ditetapkan pemerintah.
- Menyesuaikan bahasa dan kedalaman materi sesuai fase yang dipilih.
- Mengikuti sintaks/tahapan spesifik model pembelajaran yang dipilih (lihat daftar 6 model di bawah).
- Menyertakan sumber saat melaporkan hasil riset materi.
- Untuk Fase Fondasi (PAUD): gunakan terminologi "capaian perkembangan".

### 6 Model Pembelajaran yang Didukung

Setiap model memiliki sintaks dan tahapan berbeda yang harus diikuti dalam `kegiatan_pembelajaran`:

| Model | Karakteristik Utama |
|---|---|
| Problem-Based Learning (PBL) | Berakhir di solusi/ide, tidak harus menghasilkan produk jadi |
| Project-Based Learning (PjBL) | Melanjutkan sampai produk jadi (artefak konkret) |
| Discovery Learning | Stimulasi → identifikasi masalah → pengumpulan data → pengolahan data → verifikasi → generalisasi |
| Inquiry Learning | Orientasi → merumuskan masalah → merumuskan hipotesis → mengumpulkan data → menguji hipotesis → menyimpulkan |
| Cooperative Learning | Pembagian kelompok → diskusi → presentasi → evaluasi |
| CIRC | Pembentukan kelompok → pemberian wacana → diskusi → presentasi → refleksi |

Perbedaan kritis: PBL berakhir di solusi/ide, PjBL berlanjut sampai produk jadi. Prompt harus menjelaskan perbedaan ini agar output tidak tertukar.

### Skeleton Prompt

```
--- RESEARCH PROMPT ---
Kamu adalah asisten riset kurikulum Indonesia (Kurikulum Merdeka).

Mata pelajaran: {mata_pelajaran}
Fase: {fase}
Kelas: {kelas}
Bab/Materi: {judul_bab}

Tugas:
1. Cari cakupan materi untuk bab ini sesuai kurikulum resmi.
2. Identifikasi Capaian Pembelajaran (CP) yang relevan untuk fase dan mata pelajaran ini.
   [Jika Fase Fondasi: gunakan istilah "capaian perkembangan".]
3. Daftar konsep kunci dan sub-topik yang tercakup.
4. Sertakan sumber untuk setiap temuan.

Jangan mengarang CP. Jika tidak menemukan CP yang tepat, nyatakan keterbatasan.

--- GENERATION PROMPT ---
Kamu adalah asisten pembuatan modul ajar sesuai Kurikulum Merdeka.

## Konteks Riset
{hasil_riset_dari_research_agent}

## Identitas Modul
Penulis: {penulis}
Instansi: {instansi}
Tahun Ajaran: {tahun_ajaran}

## Parameter
Mata Pelajaran: {mata_pelajaran}
Fase: {fase}, Kelas: {kelas}
Model Pembelajaran: {model_pembelajaran}
Alokasi Waktu: {alokasi_waktu}

## Instruksi
1. Susun modul ajar dengan 3 komponen: Informasi Umum, Komponen Inti, Lampiran.
2. Ikuti sintaks model pembelajaran "{model_pembelajaran}" — tahapan: {tahapan_model}.
3. Sesuaikan bahasa dan kompleksitas dengan fase {fase}.
4. [Jika Fase Fondasi: gunakan "capaian perkembangan", bukan "capaian pembelajaran".]
5. Sertakan sumber dari hasil riset.

## Format Output
Kembalikan JSON sesuai skema berikut:
{json_schema}

Jangan tambahkan field di luar skema. Jika ada bagian yang tidak bisa diisi dengan yakin, isi dengan placeholder "[Perlu dilengkapi guru]".
```

---

## 4. Skema Output Terstruktur

JSON schema yang harus dikembalikan Gemini, dipetakan ke komponen resmi modul ajar.

```json
{
  "informasi_umum": {
    "penulis": "string — nama guru penulis modul",
    "instansi": "string — nama sekolah/lembaga",
    "tahun_ajaran": "string — contoh: '2024/2025'",
    "mata_pelajaran": "string — nama mata pelajaran",
    "fase": "string — fase kurikulum (Fondasi/A/B/C/D/E/F)",
    "kelas": "string — tingkat kelas",
    "alokasi_waktu": "string — total waktu, contoh: '4 x 35 menit (2 pertemuan)'",
    "kompetensi_awal": "string — prasyarat yang harus dimiliki peserta didik",
    "profil_pelajar_pancasila": ["string — dimensi P3 yang dikembangkan dalam modul ini"],
    "sarana_prasarana": "string — alat, bahan, media yang dibutuhkan",
    "target_peserta_didik": "string — deskripsi sasaran (reguler, berkebutuhan khusus, dll.)",
    "model_pembelajaran": "string — salah satu dari 6 model yang didukung"
  },
  "komponen_inti": {
    "tujuan_pembelajaran": ["string — TP yang diturunkan dari CP, bisa lebih dari satu"],
    "pemahaman_bermakna": "string — pemahaman mendalam yang ingin dicapai",
    "pertanyaan_pemantik": ["string — pertanyaan pembuka untuk memancing rasa ingin tahu"],
    "kegiatan_pembelajaran": [
      {
        "pertemuan": "number — nomor pertemuan (1, 2, dst.)",
        "kegiatan_awal": "string — apersepsi, motivasi, penyampaian tujuan",
        "kegiatan_inti": "string — aktivitas utama sesuai sintaks model pembelajaran",
        "kegiatan_penutup": "string — refleksi, kesimpulan, tindak lanjut"
      }
    ],
    "asesmen": {
      "jenis": "string — formatif/sumatif/diagnostik",
      "instrumen": "string — soal, rubrik, lembar observasi, dll.",
      "kunci_jawaban": "string — kunci atau pedoman penilaian"
    },
    "pengayaan_dan_remedial": "string — kegiatan untuk peserta didik yang sudah/belum tuntas",
    "refleksi": "string — pertanyaan refleksi untuk guru setelah pembelajaran"
  },
  "lampiran": {
    "lkpd": "string — Lembar Kerja Peserta Didik, instruksi dan soal latihan",
    "bahan_bacaan": "string — teks bacaan pendukung materi",
    "glosarium": "object — pasangan istilah:definisi, contoh: {\"fotosintesis\": \"proses ...\"}",
    "daftar_pustaka": ["string — sumber rujukan dalam format yang konsisten"]
  }
}
```

Catatan:
- Tidak semua komponen bersifat wajib. Guru dapat mengaktifkan/menonaktifkan bagian tertentu melalui form. Jika bagian dinonaktifkan, field tersebut tidak perlu diisi oleh AI dan bisa di-exclude dari prompt.
- `kegiatan_pembelajaran` adalah array karena satu modul bisa mencakup beberapa pertemuan.
- `kegiatan_inti` harus mencerminkan tahapan sintaks model pembelajaran yang dipilih.

---

## 5. Guardrail Konten

Batasan yang diterapkan pada semua output AI:

1. **Tidak boleh bertentangan dengan nilai-nilai pendidikan.** Konten harus sesuai norma dan etika pendidikan Indonesia.

2. **Wajib mencantumkan sumber.** Hasil riset materi harus menyertakan rujukan. Tidak boleh menyajikan informasi tanpa basis.

3. **Mengakui keterbatasan.** Jika AI tidak yakin tentang cakupan materi atau CP yang tepat, harus menyatakan keterbatasan secara eksplisit — bukan memfabrikasi konten. Gunakan placeholder `"[Perlu dilengkapi guru]"` untuk bagian yang tidak bisa diisi dengan yakin.

4. **Tidak ada konten sensitif secara politis** atau tidak pantas untuk konteks pendidikan.

5. **Kesesuaian usia.** Konten harus sesuai fase:
   - Fase Fondasi (PAUD): bahasa sederhana, aktivitas bermain, konkret.
   - Fase A-B (SD kelas 1-6): bahasa mudah dipahami, contoh dekat keseharian anak.
   - Fase C (SMP): mulai abstrak, penalaran dasar.
   - Fase D (SMP lanjut): penalaran lebih kompleks.
   - Fase E-F (SMA): bahasa formal, analisis kritis, literasi akademik.

---

## 6. Iterasi dan Regenerasi Parsial

Guru dapat meminta AI untuk me-regenerasi satu bagian saja tanpa membuat ulang seluruh modul.

### Mekanisme

1. Frontend mengirim ke backend:
   - `module_state`: seluruh JSON modul saat ini (termasuk hasil edit manual guru).
   - `section_to_regenerate`: path field yang ingin di-regenerasi, contoh: `"komponen_inti.asesmen"` atau `"lampiran.lkpd"`.
   - `instruction` (opsional): instruksi tambahan guru, contoh: "buat soal lebih sulit" atau "ganti ke asesmen formatif".

2. Sistem membangun prompt yang berisi:
   - Konteks modul lengkap (agar regenerasi konsisten dengan bagian lain).
   - Instruksi spesifik untuk hanya menghasilkan bagian yang diminta.
   - Instruksi tambahan guru jika ada.

3. Gemini mengembalikan hanya field yang diminta.

4. Sistem melakukan merge: field yang di-regenerasi menggantikan field lama, bagian lain tetap utuh.

Ini menghindari pemborosan token dan menjaga hasil edit manual guru di bagian lain.

---

## 7. Validasi Kualitas Output

Checklist yang dijalankan sebelum output ditandai "siap edit" dan dikirim ke TipTap editor.

### Checklist Wajib

| No | Validasi | Aksi jika gagal |
|----|----------|-----------------|
| 1 | Ada `tujuan_pembelajaran` (minimal 1 item) | Reject, retry |
| 2 | Ada `kegiatan_pembelajaran` dengan `kegiatan_awal`, `kegiatan_inti`, `kegiatan_penutup` di setiap pertemuan | Reject, retry |
| 3 | Ada `asesmen` dengan `jenis` dan `instrumen` terisi | Reject, retry |
| 4 | Sintaks model pembelajaran sesuai model yang dipilih (misal: PjBL harus ada tahap produk, PBL boleh berhenti di solusi) | Warning, tampilkan dengan catatan |
| 5 | Bahasa dan kompleksitas sesuai fase (Fase Fondasi tidak boleh pakai bahasa akademik formal) | Warning, tampilkan dengan catatan |
| 6 | JSON valid dan sesuai skema | Reject, retry (maks 2x) |
| 7 | Tidak ada field wajib yang kosong atau hanya berisi whitespace | Reject, retry |

### Alur Validasi

```
Output Gemini → Parse JSON → Cek skema → Cek checklist wajib
  → Semua lolos: kirim ke editor
  → Ada reject: retry (maks 2x), lalu fallback tampilkan parsial + warning
  → Ada warning saja: kirim ke editor dengan catatan di UI
```

Validasi nomor 1-3 dan 6-7 bersifat otomatis (bisa dicek secara programatik). Validasi nomor 4-5 memerlukan heuristik atau pengecekan keyword — implementasi awal bisa berupa pencocokan kata kunci tahapan model pembelajaran terhadap isi `kegiatan_inti`.

---

Rujukan silang: ARSITEKTUR.md (integrasi teknis Gemini), SCHEMA.md (tabel ai_generation_logs), SECURITY.md (guardrail API), RULES.md (batasan konten AI).
