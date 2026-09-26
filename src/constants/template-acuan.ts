/**
 * Blueprint & Template Acuan Resmi Modul Ajar Kurikulum Merdeka
 * Berdasarkan acuan: TEMPLATE MODUL AJAR.docx.pdf & MODUL AJAR.pdf
 */

export interface TemplateSectionDef {
  nomor: number;
  id: string;
  judul: string;
  subKomponen: string[];
  keterangan: string;
}

export const TEMPLATE_ACUAN_10_KOMPONEN: TemplateSectionDef[] = [
  {
    nomor: 1,
    id: "informasi-umum",
    judul: "1. Informasi Umum Perangkat Ajar",
    subKomponen: [
      "Nama Penyusun",
      "Nama Institusi",
      "Tahun Penyusunan Modul Ajar",
      "Jenjang Sekolah",
      "Fase / Kelas",
      "Alokasi Waktu",
    ],
    keterangan: "Identitas resmi perangkat ajar guru dan instansi",
  },
  {
    nomor: 2,
    id: "tujuan-pembelajaran",
    judul: "2. Tujuan Pembelajaran",
    subKomponen: [
      "Fase Capaian Pembelajaran (CP)",
      "Elemen / Domain CP",
      "Tujuan Pembelajaran (3 Aspek: Pengetahuan, Keterampilan, Sikap)",
      "Essential Question(s) / Pertanyaan Pemantik",
      "Lingkungan Belajar",
    ],
    keterangan: "Capaian kurikulum resmi, domain kompetensi, dan pertanyaan pemantik diskusi",
  },
  {
    nomor: 3,
    id: "profil-pelajar-pancasila",
    judul: "3. Profil Pelajar Pancasila",
    subKomponen: ["Dimensi Profil Pelajar Pancasila yang Berkaitan"],
    keterangan: "Dimensi P3 (Beriman & Bertakwa, Mandiri, Bernalar Kritis, Kreatif, Gotong Royong, Berkebhinnekaan Global)",
  },
  {
    nomor: 4,
    id: "materi-alat-bahan",
    judul: "4. Materi Ajar, Alat, dan Bahan",
    subKomponen: [
      "Materi Ajar / Sumber Pembelajaran Utama",
      "Sumber Belajar",
      "Fasilitas (Sarana dan Prasarana)",
    ],
    keterangan: "Bahan bacaan teks buku resmi Kemendikbud, media belajar, proyektor, dan LKPD",
  },
  {
    nomor: 5,
    id: "model-pembelajaran",
    judul: "5. Model Pembelajaran",
    subKomponen: ["Model Pembelajaran", "Metode Pembelajaran"],
    keterangan: "6 Model Resmi (PBL, PjBL, Discovery Learning, Inquiry, Cooperative, CIRC) dan Metode (Diskusi, Tanya Jawab)",
  },
  {
    nomor: 6,
    id: "kegiatan-pembelajaran",
    judul: "6. Urutan Kegiatan Pembelajaran",
    subKomponen: [
      "Pendahuluan (Apersepsi & Motivasi)",
      "Inti (Sintaks Model Pembelajaran Terpilih)",
      "Penutup (Refleksi & Simpulan)",
    ],
    keterangan: "Langkah-langkah aktivitas kelas berbasis sintaks model pembelajaran terpilih",
  },
  {
    nomor: 7,
    id: "asesmen",
    judul: "7. Asesmen",
    subKomponen: [
      "Target Penilaian (Individu & Kelompok)",
      "Jenis Asesmen (Formatif / Sumatif)",
      "Kriteria Pengukuran Ketercapaian TP",
      "Penilaian Kompetensi dan Pengetahuan",
      "Cara Melakukan Asesmen & Kriteria Penilaian",
    ],
    keterangan: "Rubrik pengukuran kualitatif/kuantitatif, demonstrasi performa, atau tes tertulis",
  },
  {
    nomor: 8,
    id: "refleksi",
    judul: "8. Refleksi Guru dan Siswa",
    subKomponen: ["Refleksi Guru (4-5 Pertanyaan)", "Refleksi Siswa (4-6 Pertanyaan)"],
    keterangan: "Pertanyaan reflektif untuk mengevaluasi efektivitas pembelajaran",
  },
  {
    nomor: 9,
    id: "daftar-pustaka",
    judul: "9. Daftar Pustaka",
    subKomponen: ["Buku Panduan Guru & Siswa Kemendikbudristek", "Sumber Rujukan Terverifikasi"],
    keterangan: "Daftar pustaka berformat standar rujukan resmi kurikulum",
  },
  {
    nomor: 10,
    id: "pengayaan-remedial",
    judul: "10. Pengayaan dan Remedial",
    subKomponen: [
      "Pengayaan (Aktivitas Lanjutan Peserta Didik Tuntas)",
      "Remedial (Bimbingan Khusus Peserta Didik Belum Tuntas)",
    ],
    keterangan: "Tindak lanjut diferensiasi pembelajaran sesuai kebutuhan peserta didik",
  },
];

/**
 * Format prompt instruksi untuk AI Generator agar menghasilkan modul ajar
 * persis seperti template acuan resmi (tabel 10 bagian + lembar pengesahan).
 */
export function buildTemplateAcuanAIPrompt(data: {
  namaGuru: string;
  instansi: string;
  mataPelajaran: string;
  jenjang: string;
  kelas: string;
  fase: string;
  bab: string;
  topik?: string;
  modelPembelajaran: string;
  alokasiWaktu?: string;
}): string {
  const isFondasi = data.jenjang.toLowerCase().includes("paud") || data.fase.toLowerCase().includes("fondasi");

  return `Kamu adalah asisten ahli penyusunan Modul Ajar Kurikulum Merdeka di Indonesia.
Tugasmu adalah menyusun draf MODUL AJAR LENGKAP yang WAJIB MENGIKUTI FORMAT TEMPLATE ACUAN RESMI (Tabel 10 Bagian + Lembar Pengesahan).

INFORMASI MODUL:
- Nama Guru Penyusun: ${data.namaGuru}
- Nama Sekolah/Institusi: ${data.instansi}
- Mata Pelajaran: ${data.mataPelajaran}
- Jenjang & Kelas: ${data.jenjang} / Kelas ${data.kelas}
- Fase: ${isFondasi ? "Fase Fondasi (PAUD/TK)" : `Fase ${data.fase}`}
- Bab / Materi: ${data.bab} ${data.topik ? `(Topik: ${data.topik})` : ""}
- Model Pembelajaran: ${data.modelPembelajaran}
- Alokasi Waktu: ${data.alokasiWaktu || "2 x 45 menit (1 Pertemuan)"}

ATURAN STRUKTUR WAJIB (10 BAGIAN):
1. **Informasi Umum Perangkat Ajar**: Cantumkan identitas penyusun, instansi, tahun ajaran, jenjang, kelas, dan alokasi waktu.
2. **Tujuan Pembelajaran**: Tuliskan teks Capaian Pembelajaran (CP) resmi ${isFondasi ? '(gunakan istilah "Capaian Perkembangan")' : ""}, elemen CP, Tujuan Pembelajaran (3 aspek: pengetahuan, keterampilan, sikap), 4-6 pertanyaan pemantik (Essential Questions), dan lingkungan belajar.
3. **Profil Pelajar Pancasila**: Tuliskan 2-4 dimensi P3 yang relevan dan bagaimana kaitannya dengan materi.
4. **Materi Ajar, Alat, dan Bahan**: Rincian materi ajar, sumber belajar (rujukan buku resmi Kemendikbudristek), serta sarana prasarana/fasilitas lengkap.
5. **Model Pembelajaran**: Cantumkan model "${data.modelPembelajaran}" beserta metode pembelajaran (tanya jawab, diskusi, eksplorasi, presentasi).
6. **Urutan Kegiatan Pembelajaran**:
   - **Pendahuluan** (Salam pembuka, doa, apersepsi mengaitkan materi, tujuan)
   - **Inti** (Wajib mengikuti langkah/sintaks resmi dari model "${data.modelPembelajaran}")
   - **Penutup** (Simpulan poin penting, refleksi, doa penutup)
7. **Asesmen**: Target penilaian (individu & kelompok), jenis asesmen (formatif/sumatif/performa), instrumen dan rubrik penilaian kualitatif/kuantitatif.
8. **Refleksi Guru dan Siswa**: Tuliskan 4 pertanyaan refleksi guru dan 5 pertanyaan refleksi siswa.
9. **Daftar Pustaka**: Sumber buku resmi Kemendikbudristek BSKAP dan referensi relevan.
10. **Pengayaan dan Remedial**: Kegiatan konkret pengayaan untuk murid yang tuntas dan remedial untuk murid yang butuh perbaikan.

LEMBAR PENGESAHAN:
Di bagian akhir dokumen, sertakan lembar pengesahan:
- Kiri: Mengetahui, Kepala Sekolah ${data.instansi}
- Kanan: Guru Mata Pelajaran (${data.namaGuru})`;
}
