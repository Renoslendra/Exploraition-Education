export interface ModulIdentitas {
  namaGuru: string;
  instansi: string;
  mataPelajaran: string;
  kelas: string;
  fase: string; // Fase A-F (Kurikulum Merdeka)
  semester: string;
  tahunAjaran: string;
  bab: string;
  topik: string;
  alokasWaktu: string;
  jumlahPertemuan: number;
}

export interface ModelPembelajaran {
  id: string;
  nama: string;
  singkatan: string;
  deskripsi: string;
  langkahLangkah: string[];
  cocokUntuk: string;
  icon: string;
}

export interface ModulSection {
  id: string;
  judul: string;
  konten: string; // HTML content dari TipTap
  urutan: number;
}

export interface ModulAjar {
  id?: string;
  identitas: ModulIdentitas;
  modelPembelajaran: ModelPembelajaran;
  sections: ModulSection[];
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
  sections: ModulSection[];
  error?: string;
}
