export interface ModulIdentitas {
  namaGuru: string;
  instansi: string;
  mataPelajaran: string;
  jenjang?: string; // PAUD, SD, SMP, SMA, SMK
  kelas: string;
  fase: string; // Fondasi, A, B, C, D, E, F
  semester?: string;
  tahunAjaran: string;
  bab: string;
  topik?: string;
  alokasiWaktu?: string;
  jumlahPertemuan?: number;
}

export interface ModelPembelajaran {
  id: string;
  nama: string;
  singkatan: string;
  deskripsi: string;
  fokus?: string;
  langkahLangkah: string[];
  cocokUntuk: string;
  icon: string;
}

export interface ModulSection {
  id: string;
  judul: string;
  konten: string; // HTML content dari TipTap
  urutan: number;
  aktif?: boolean;
}

export interface KegiatanIntiTahap {
  tahapSintaks: string;
  aktivitasGuru: string;
  aktivitasSiswa: string;
}

export interface RubrikPenilaian {
  aspek: string;
  skorMaks: number;
  kriteria: string;
}

/**
 * Data Model Terstruktur 10 Komponen Resmi Acuan Modul Ajar
 */
export interface StructuredModulAjarData {
  id?: string;
  schoolLogo?: string; // Base64 data URL untuk logo sekolah custom
  informasiUmum: {
    namaPenyusun: string;
    namaInstitusi: string;
    mataPelajaran?: string;
    tahunPenyusunan: string;
    jenjangSekolah: string;
    fase: string;
    kelas: string;
    alokasiWaktu: string;
  };
  tujuanPembelajaran: {
    faseCP: string; // Teks resmi Capaian Pembelajaran / Perkembangan
    elemenCP: string[];
    tujuan: string[];
    pertanyaanPemantik: string[];
    lingkunganBelajar: string;
  };
  profilPelajarPancasila: string[];
  materiAlatBahan: {
    materiUtama: string;
    sumberBelajar: string[];
    fasilitas: string[];
  };
  modelPembelajaran: {
    namaModel: string;
    kodeModel: string;
    fokus: string;
    metode: string[];
  };
  kegiatanPembelajaran: {
    pendahuluan: string[];
    inti: KegiatanIntiTahap[];
    penutup: string[];
  };
  asesmen: {
    targetPenilaian: string;
    jenisAsesmen: string[];
    kriteriaKetercapaian: string;
    caraPenilaian: string;
    rubrik: RubrikPenilaian[];
  };
  refleksi: {
    refleksiGuru: string[];
    refleksiSiswa: string[];
  };
  daftarPustaka: string[];
  pengayaanRemedial: {
    pengayaan: string;
    remedial: string;
  };
  lembarPengesahan: {
    kotaTanggal?: string;
    kepalaSekolah: {
      nama: string;
      nip: string;
      jabatan?: string;
    };
    guruPengajar: {
      nama: string;
      nip: string;
      jabatan?: string;
    };
  };
}

export interface ModulAjar {
  id?: string;
  identitas: ModulIdentitas;
  modelPembelajaran: ModelPembelajaran;
  sections: ModulSection[];
  structuredData?: StructuredModulAjarData;
  status: "draft" | "generated" | "edited" | "final";
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface GenerateRequest {
  identitas: ModulIdentitas;
  modelPembelajaran: ModelPembelajaran;
}

export interface GenerateResponse {
  success: boolean;
  sections?: ModulSection[];
  structuredData?: StructuredModulAjarData;
  error?: string;
}
