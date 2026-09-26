# ALUR OUTPUT AI & EXPORT PIPELINE — MODULIN

> Dokumen spesifikasi teknis alur data dari Input Guru ➔ Generasi AI ➔ Data Terstruktur (JSON) ➔ Editor TipTap ➔ Ekspor (.docx & .pdf).
> Terakhir diperbarui: September 2026.

---

## 1. Diagram Alur Utama (End-to-End Pipeline)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│   User Input    │ ──► │  Gemini 3.8 AI   │ ──► │   Structured Data   │ ──► │ TipTap Live Edit  │
│  (Form /create) │     │ (Search Ground)  │     │       (JSON)        │     │  & Review Guru    │
└─────────────────┘     └──────────────────┘     └─────────────────────┘     └─────────┬─────────┘
                                                                                       │
                                                                   ┌───────────────────┴───────────────────┐
                                                                   ▼                                       ▼
                                                          ┌───────────────────┐                   ┌─────────────────┐
                                                          │   Ekspor .docx    │                   │   Ekspor .pdf   │
                                                          │ (library `docx`)  │                   │ (`@react-pdf`)  │
                                                          └───────────────────┘                   └─────────────────┘
```

Alur dibagi menjadi 4 tahap utama:
1. **Tahap 1: User Input ➔ AI Request** (`POST /api/modules/generate`)
2. **Tahap 2: AI Generation ➔ Structured JSON Validation** (Zod Schema Validation)
3. **Tahap 3: Hydration ke TipTap Editor** (Dual state: JSON terstruktur + HTML preview untuk editing)
4. **Tahap 4: Ekspor Dokumen Resmi** (DOCX via `docx` + PDF via `@react-pdf/renderer`)

---

## 2. Tahap 1: User Input Payload (Form `/create`)

Frontend mengirimkan data identitas dan model pembelajaran:

```json
{
  "namaGuru": "Ahmad Faozan, S.Pd.I",
  "instansi": "SMK Mabdaul Falah Al-Hasyimi",
  "mataPelajaran": "Bahasa Inggris",
  "jenjang": "SMK",
  "kelas": "X",
  "fase": "E",
  "tahunAjaran": "2026/2027",
  "bab": "Great Athletes",
  "topik": "Descriptive Text about Inspiring Athletes",
  "modelPembelajaran": "PjBL",
  "alokasiWaktu": "2 x 45 menit (1 Pertemuan)"
}
```

> **Catatan Validasi Fase Otomatis:**
> - Jika jenjang PAUD/TK: `fase` otomatis `"Fondasi"`, dan istilah `Capaian Pembelajaran (CP)` beralih menjadi `Capaian Perkembangan`.
> - SD Kelas 1-2: Fase A | Kelas 3-4: Fase B | Kelas 5-6: Fase C
> - SMP Kelas 7-9: Fase D
> - SMA/SMK Kelas 10: Fase E | Kelas 11-12: Fase F

---

## 3. Tahap 2: AI Output (Gemini) ➔ Structured JSON Data

AI Gemini diinstruksikan menghasilkan **JSON terstruktur murni** (bukan string HTML mentah) yang memetakan ke 10 komponen acuan resmi Modul Ajar:

```json
{
  "informasiUmum": {
    "namaPenyusun": "Ahmad Faozan, S.Pd.I",
    "namaInstitusi": "SMK Mabdaul Falah Al-Hasyimi",
    "tahunPenyusunan": "2026",
    "jenjangSekolah": "SMK",
    "fase": "E",
    "kelas": "X (Sepuluh)",
    "alokasiWaktu": "2 x 45 menit (1 Pertemuan)"
  },
  "tujuanPembelajaran": {
    "faseCP": "Pada akhir Fase E, peserta didik menggunakan teks lisan, tulisan, dan visual dalam bahasa Inggris untuk berkomunikasi sesuai dengan situasi, tujuan, dan pemirsa/pembacanya...",
    "elemenCP": [
      "Menyimak-Berbicara (Listening-Speaking)",
      "Membaca-Memirsa (Reading-Viewing)",
      "Menulis-Mempresentasikan (Writing-Presenting)"
    ],
    "tujuan": [
      "Mengidentifikasi konteks, gagasan utama, dan informasi terperinci dari teks deskripsi lisan multimoda tentang atlet berprestasi.",
      "Memproduksi teks deskriptif tulis multimoda tentang great athletes sesuai konteks dan tujuan.",
      "Mendemonstrasikan komunikasi efektif dalam menyampaikan gagasan dan pendapat sederhana tentang atlet berprestasi."
    ],
    "pertanyaanPemantik": [
      "Do you like sports? What kind of sport do you like?",
      "Who is your favourite athlete and why does this person inspire you?",
      "What qualities make someone a great world champion?"
    ],
    "lingkunganBelajar": "Kondisional: Ruang kelas (indoor) dan area sekolah (outdoor)"
  },
  "profilPelajarPancasila": [
    "Beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia",
    "Mandiri",
    "Bernalar Kritis",
    "Kreatif",
    "Gotong Royong"
  ],
  "materiAlatBahan": {
    "materiUtama": "Descriptive Text: Great Athletes (Vocabulary, Language Features, and Text Structure)",
    "sumberBelajar": [
      "Budi Hermawan, dkk. Bahasa Inggris: Work in Progress untuk SMA/SMK Kelas X, Kemendikbudristek 2022.",
      "Artikel dan video profil atlet berprestasi dunia."
    ],
    "fasilitas": [
      "Laptop / Komputer",
      "LCD Proyektor & Speaker",
      "Papan tulis, spidol, penghapus",
      "Lembar Aktivitas Siswa (LKPD)",
      "Lembar Refleksi"
    ]
  },
  "modelPembelajaran": {
    "namaModel": "Project-Based Learning (PjBL)",
    "kodeModel": "pjbl",
    "fokus": "Pemecahan masalah nyata yang menghasilkan produk nyata (artefak konkret/poster/esai).",
    "metode": ["Tanya Jawab", "Diskusi Kelompok Terarah", "Eksplorasi Multimoda", "Presentasi Proyek"]
  },
  "kegiatanPembelajaran": {
    "pendahuluan": [
      "Guru membuka pelajaran dengan salam hangat dan memimpin doa.",
      "Guru memeriksa kehadiran siswa dan mengondisikan kesiapan kelas.",
      "Apersepsi: Guru menampilkan siluet/foto atlet berprestasi dan mengajukan pertanyaan pemantik.",
      "Guru menyampaikan tujuan pembelajaran dan penilaian yang akan dilakukan."
    ],
    "inti": [
      {
        "tahapSintaks": "Fase 1: Penentuan Pertanyaan Mendasar",
        "aktivitasGuru": "Guru menayangkan video biografi singkat atlet dan memicu pertanyaan esensial pembuatan profil inspiratif.",
        "aktivitasSiswa": "Siswa mengamati video, mencatat poin kunci, dan memilih figur atlet yang akan dipelajari."
      },
      {
        "tahapSintaks": "Fase 2: Perencanaan Proyek",
        "aktivitasGuru": "Guru mengorganisasi siswa ke dalam kelompok kecil (4-5 orang) dan membagikan LKPD proyek.",
        "aktivitasSiswa": "Kelompok merancang struktur esai deskriptif dan poster infografis atlet pilihan."
      },
      {
        "tahapSintaks": "Fase 3: Penyusunan Jadwal & Monitoring",
        "aktivitasGuru": "Guru memfasilitasi pembuatan timeline pengerjaan dan membimbing penyusunan draf teks deskriptif.",
        "aktivitasSiswa": "Kelompok menyusun draf teks dengan memperhatikan struktur umum dan unsur kebahasaan."
      },
      {
        "tahapSintaks": "Fase 4: Pengujian Hasil (Presentasi)",
        "aktivitasGuru": "Guru memfasilitasi sesi presentasi kelompok dan mengatur sesi umpan balik antarteman.",
        "aktivitasSiswa": "Kelompok mempresentasikan karya teks deskriptif dan menanggapi pertanyaan kelompok lain."
      },
      {
        "tahapSintaks": "Fase 5: Evaluasi & Refleksi",
        "aktivitasGuru": "Guru memberikan apresiasi, penguatan materi, serta klarifikasi terhadap konsep bahasa.",
        "aktivitasSiswa": "Siswa menarik kesimpulan dari umpan balik yang diterima untuk perbaikan akhir."
      }
    ],
    "penutup": [
      "Guru bersama siswa menyimpulkan poin-poin penting materi pembelajaran hari ini.",
      "Siswa mengisi lembar refleksi singkat mengenai pengalaman belajar.",
      "Guru menginformasikan rencana kegiatan untuk pertemuan berikutnya.",
      "Pembelajaran ditutup dengan doa bersama dan salam penutup."
    ]
  },
  "asesmen": {
    "targetPenilaian": "Individu dan Kelompok",
    "jenisAsesmen": ["Formatif (Observasi unjuk kerja)", "Sumatif (Hasil karya teks deskriptif)"],
    "kriteriaKetercapaian": "Peserta didik mampu mengidentifikasi ide pokok serta memproduksi teks deskriptif minimal 150 kata dengan struktur yang tepat.",
    "caraPenilaian": "Rubrik performa presentasi dan lembar ceklis penulisan teks",
    "rubrik": [
      { "aspek": "Struktur Teks", "skorMaks": 25, "kriteria": "Terdapat Identification dan Description yang runtut." },
      { "aspek": "Tata Bahasa & Kosakata", "skorMaks": 25, "kriteria": "Penggunaan Simple Present Tense dan Adjectives tepat." },
      { "aspek": "Kreativitas & Presentasi", "skorMaks": 25, "kriteria": "Penyajian menarik dan komunikatif." },
      { "aspek": "Kolaborasi Kelompok", "skorMaks": 25, "kriteria": "Partisipasi aktif seluruh anggota tim." }
    ]
  },
  "refleksi": {
    "refleksiGuru": [
      "Apakah alokasi waktu yang dirancang mencukupi seluruh tahapan proyek?",
      "Bagian mana dari kegiatan yang paling efektif membantu siswa memahami materi?",
      "Kendala apa yang muncul saat pendampingan kelompok dan bagaimana solusinya?",
      "Apa langkah penyesuaian yang perlu disiapkan untuk pertemuan berikutnya?"
    ],
    "refleksiSiswa": [
      "Apa hal baru dan paling menarik yang kamu pelajari hari ini?",
      "Kesulitan apa yang kamu rasakan saat menyusun teks deskriptif dalam kelompok?",
      "Bagaimana perasaanmu setelah berhasil mempresentasikan hasil karyamu?",
      "Langkah apa yang akan kamu lakukan untuk memperbaiki kemampuan bahasamu?"
    ]
  },
  "daftarPustaka": [
    "Hermawan, Budi, dkk. 2022. Bahasa Inggris: Work in Progress untuk SMA/SMK/MA Kelas X. Jakarta: Pusat Perbukuan BSKAP Kemendikbudristek.",
    "Badan Standar, Kurikulum, dan Asesmen Pendidikan. 2024. Panduan Pembelajaran dan Asesmen Kurikulum Merdeka. Jakarta: Kemendikbudristek."
  ],
  "pengayaanRemedial": {
    "pengayaan": "Peserta didik yang telah tuntas diminta membuat rekaman video vlog berdurasi 2 menit mempresentasikan profil atlet inspiratif dan mengunggahnya ke platform belajar kelas.",
    "remedial": "Peserta didik yang belum mencapai kriteria diberikan bimbingan terfokus mengenai penggunaan Simple Present Tense dan penyusunan kalimat deskripsi sederhana berpola S+V+O."
  },
  "lembarPengesahan": {
    "kepalaSekolah": {
      "nama": "Zaifuddin, S.Pd.I",
      "nip": "19780512 200501 1 004",
      "jabatan": "Kepala Sekolah"
    },
    "guruPengajar": {
      "nama": "Ahmad Faozan, S.Pd.I",
      "nip": "19880915 201402 1 002",
      "jabatan": "Guru Mata Pelajaran"
    }
  }
}
```

---

## 4. Tahap 3: Hydration ke TipTap Editor

Dalam aplikasi Modulin, data dikelola secara **dual-layer**:

```
                  ┌─────────────────────────────────────────┐
                  │      Structured JSON (Ground Truth)     │
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌──────────────────────┐                              ┌──────────────────────┐
│  TipTap HTML Node    │                              │   Per-Section JSON   │
│  (Untuk Live Edit)   │                              │   (Untuk Regenerate) │
└──────────────────────┘                              └──────────────────────┘
```

1. **Konversi ke TipTap Block/HTML:**
   Setiap komponen modul di-render sebagai blok HTML yang elegan di dalam TipTap Editor (menggunakan tabel format 2 kolom sesuai acuan resmi).
2. **Auto-Save & Partial Regeneration:**
   Jika guru mengklik tombol *"Regenerate Bagian Kegiatan Inti"*, sistem hanya mengirimkan bagian `kegiatanPembelajaran.inti` ke Gemini via `POST /api/modules/[id]/regenerate-section`, lalu hasilnya di-merge kembali tanpa menimpa bagian yang sudah diedit manual oleh guru.

---

## 5. Tahap 4: Pipeline Ekspor Dokumen

### Opsi A: Ekspor Word (.docx) via Library `docx` (Pilihan Utama)

Menggunakan library `"docx": "^9.7.2"` yang sudah terpasang di `package.json`:

```typescript
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun } from "docx";

export async function generateDocxModulAjar(data: ModulAjarData): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1418,    // 2.5 cm (dalam twips)
              bottom: 1418, // 2.5 cm
              left: 1701,   // 3.0 cm (margin kiri standar dokumen dinas)
              right: 1418,  // 2.5 cm
            },
          },
        },
        children: [
          // 1. Header Judul
          new Paragraph({
            text: `MODUL AJAR ${data.informasiUmum.mataPelajaran.toUpperCase()}`,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "KURIKULUM MERDEKA",
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // 2. Tabel 2 Kolom (10 Bagian Resmi)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              createHeaderRow("No.", "Komponen", "Deskripsi / Keterangan"),
              createSectionRow("1.", "Informasi Umum", renderInformasiUmum(data.informasiUmum)),
              createSectionRow("2.", "Tujuan Pembelajaran", renderTujuan(data.tujuanPembelajaran)),
              createSectionRow("3.", "Profil Pelajar Pancasila", renderP3(data.profilPelajarPancasila)),
              createSectionRow("4.", "Materi, Alat, Bahan", renderMateri(data.materiAlatBahan)),
              createSectionRow("5.", "Model Pembelajaran", renderModel(data.modelPembelajaran)),
              createSectionRow("6.", "Kegiatan Pembelajaran", renderKegiatan(data.kegiatanPembelajaran)),
              createSectionRow("7.", "Asesmen", renderAsesmen(data.asesmen)),
              createSectionRow("8.", "Refleksi Guru & Siswa", renderRefleksi(data.refleksi)),
              createSectionRow("9.", "Daftar Pustaka", renderDaftarPustaka(data.daftarPustaka)),
              createSectionRow("10.", "Pengayaan & Remedial", renderPengayaan(data.pengayaanRemedial)),
            ],
          }),

          // 3. Lembar Pengesahan (2 Kolom Sejajar)
          createLembarPengesahanRow(data.lembarPengesahan),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
```

### Opsi B: Ekspor PDF via `@react-pdf/renderer`

`@react-pdf/renderer` merender dokumen berbasis komponen React murni ke PDF vektor berkualitas tinggi:
- **Keuntungan:** Tidak ada teks terpotong di tengah halaman (*page-break* terkontrol rapi), nomor halaman otomatis (*Halaman 1 dari 6*), dan font *Times New Roman* A4 presisi.
- **Implementasi:** Endpoint `POST /api/modules/[id]/export` dengan body `{ "format": "pdf" }` memanggil komponen `<ModulAjarPDFDocument data={data} />` dan mengembalikan streaming PDF buffer.

---

## 6. Tabel Perbandingan Pilihan Engine Ekspor

| Kriteria | Option A: `docx` (Rekomendasi) | Option B: `html-to-docx` | Opsi PDF: `@react-pdf/renderer` |
|---|---|---|---|
| **Input Data** | Structured JSON (atau parsed nodes) | HTML mentah dari TipTap | Structured JSON + React JSX |
| **Kerapian Tabel** | ⭐⭐⭐⭐⭐ (Sangat rapi, border presisi) | ⭐⭐⭐ (Border sering tidak konsisten) | ⭐⭐⭐⭐⭐ (Desain tabel cetak presisi) |
| **Page Break / Margin** | ⭐⭐⭐⭐⭐ (Margin 3cm-2.5cm akurat) | ⭐⭐⭐ (Sering terdorong acak) | ⭐⭐⭐⭐⭐ (Auto page wrapping bersih) |
| **Kesesuaian Format Dinas** | 100% Cocok dengan acuan Kemendikbud | Rentan bergeser di MS Word versi lama | 100% Siap cetak & siap arsip kepala sekolah |
| **Eksekusi Serverless** | Cepat, native buffer | Cepat tapi bergantung sanitasi HTML | Cepat, headless tanpa browser Chromium |

---

## 7. Rangkuman Keputusan Arsitektur

1. **AI Generator:** Wajib mengembalikan **JSON Terstruktur** sesuai skema 10 bagian di atas.
2. **Editor:** TipTap me-render JSON menjadi tampilan visual tabel yang bisa diedit langsung oleh guru.
3. **Penyimpanan:** Modul disimpan di Supabase PostgreSQL dalam kolom `jsonb` (`sections`) dengan status `draft` atau `final`.
4. **Ekspor Word (.docx):** Menggunakan library native `docx` untuk merangkai tabel 2-kolom, margin 3cm/2.5cm, dan lembar tanda tangan.
5. **Ekspor PDF:** Menggunakan `@react-pdf/renderer` untuk menghasilkan PDF siap cetak tanpa risiko teks terpotong.
