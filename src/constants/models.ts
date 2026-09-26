import type { ModelPembelajaran } from "@/types/modul";

/**
 * 6 Model Pembelajaran Resmi Kurikulum Merdeka
 * Sesuai PRD.md, AGENT.md, SCHEMA.md, dan modul_schema.sql
 */
export const MODEL_PEMBELAJARAN: ModelPembelajaran[] = [
  {
    id: "pbl",
    nama: "Problem-Based Learning",
    singkatan: "PBL",
    deskripsi:
      "Pembelajaran berbasis masalah nyata. Peserta didik menganalisis data, meneliti, dan merumuskan solusi.",
    fokus: "Pemecahan masalah kontekstual yang berfokus pada perumusan solusi konkret.",
    langkahLangkah: [
      "Fase 1: Orientasi murid pada masalah",
      "Fase 2: Mengorganisasi murid untuk belajar dan meneliti",
      "Fase 3: Membimbing penyelidikan individu maupun kelompok",
      "Fase 4: Mengembangkan dan menyajikan hasil solusi",
      "Fase 5: Menganalisis dan mengevaluasi proses pemecahan masalah",
    ],
    cocokUntuk:
      "Materi analitis yang menuntut penalaran kritis dan pemecahan kasus kontekstual (IPA, IPS, Matematika, PKn).",
    icon: "🧩",
  },
  {
    id: "pjbl",
    nama: "Project-Based Learning",
    singkatan: "PjBL",
    deskripsi:
      "Pembelajaran berbasis proyek berjadwal. Peserta didik merancang, mewujudkan, dan mempresentasikan karya nyata.",
    fokus: "Penyusunan karya dan artefak nyata melalui tahapan proyek terencana.",
    langkahLangkah: [
      "Fase 1: Penentuan pertanyaan mendasar (Essential Question)",
      "Fase 2: Perancangan desain proyek dan pembagian peran",
      "Fase 3: Penyusunan jadwal pelaksanaan (Create a Schedule)",
      "Fase 4: Pemantauan kemajuan proyek (Monitoring)",
      "Fase 5: Penilaian hasil karya (Assess the Outcome)",
      "Fase 6: Evaluasi pengalaman belajar (Evaluation)",
    ],
    cocokUntuk:
      "Proyek interdisipliner, Praktik Kejuruan (SMK), Prakarya, Seni, IPAS, Bahasa, P5.",
    icon: "🚀",
  },
  {
    id: "dl",
    nama: "Discovery Learning",
    singkatan: "DL",
    deskripsi:
      "Pembelajaran melalui observasi dan percobaan terarah untuk membuktikan konsep keilmuan.",
    fokus: "Penemuan konsep melalui eksplorasi terarah dan verifikasi data empiris.",
    langkahLangkah: [
      "Fase 1: Pemberian rangsangan (Stimulation)",
      "Fase 2: Identifikasi masalah dan hipotesis (Problem Statement)",
      "Fase 3: Pengumpulan data eksperimen atau observasi (Data Collection)",
      "Fase 4: Pengolahan data dan analisis (Data Processing)",
      "Fase 5: Pembuktian hipotesis (Verification)",
      "Fase 6: Penarikan kesimpulan konsep (Generalization)",
    ],
    cocokUntuk:
      "Sains, Matematika, dan materi yang membutuhkan pembuktian hukum alam atau fakta empiris.",
    icon: "🔍",
  },
  {
    id: "il",
    nama: "Inquiry Learning",
    singkatan: "IL",
    deskripsi:
      "Pembelajaran berbasis penyelidikan ilmiah melalui perumusan pertanyaan dan uji hipotesis.",
    fokus: "Penyelidikan ilmiah untuk menjawab pertanyaan penelitian berbasis bukti.",
    langkahLangkah: [
      "Fase 1: Orientasi konteks dan fenomena",
      "Fase 2: Perumusan masalah penyelidikan",
      "Fase 3: Perumusan hipotesis sementara",
      "Fase 4: Pengumpulan data melalui investigasi",
      "Fase 5: Pengujian hipotesis dengan data empiris",
      "Fase 6: Penarikan kesimpulan dan pelaporan hasil",
    ],
    cocokUntuk:
      "IPA, Fisika, Kimia, Biologi, IPS Terpadu, Sejarah, dan riset ilmiah.",
    icon: "🔬",
  },
  {
    id: "cooperative",
    nama: "Cooperative Learning",
    singkatan: "CL",
    deskripsi:
      "Pembelajaran kelompok kecil dengan pembagian peran terstruktur dan tanggung jawab individu.",
    fokus: "Kolaborasi terstruktur dalam kelompok untuk mencapai tujuan belajar bersama.",
    langkahLangkah: [
      "Fase 1: Penyampaian tujuan dan motivasi belajar",
      "Fase 2: Penyajian informasi pengantar",
      "Fase 3: Pengorganisasian kelompok kooperatif",
      "Fase 4: Bimbingan kerja kelompok dan diskusi",
      "Fase 5: Evaluasi hasil belajar per kelompok dan individu",
      "Fase 6: Pemberian penghargaan kelompok",
    ],
    cocokUntuk:
      "Mata pelajaran umum, penguatan gotong royong, komunikasi, dan kecerdasan sosial.",
    icon: "🤝",
  },
  {
    id: "circ",
    nama: "Cooperative Integrated Reading & Composition",
    singkatan: "CIRC",
    deskripsi:
      "Model kooperatif terpadu untuk penguatan keterampilan membaca analitis dan menulis terstruktur.",
    fokus: "Literasi membaca analitis dan penulisan teks secara kolaboratif.",
    langkahLangkah: [
      "Fase 1: Orientasi wacana dan prediksi isi teks",
      "Fase 2: Pembentukan tim dan pembagian bahan bacaan",
      "Fase 3: Pembacaan mandiri dan pencatatan ide pokok",
      "Fase 4: Diskusi kelompok dan pertukaran telaah teks",
      "Fase 5: Latihan menulis terpadu atau ringkasan kelompok",
      "Fase 6: Evaluasi hasil karya tulis berdasarkan rubrik membaca-menulis",
    ],
    cocokUntuk:
      "Bahasa Indonesia, Bahasa Inggris, Literasi Teks, Sejarah, dan Pendidikan Agama.",
    icon: "📖",
  },
];

/**
 * Fase Kurikulum Merdeka (Fondasi sampai F)
 */
export const FASE_KURIKULUM = [
  {
    id: "fondasi",
    label: "Fase Fondasi (PAUD / TK)",
    jenjang: "PAUD",
    keterangan: "Menggunakan Capaian Perkembangan dan pendekatan bermain-belajar konkret",
  },
  { id: "A", label: "Fase A (Kelas 1-2 SD)", jenjang: "SD", keterangan: "Literasi awal & konkret" },
  { id: "B", label: "Fase B (Kelas 3-4 SD)", jenjang: "SD", keterangan: "Transisi konkret ke semi-abstrak" },
  { id: "C", label: "Fase C (Kelas 5-6 SD)", jenjang: "SD", keterangan: "Pemahaman konsep dasar mandiri" },
  { id: "D", label: "Fase D (Kelas 7-9 SMP)", jenjang: "SMP", keterangan: "Penalaran logis & analisis dasar" },
  { id: "E", label: "Fase E (Kelas 10 SMA/SMK)", jenjang: "SMA", keterangan: "Eksplorasi minat & analisis kritis" },
  { id: "F", label: "Fase F (Kelas 11-12 SMA/SMK)", jenjang: "SMA", keterangan: "Penjurian bidang & kematangan akademik/kejuruan" },
];

/**
 * Otomatisasi penentuan Fase berdasarkan Jenjang dan Kelas
 */
export function determineFase(jenjang: string, kelas: string): string {
  const j = (jenjang || "").toUpperCase();
  const k = (kelas || "").trim();

  if (j === "PAUD" || j === "TK" || j.includes("PAUD") || j.includes("TK")) {
    return "fondasi";
  }

  if (j === "SD" || j.includes("SD") || j.includes("MI")) {
    if (k === "1" || k === "2") return "A";
    if (k === "3" || k === "4") return "B";
    if (k === "5" || k === "6") return "C";
    return "A";
  }

  if (j === "SMP" || j.includes("SMP") || j.includes("MTS")) {
    return "D";
  }

  if (j === "SMA" || j === "SMK" || j.includes("SMA") || j.includes("SMK") || j.includes("MA")) {
    if (k === "10" || k.toUpperCase() === "X") return "E";
    return "F";
  }

  return "D";
}
