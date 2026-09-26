import fs from "fs";
import { generateDocxModulAjar } from "../src/lib/export/docx-generator";
import type { StructuredModulAjarData } from "../src/types/modul";

const sampleData: StructuredModulAjarData = {
  informasiUmum: {
    namaPenyusun: "Ahmad Faozan, S.Pd.I",
    namaInstitusi: "SMK Mabdaul Falah Al-Hasyimi",
    tahunPenyusunan: "2026",
    jenjangSekolah: "SMK",
    fase: "E",
    kelas: "X",
    alokasiWaktu: "2 x 45 menit",
  },
  tujuanPembelajaran: {
    faseCP: "Pada akhir Fase E, peserta didik menggunakan teks lisan, tulisan, dan visual dalam bahasa Inggris...",
    elemenCP: ["Menyimak-Berbicara", "Membaca-Memirsa", "Menulis-Mempresentasikan"],
    tujuan: ["Mengidentifikasi konteks teks deskripsi atlet berprestasi", "Memproduksi teks deskriptif lisan dan tulis"],
    pertanyaanPemantik: ["Do you like sport?", "Who is your favourite athlete?"],
    lingkunganBelajar: "Ruang kelas dan area sekolah",
  },
  profilPelajarPancasila: ["Beriman & Bertakwa", "Bernalar Kritis", "Kreatif", "Gotong Royong"],
  materiAlatBahan: {
    materiUtama: "Descriptive Text: Great Athletes",
    sumberBelajar: ["Bahasa Inggris Work in Progress Kelas X, Kemendikbudristek 2022"],
    fasilitas: ["Laptop", "LCD Proyektor", "Papan tulis", "LKPD"],
  },
  modelPembelajaran: {
    namaModel: "Project-Based Learning (PjBL)",
    kodeModel: "pjbl",
    fokus: "Pemecahan masalah yang menghasilkan karya/produk nyata.",
    metode: ["Diskusi", "Tanya Jawab", "Presentasi Proyek"],
  },
  kegiatanPembelajaran: {
    pendahuluan: ["Guru membuka salam dan doa", "Apersepsi mengenai atlet dunia", "Menyampaikan tujuan pembelajaran"],
    inti: [
      {
        tahapSintaks: "Fase 1: Pertanyaan Mendasar",
        aktivitasGuru: "Menayangkan video atlet dan memberi pertanyaan esensial",
        aktivitasSiswa: "Mengamati video dan memilih tokoh atlet",
      },
      {
        tahapSintaks: "Fase 2: Perencanaan Proyek",
        aktivitasGuru: "Membagi siswa dalam kelompok 4-5 orang",
        aktivitasSiswa: "Merancang esai dan poster infografis",
      },
    ],
    penutup: ["Menyimpulkan poin penting", "Refleksi pembelajaran", "Doa penutup"],
  },
  asesmen: {
    targetPenilaian: "Individu dan Kelompok",
    jenisAsesmen: ["Formatif", "Sumatif"],
    kriteriaKetercapaian: "Mampu menyusun teks deskripsi 150 kata",
    caraPenilaian: "Rubrik unjuk kerja",
    rubrik: [
      { aspek: "Struktur Teks", skorMaks: 50, kriteria: "Identification & Description jelas" },
      { aspek: "Tata Bahasa", skorMaks: 50, kriteria: "Simple present tense tepat" },
    ],
  },
  refleksi: {
    refleksiGuru: ["Apakah alokasi waktu mencukupi?", "Apa kendala yang dialami?"],
    refleksiSiswa: ["Apa materi yang paling menarik?", "Kesulitan apa yang ditemui?"],
  },
  daftarPustaka: ["Buku Bahasa Inggris Kelas X Kemendikbudristek"],
  pengayaanRemedial: {
    pengayaan: "Membuat video presentasi atlet 2 menit",
    remedial: "Latihan menyusun kalimat simple present tense",
  },
  lembarPengesahan: {
    kepalaSekolah: { nama: "Zaifuddin, S.Pd.I", nip: "19780512 200501 1 004" },
    guruPengajar: { nama: "Ahmad Faozan, S.Pd.I", nip: "19880915 201402 1 002" },
  },
};

async function testDocx() {
  console.log("Generating test DOCX...");
  const buffer = await generateDocxModulAjar(sampleData);
  fs.writeFileSync("scratch/output-test-modul.docx", buffer);
  console.log("SUCCESS! Saved to scratch/output-test-modul.docx with size:", buffer.length, "bytes");
}

testDocx().catch(console.error);
