# PRD — Modulin

> Dokumen ini ditulis dalam Bahasa Indonesia untuk narasi, English untuk istilah teknis.
> Terakhir diperbarui: September 2026.

---

## 1. Ringkasan Eksekutif

Kurikulum Merdeka mewajibkan setiap guru menyusun modul ajar sebagai perangkat utama pembelajaran. Modul ajar bukan sekadar RPP lama yang diganti nama — strukturnya terdiri dari tiga komponen (Informasi Umum, Komponen Inti, Lampiran) dan harus mengacu pada Capaian Pembelajaran (CP) resmi per fase. Kenyataannya, mayoritas guru menyalin modul dari internet tanpa mengadaptasi ke konteks kelas mereka: karakteristik peserta didik, sarana prasarana sekolah, dan model pembelajaran yang sesuai dengan materi bab.

Modulin adalah web app yang membantu guru menyusun draf modul ajar lengkap dalam hitungan menit. Guru mengisi identitas modul (nama, instansi, mata pelajaran, jenjang/kelas, bab, tahun ajaran), memilih model pembelajaran, lalu AI melakukan riset materi bab menggunakan Google Search Grounding dan menghasilkan draf modul sesuai struktur resmi Kurikulum Merdeka. Guru meninjau dan mengedit draf di rich text editor, kemudian mengekspor sebagai PDF atau Word.

Produk ini bukan platform belajar siswa, bukan LMS, dan bukan bank soal. Target pengguna tunggal adalah guru — dari jenjang PAUD/TK hingga SMA/SMK — yang membutuhkan alat untuk mempercepat produksi dokumen pedagogis tanpa mengorbankan kualitas kontekstual.

---

## 2. Latar Belakang & Masalah

### Beban administratif yang tidak proporsional

Guru di Indonesia tidak hanya mengajar. Mereka menyusun modul ajar, menyusun ATP (Alur Tujuan Pembelajaran), mengisi rapor, melakukan asesmen diagnostik, dan mengelola administrasi kelas. Penyusunan satu modul ajar yang baik memakan waktu 3-6 jam per bab, belum termasuk revisi. Guru yang mengampu beberapa kelas dan beberapa mata pelajaran (umum di SD dan SMP) menghadapi beban yang berlipat.

### Modul copy-paste tanpa konteks

Solusi de facto saat ini: guru mengunduh modul ajar dari internet (blog guru, grup Telegram, marketplace RPP) dan menggunakannya langsung atau mengubah identitas saja. Modul ini tidak mencerminkan kondisi nyata kelas — karakteristik peserta didik berbeda, sarana sekolah berbeda, dan model pembelajaran yang digunakan sering tidak cocok dengan materi bab. Supervisor dan pengawas sekolah semakin ketat memeriksa kualitas modul ajar sebagai bagian dari akreditasi.

### Guru baru dan transisi kurikulum

Guru yang baru mengajar atau yang baru bertransisi dari Kurikulum 2013 ke Kurikulum Merdeka sering kesulitan memahami perbedaan struktur: CP menggantikan KI/KD, fase menggantikan kelas dalam pengelompokan capaian, dan modul ajar memiliki komponen yang berbeda dari RPP konvensional. Alur CP -> TP -> ATP -> Modul Ajar -> Pembelajaran -> Asesmen belum terinternalisasi.

### Perbedaan semantik antar jenjang

Jenjang PAUD (Fase Fondasi) menggunakan terminologi "capaian perkembangan" dan enam dimensi Profil Pelajar Pancasila yang berbeda penerapannya dari jenjang SD-SMA yang menggunakan "capaian pembelajaran". Guru PAUD memerlukan modul yang mengakomodasi bermain-belajar, bukan instruksi akademis formal.

---

## 3. Tujuan Produk

| # | Tujuan | Indikator | Target |
|---|--------|-----------|--------|
| 1 | Mempercepat penyusunan modul ajar | Waktu rata-rata dari mulai input hingga export selesai | < 30 menit (dari baseline 3-6 jam manual) |
| 2 | Meningkatkan kualitas kontekstual modul | Persentase modul yang mengandung adaptasi konteks (karakteristik peserta didik, sarana, model pembelajaran spesifik) vs copy-paste generik | > 80% modul yang di-generate mengandung minimal 3 elemen kontekstual |
| 3 | Menurunkan hambatan adopsi Kurikulum Merdeka | Completion rate: guru yang memulai input hingga menghasilkan modul final | > 70% completion rate |
| 4 | Menyediakan draf yang secara struktural valid | Modul yang di-generate mengikuti 3 komponen resmi (Informasi Umum, Komponen Inti, Lampiran) | 100% structural compliance |

---

## 4. Non-Goals

Hal-hal berikut **secara sengaja** tidak termasuk dalam scope Modulin:

- **Bukan platform belajar siswa.** Tidak ada fitur untuk siswa mengakses materi, mengerjakan soal, atau berinteraksi dengan konten. Ini bukan Ruangguru, Quipper, atau Zenius.
- **Bukan LMS (Learning Management System).** Tidak ada fitur manajemen kelas, penugasan ke siswa, atau pelacakan progres belajar. Ini bukan Google Classroom.
- **Bukan pengganti keputusan pedagogis guru.** AI menghasilkan draf; guru wajib meninjau, mengedit, dan memvalidasi sebelum digunakan. Modulin tidak mengklaim bahwa output AI siap pakai tanpa review.
- **Bukan alat asesmen siswa.** Tidak ada fitur pembuatan bank soal, penilaian otomatis, atau analisis hasil belajar siswa.
- **Bukan generator ATP otomatis (pada MVP).** ATP builder masuk roadmap, bukan MVP. MVP fokus pada unit modul ajar per bab.

---

## 5. Target Pengguna & Persona

### Persona 1: Pak Andi — Guru Matematika SMP

| Atribut | Detail |
|---------|--------|
| Jenjang | SMP (Fase D, Kelas 7-9) |
| Mata pelajaran | Matematika |
| Pengalaman mengajar | 8 tahun, transisi dari Kurikulum 2013 ke Kurikulum Merdeka sejak 2022 |
| Keterampilan teknologi | Familiar — menggunakan Google Workspace, WhatsApp, browsing rutin |
| Beban | Mengajar 5 kelas (7A, 7B, 8A, 8B, 9A), masing-masing butuh modul per bab |
| Pain utama | Waktu habis untuk menyusun modul secara repetitif; sering copy-paste dari internet dan hanya mengganti identitas. Khawatir kualitas modul diperiksa pengawas saat akreditasi. |
| Harapan | Draf modul yang sudah sesuai struktur Kurikulum Merdeka, tinggal edit bagian yang perlu disesuaikan dengan kondisi kelas spesifik. |
| Konteks penggunaan | Di rumah setelah jam mengajar, menggunakan laptop, koneksi internet stabil. |

### Persona 2: Bu Sari — Guru PAUD

| Atribut | Detail |
|---------|--------|
| Jenjang | PAUD/TK (Fase Fondasi) |
| Fokus | Kelompok B (usia 5-6 tahun), semua area perkembangan |
| Pengalaman mengajar | 12 tahun, terbiasa dengan kurikulum lama, baru mengadopsi Kurikulum Merdeka |
| Keterampilan teknologi | Dasar — bisa menggunakan HP dan WhatsApp, laptop terbatas pada Word dan browsing sederhana |
| Pain utama | Bingung membedakan "capaian perkembangan" (Fase Fondasi) dengan "capaian pembelajaran" (fase lain). Modul PAUD harus berbasis bermain-belajar, bukan instruksi akademis. Template yang tersedia di internet umumnya untuk SD/SMP. |
| Harapan | Antarmuka yang sederhana, tidak banyak langkah, bahasa yang mudah dipahami. Modul yang dihasilkan sudah menggunakan terminologi PAUD yang benar. |
| Konteks penggunaan | Di sekolah menggunakan HP atau laptop sekolah, koneksi internet kadang tidak stabil. |

---

## 6. Value Proposition Canvas

### Sisi Customer

| Komponen | Detail |
|----------|--------|
| **Customer Jobs** | Menyusun modul ajar per bab sesuai struktur Kurikulum Merdeka; Mengadaptasi materi ke konteks kelas (karakteristik peserta didik, sarana sekolah); Memilih model pembelajaran yang sesuai materi; Menyiapkan dokumen untuk akreditasi dan supervisi |
| **Pains** | Waktu penyusunan 3-6 jam per modul; Struktur modul ajar Kurikulum Merdeka yang belum familiar; Modul copy-paste tidak lolos review pengawas; Perbedaan terminologi antar jenjang (capaian perkembangan vs capaian pembelajaran); Tidak tahu model pembelajaran mana yang cocok untuk materi tertentu |
| **Gains** | Modul yang strukturnya sudah benar tanpa harus menghafal format; Waktu untuk mengajar dan berinteraksi dengan siswa lebih banyak; Percaya diri saat supervisi karena modul kontekstual; Pemahaman model pembelajaran bertambah dari penjelasan di aplikasi |

### Sisi Product

| Komponen | Detail |
|----------|--------|
| **Pain Relievers** | AI generate draf lengkap dalam menit, bukan jam; Struktur 3 komponen (Informasi Umum, Komponen Inti, Lampiran) otomatis terbentuk; Fase otomatis terisi berdasarkan jenjang/kelas; Penjelasan tiap model pembelajaran ditampilkan saat pemilihan, membantu guru memilih yang tepat |
| **Gain Creators** | Search Grounding memastikan materi bab faktual dan terkini; Rich text editor memungkinkan editing langsung tanpa pindah aplikasi; Export PDF/Word siap cetak dan siap kumpulkan; Riwayat modul tersimpan, bisa direvisi kapan saja |
| **Products & Services** | Form input identitas modul; Pemilihan model pembelajaran dengan penjelasan; AI riset + generate modul; TipTap rich text editor; Export PDF dan Word; Riwayat modul per guru |

---

## 7. Fitur MVP

Fitur diurutkan sesuai alur penggunaan (user flow).

### 7.1 Pemilihan Model Pembelajaran

Guru memilih satu dari enam model pembelajaran yang didukung. Setiap model menampilkan penjelasan singkat dan kapan model tersebut cocok digunakan:

| Model | Karakteristik | Hasil akhir |
|-------|---------------|-------------|
| **PBL** (Problem-Based Learning) | Pembelajaran dimulai dari masalah nyata; peserta didik menganalisis, meneliti, dan merumuskan solusi | Berhenti di solusi/ide — tidak menghasilkan produk fisik |
| **PjBL** (Project-Based Learning) | Pembelajaran berbasis proyek; peserta didik merancang, membuat, dan mempresentasikan produk | Menghasilkan produk nyata (artefak, presentasi, prototipe) |
| **Discovery Learning** (DL) | Guru membimbing peserta didik menemukan konsep melalui eksplorasi terarah | Pemahaman konsep melalui penemuan terbimbing |
| **Inquiry Learning** (IL) | Peserta didik merumuskan pertanyaan, merancang investigasi, dan menyimpulkan | Jawaban atas pertanyaan penelitian melalui investigasi |
| **Cooperative Learning** | Pembelajaran dalam kelompok kecil dengan peran dan tanggung jawab individual | Hasil kerja kelompok dengan akuntabilitas individu |
| **CIRC** (Cooperative Integrated Reading and Composition) | Kooperatif berbasis membaca-menulis; umum untuk mata pelajaran bahasa | Produk literasi (ringkasan, karangan, analisis teks) |

Perbedaan PBL vs PjBL harus eksplisit di UI: PBL berhenti di solusi/ide, PjBL berlanjut hingga produk jadi.

### 7.2 Form Identitas Modul

Guru mengisi data identitas yang menjadi konteks bagi AI:

| Field | Tipe | Keterangan |
|-------|------|------------|
| Nama guru | Text input | |
| Nama instansi / sekolah | Text input | |
| Mata pelajaran | Dropdown / text | [KEPUTUSAN DIPERLUKAN: apakah menggunakan daftar mapel resmi per jenjang atau free text?] |
| Jenjang | Dropdown | PAUD/TK, SD, SMP, SMA/SMK |
| Kelas | Dropdown (filtered by jenjang) | |
| Fase | Auto-fill | Ditentukan otomatis berdasarkan jenjang dan kelas: Fondasi=PAUD, A=SD 1-2, B=SD 3-4, C=SD 5-6, D=SMP 7-9, E=SMA 10, F=SMA 11-12 |
| Bab / topik | Text input | Judul bab atau topik yang akan diajarkan |
| Tahun ajaran | Dropdown / text | Format: 2026/2027 |

Ketika jenjang PAUD/TK dipilih, label dan terminologi form berubah: "Capaian Perkembangan" menggantikan "Capaian Pembelajaran", dan struktur modul menyesuaikan pendekatan bermain-belajar.

### 7.3 AI Riset & Generate

Setelah form terisi dan model pembelajaran dipilih, guru menekan tombol generate. Proses:

1. **Search Grounding** — Gemini 2.0 Flash dengan Google Search Grounding melakukan riset materi bab: mencari scope materi, konsep kunci, dan referensi faktual terkini.
2. **Penyusunan draf** — AI menyusun modul ajar lengkap mengikuti tiga komponen:
   - **Informasi Umum**: identitas modul, kompetensi awal, profil Pelajar Pancasila, sarana prasarana, target peserta didik, model pembelajaran.
   - **Komponen Inti**: tujuan pembelajaran (TP), pemahaman bermakna, pertanyaan pemantik, kegiatan pembelajaran (pendahuluan-inti-penutup sesuai model yang dipilih), asesmen, pengayaan dan remedial.
   - **Lampiran**: LKPD (Lembar Kerja Peserta Didik), bahan bacaan, glosarium, daftar pustaka.
3. **Streaming** — Output ditampilkan secara streaming (Vercel AI SDK) agar guru melihat progres real-time.

[KEPUTUSAN DIPERLUKAN: batas maksimal token output per generate dan strategi chunking jika modul sangat panjang.]

### 7.4 Rich Text Editor (TipTap)

Draf AI ditampilkan dalam TipTap editor dengan kemampuan:

- Format teks dasar (bold, italic, heading, list)
- Tabel (untuk rubrik asesmen, jadwal kegiatan)
- Undo/redo
- Struktur heading yang mengikuti komponen modul ajar

Guru mengedit, menambah, atau menghapus bagian sesuai kebutuhan. Perubahan tersimpan otomatis.

[KEPUTUSAN DIPERLUKAN: autosave interval atau save-on-change. Pertimbangan: koneksi internet tidak stabil di beberapa sekolah.]

### 7.5 Export PDF dan Word

Guru mengekspor modul final dalam dua format:

- **PDF** — Menggunakan html2pdf.js atau Puppeteer (server-side). Layout siap cetak dengan header identitas modul.
- **Word (.docx)** — Menggunakan library docx. Format yang bisa diedit lebih lanjut di Microsoft Word, karena banyak sekolah masih memerlukan file Word untuk arsip.

[KEPUTUSAN DIPERLUKAN: apakah PDF generation dilakukan client-side (html2pdf.js — sudah terinstall) atau server-side (Puppeteer — kontrol layout lebih baik tapi butuh serverless function).]

### 7.6 Riwayat Modul per Guru

Setiap modul yang di-generate tersimpan di Supabase dan terhubung ke akun guru. Guru dapat:

- Melihat daftar modul sebelumnya
- Membuka dan melanjutkan editing
- Menduplikasi modul untuk diadaptasi ke kelas lain
- Menghapus modul yang tidak diperlukan

---

## 8. Fitur Non-MVP / Roadmap

| Prioritas | Fitur | Deskripsi |
|-----------|-------|-----------|
| P1 | **ATP Builder** | Generator Alur Tujuan Pembelajaran (ATP) per semester. Posisi dalam alur: CP -> TP -> **ATP** -> Modul Ajar. ATP menjadi kerangka yang menghubungkan seluruh modul dalam satu semester. |
| P2 | **Bank Modul** | Guru dapat mempublikasikan modul ke bank bersama. Guru lain dapat menggunakan sebagai template awal. Filter berdasarkan jenjang, mapel, dan model pembelajaran. |
| P2 | **Template Library** | Kumpulan template modul ajar per jenjang dan model pembelajaran yang sudah divalidasi. Bukan hasil AI — melainkan template yang di-review oleh praktisi. |
| P3 | **Kolaborasi Tim** | Guru dalam satu sekolah/gugus dapat bekerja bersama pada satu modul. Real-time collaboration menggunakan Yjs + TipTap. |
| P3 | **Integrasi CP Resmi** | Database Capaian Pembelajaran resmi dari Kemendikbudristek yang ter-update. Auto-suggest CP berdasarkan mapel dan fase. |

---

## 9. User Stories

| # | Story |
|---|-------|
| 1 | Sebagai guru, saya ingin memilih model pembelajaran dan melihat penjelasan singkat tiap model, agar saya bisa memilih model yang paling sesuai dengan materi bab saya. |
| 2 | Sebagai guru, saya ingin mengisi identitas modul (nama, sekolah, mapel, jenjang, kelas, bab, tahun ajaran) dan fase terisi otomatis, agar saya tidak perlu menghafal pemetaan fase. |
| 3 | Sebagai guru, saya ingin AI meneliti materi bab saya dan menghasilkan draf modul ajar lengkap sesuai struktur Kurikulum Merdeka, agar saya memiliki titik awal yang berkualitas tanpa mulai dari nol. |
| 4 | Sebagai guru, saya ingin mengedit draf AI di editor langsung di aplikasi, agar saya bisa menyesuaikan konten dengan konteks kelas saya tanpa pindah ke aplikasi lain. |
| 5 | Sebagai guru, saya ingin mengekspor modul sebagai PDF atau Word, agar saya bisa mencetak atau menyerahkan file ke kepala sekolah sesuai format yang diminta. |
| 6 | Sebagai guru, saya ingin melihat riwayat modul yang pernah saya buat, agar saya bisa membuka, mengedit, atau menduplikasi modul sebelumnya. |
| 7 | Sebagai guru PAUD, saya ingin aplikasi menggunakan terminologi "capaian perkembangan" dan pendekatan bermain-belajar saat jenjang PAUD dipilih, agar modul yang dihasilkan sesuai dengan Fase Fondasi. |

---

## 10. Metrik Keberhasilan

| Metrik | Definisi | Target MVP |
|--------|----------|------------|
| **Waktu pembuatan modul** | Durasi rata-rata dari klik "Generate" hingga klik "Export" (termasuk editing) | < 30 menit |
| **Modul per guru per bulan** | Jumlah modul yang berhasil di-export per guru aktif per bulan | >= 4 |
| **Completion rate** | Persentase sesi yang dimulai (klik Generate) dan berakhir dengan Export | > 70% |
| **Edit ratio** | Persentase konten AI yang diubah oleh guru sebelum export | 20-60% (terlalu rendah = guru tidak review; terlalu tinggi = AI output buruk) |
| **Skor kualitas kontekstual** | Evaluasi sampling: modul Modulin vs modul copy-paste internet, dinilai berdasarkan kehadiran elemen kontekstual (karakteristik peserta didik, sarana, adaptasi model pembelajaran) | Modulin > internet copy pada 3 dari 3 elemen |
| **Retensi mingguan** | Persentase guru yang kembali menggunakan Modulin dalam 7 hari setelah penggunaan pertama | > 40% |

---

## 11. Asumsi & Risiko

### Asumsi

| # | Asumsi |
|---|--------|
| A1 | Guru bersedia menggunakan web app (bukan hanya WhatsApp/Telegram) untuk menyusun modul ajar. |
| A2 | Gemini 2.0 Flash dengan Search Grounding mampu menghasilkan konten materi bab yang faktual dan relevan untuk konteks kurikulum Indonesia. |
| A3 | Guru akan meninjau dan mengedit output AI sebelum menggunakan di kelas. |
| A4 | Koneksi internet tersedia saat penggunaan (aplikasi web, bukan offline-first). |
| A5 | Struktur modul ajar Kurikulum Merdeka (3 komponen) tidak berubah secara substansial dalam 1-2 tahun ke depan. |

### Risiko

| # | Risiko | Dampak | Mitigasi |
|---|--------|--------|----------|
| R1 | **Kualitas Search Grounding tidak konsisten.** AI menghasilkan materi yang tidak akurat atau tidak relevan dengan bab yang dimaksud. | Tinggi — guru kehilangan kepercayaan, modul salah digunakan di kelas. | Tampilkan sumber referensi yang digunakan AI. Beri peringatan eksplisit bahwa draf harus di-review. Monitoring sampling kualitas output. |
| R2 | **Guru tidak me-review output AI.** Guru langsung export tanpa editing, modul mengandung kesalahan. | Tinggi — reputasi produk dan dampak ke pembelajaran siswa. | Tracking edit ratio sebagai health metric. Jika edit ratio < 5%, tampilkan reminder. [KEPUTUSAN DIPERLUKAN: apakah perlu mandatory review step sebelum export?] |
| R3 | **Biaya API Gemini meningkat seiring skala pengguna.** Cost per generate signifikan jika ribuan guru menggunakan setiap hari. | Sedang — margin negatif jika tidak ada monetisasi. | Monitoring cost per module. Rate limiting per akun. [KEPUTUSAN DIPERLUKAN: model monetisasi — freemium dengan batas generate per bulan, atau fully free dengan revenue dari institusi?] |
| R4 | **Perubahan kebijakan kurikulum.** Kemendikbudristek mengubah struktur modul ajar atau Capaian Pembelajaran. | Sedang — memerlukan update prompt dan validasi. | Arsitektur prompt yang modular, mudah di-update. Monitoring berita kebijakan kurikulum. |
| R5 | **Adopsi rendah di guru dengan literasi digital terbatas.** Terutama guru PAUD dan guru di daerah. | Sedang — segmen pengguna terbatas. | UI minimal, langkah sedikit, bahasa sederhana. Pertimbangkan video tutorial WhatsApp-friendly. |

---

## 12. Dependensi Eksternal

| Dependensi | Fungsi | Risiko jika tidak tersedia |
|------------|--------|---------------------------|
| **Gemini 2.0 Flash API** (Google AI) | Model AI untuk riset materi (Search Grounding) dan generate modul | Fitur inti tidak berfungsi. Tidak ada fallback model di MVP. [KEPUTUSAN DIPERLUKAN: apakah perlu fallback ke model lain?] |
| **Google Search Grounding** | Riset materi bab secara real-time dari web | AI generate tetap berjalan tapi tanpa riset materi terkini — kualitas menurun |
| **Sumber Capaian Pembelajaran resmi** | Referensi CP/capaian perkembangan per fase dan mapel dari Kemendikbudristek | AI mungkin menghasilkan TP yang tidak sesuai CP resmi. Perlu database CP internal sebagai fallback. |
| **Supabase** | Autentikasi, database (riwayat modul, data guru), storage | Aplikasi tidak bisa menyimpan data. Uptime SLA Supabase: 99.9%. |
| **Vercel** | Hosting, serverless functions, edge runtime | Aplikasi tidak bisa diakses. Uptime SLA Vercel: 99.99%. |
| **Library export** (html2pdf.js / docx) | Generate file PDF dan Word dari konten editor | Fitur export tidak berfungsi, tapi guru masih bisa copy-paste dari editor. |

---

## Pemetaan Fase Kurikulum Merdeka (Referensi)

| Fase | Jenjang | Kelas |
|------|---------|-------|
| Fondasi | PAUD/TK | - |
| A | SD | 1-2 |
| B | SD | 3-4 |
| C | SD | 5-6 |
| D | SMP | 7-9 |
| E | SMA/SMK | 10 |
| F | SMA/SMK | 11-12 |

## Alur Kurikulum Merdeka (Referensi)

```
CP (Capaian Pembelajaran) → TP (Tujuan Pembelajaran) → ATP (Alur Tujuan Pembelajaran) → Modul Ajar → Pembelajaran → Asesmen
```

---

Rujukan silang: ARSITEKTUR.md (detail teknis), AGENT.md (desain AI), RULES.md (batasan scope), USERFLOW.md (alur penggunaan).
