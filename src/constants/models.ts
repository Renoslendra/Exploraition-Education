import type { ModelPembelajaran } from "@/types/modul";

export const MODEL_PEMBELAJARAN: ModelPembelajaran[] = [
  {
    id: "pbl",
    nama: "Problem Based Learning",
    singkatan: "PBL",
    deskripsi:
      "Model pembelajaran yang menggunakan masalah dunia nyata sebagai konteks bagi murid untuk belajar berpikir kritis, keterampilan pemecahan masalah, serta memperoleh pengetahuan dan konsep esensial.",
    langkahLangkah: [
      "Orientasi murid pada masalah",
      "Mengorganisasi murid untuk belajar",
      "Membimbing penyelidikan individu maupun kelompok",
      "Mengembangkan dan menyajikan hasil karya",
      "Menganalisis dan mengevaluasi proses pemecahan masalah",
    ],
    cocokUntuk:
      "Mata pelajaran yang membutuhkan analisis mendalam seperti IPA, IPS, dan Matematika",
    icon: "🧩",
  },
  {
    id: "pjbl",
    nama: "Project Based Learning",
    singkatan: "PjBL",
    deskripsi:
      "Model pembelajaran yang menggunakan proyek/kegiatan sebagai media. Murid melakukan eksplorasi, penilaian, interpretasi, sintesis, dan informasi untuk menghasilkan berbagai bentuk hasil belajar.",
    langkahLangkah: [
      "Penentuan pertanyaan mendasar (Start with Essential Question)",
      "Mendesain perencanaan proyek",
      "Menyusun jadwal (Create a Schedule)",
      "Memonitor murid dan kemajuan proyek",
      "Menguji hasil (Assess the Outcome)",
      "Mengevaluasi pengalaman (Evaluate the Experience)",
    ],
    cocokUntuk:
      "Proyek interdisipliner, Prakarya, Seni, IPAS, P5 (Projek Penguatan Profil Pelajar Pancasila)",
    icon: "🚀",
  },
  {
    id: "dl",
    nama: "Discovery Learning",
    singkatan: "DL",
    deskripsi:
      "Model pembelajaran yang mengarahkan murid untuk menemukan sendiri konsep, makna, dan hubungan melalui serangkaian data atau informasi yang diperoleh melalui pengamatan atau percobaan.",
    langkahLangkah: [
      "Stimulasi (Stimulation)",
      "Identifikasi masalah (Problem Statement)",
      "Pengumpulan data (Data Collection)",
      "Pengolahan data (Data Processing)",
      "Pembuktian (Verification)",
      "Menarik kesimpulan (Generalization)",
    ],
    cocokUntuk:
      "IPA, Matematika, dan mata pelajaran yang membutuhkan eksperimen atau pengamatan",
    icon: "🔍",
  },
  {
    id: "inquiry",
    nama: "Inquiry Learning",
    singkatan: "IL",
    deskripsi:
      "Model pembelajaran yang menekankan pada proses berpikir secara kritis dan analitis untuk mencari dan menemukan sendiri jawaban dari suatu masalah yang dipertanyakan.",
    langkahLangkah: [
      "Orientasi",
      "Merumuskan masalah",
      "Merumuskan hipotesis",
      "Mengumpulkan data",
      "Menguji hipotesis",
      "Merumuskan kesimpulan",
    ],
    cocokUntuk:
      "Sains, Matematika, dan mata pelajaran yang memerlukan penalaran logis",
    icon: "🔬",
  },
  {
    id: "ctl",
    nama: "Contextual Teaching and Learning",
    singkatan: "CTL",
    deskripsi:
      "Model pembelajaran yang mengaitkan materi yang diajarkan dengan situasi dunia nyata murid dan mendorong murid membuat hubungan antara pengetahuan yang dimilikinya dengan penerapannya dalam kehidupan.",
    langkahLangkah: [
      "Konstruktivisme (Constructivism)",
      "Menemukan (Inquiry)",
      "Bertanya (Questioning)",
      "Masyarakat belajar (Learning Community)",
      "Pemodelan (Modeling)",
      "Refleksi (Reflection)",
      "Penilaian autentik (Authentic Assessment)",
    ],
    cocokUntuk:
      "Semua mata pelajaran, terutama yang berkaitan dengan kehidupan sehari-hari",
    icon: "🌍",
  },
  {
    id: "cooperative",
    nama: "Cooperative Learning",
    singkatan: "CL",
    deskripsi:
      "Model pembelajaran yang menggunakan kelompok kecil sehingga murid bekerja bersama untuk memaksimalkan pembelajaran mereka sendiri dan anggota kelompok lainnya. Termasuk di dalamnya Jigsaw, STAD, TGT, dll.",
    langkahLangkah: [
      "Menyampaikan tujuan dan memotivasi murid",
      "Menyajikan informasi",
      "Mengorganisasikan murid ke dalam kelompok kooperatif",
      "Membimbing kelompok bekerja dan belajar",
      "Evaluasi",
      "Memberikan penghargaan",
    ],
    cocokUntuk:
      "Semua mata pelajaran, cocok untuk membangun kemampuan sosial dan kolaborasi",
    icon: "🤝",
  },
  {
    id: "flipped",
    nama: "Flipped Classroom",
    singkatan: "FC",
    deskripsi:
      "Model pembelajaran terbalik di mana murid mempelajari materi di rumah (melalui video, bacaan) dan menggunakan waktu kelas untuk diskusi, praktik, dan pendalaman.",
    langkahLangkah: [
      "Persiapan materi pra-kelas (video/bacaan)",
      "Murid belajar mandiri di rumah",
      "Kegiatan kelas: diskusi, praktik, pendalaman",
      "Asesmen pemahaman",
      "Refleksi dan umpan balik",
    ],
    cocokUntuk:
      "Mata pelajaran dengan banyak konsep teori, cocok di jenjang SMP-SMA",
    icon: "🔄",
  },
];

export const FASE_KURIKULUM = [
  { id: "A", label: "Fase A (Kelas 1-2 SD)", jenjang: "SD" },
  { id: "B", label: "Fase B (Kelas 3-4 SD)", jenjang: "SD" },
  { id: "C", label: "Fase C (Kelas 5-6 SD)", jenjang: "SD" },
  { id: "D", label: "Fase D (Kelas 7-9 SMP)", jenjang: "SMP" },
  { id: "E", label: "Fase E (Kelas 10 SMA)", jenjang: "SMA" },
  { id: "F", label: "Fase F (Kelas 11-12 SMA)", jenjang: "SMA" },
];

export const MODUL_SECTIONS_TEMPLATE = [
  {
    id: "informasi-umum",
    judul: "A. Informasi Umum",
    urutan: 1,
  },
  {
    id: "kompetensi-awal",
    judul: "B. Kompetensi Awal",
    urutan: 2,
  },
  {
    id: "profil-pelajar-pancasila",
    judul: "C. Profil Pelajar Pancasila",
    urutan: 3,
  },
  {
    id: "sarana-prasarana",
    judul: "D. Sarana dan Prasarana",
    urutan: 4,
  },
  {
    id: "target-peserta-didik",
    judul: "E. Target Peserta Didik",
    urutan: 5,
  },
  {
    id: "capaian-pembelajaran",
    judul: "F. Capaian Pembelajaran (CP)",
    urutan: 6,
  },
  {
    id: "tujuan-pembelajaran",
    judul: "G. Tujuan Pembelajaran",
    urutan: 7,
  },
  {
    id: "pemahaman-bermakna",
    judul: "H. Pemahaman Bermakna",
    urutan: 8,
  },
  {
    id: "pertanyaan-pemantik",
    judul: "I. Pertanyaan Pemantik",
    urutan: 9,
  },
  {
    id: "kegiatan-pembelajaran",
    judul: "J. Kegiatan Pembelajaran",
    urutan: 10,
  },
  {
    id: "asesmen",
    judul: "K. Asesmen",
    urutan: 11,
  },
  {
    id: "pengayaan-remedial",
    judul: "L. Pengayaan dan Remedial",
    urutan: 12,
  },
  {
    id: "refleksi",
    judul: "M. Refleksi Guru dan Peserta Didik",
    urutan: 13,
  },
  {
    id: "lampiran",
    judul: "N. Lampiran",
    urutan: 14,
  },
  {
    id: "lkpd",
    judul: "O. Lembar Kerja Peserta Didik (LKPD)",
    urutan: 15,
  },
  {
    id: "rubrik-penilaian",
    judul: "P. Rubrik Penilaian",
    urutan: 16,
  },
  {
    id: "glosarium",
    judul: "Q. Glosarium",
    urutan: 17,
  },
  {
    id: "daftar-pustaka",
    judul: "R. Daftar Pustaka",
    urutan: 18,
  },
];
