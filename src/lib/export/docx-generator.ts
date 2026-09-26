import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} from "docx";
import type { StructuredModulAjarData } from "@/types/modul";

const FONT_FAMILY = "Times New Roman";
const COLOR_PRIMARY_HEX = "2A7D6E"; // Teal resmi Modulin
const COLOR_BORDER_HEX = "CCCCCC";

const cellBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: COLOR_BORDER_HEX,
};

const tableBorders = {
  top: cellBorder,
  bottom: cellBorder,
  left: cellBorder,
  right: cellBorder,
  insideHorizontal: cellBorder,
  insideVertical: cellBorder,
};

/**
 * Helper membuat paragraf dengan font Times New Roman standar
 */
function createPara(
  text: string,
  options?: {
    bold?: boolean;
    size?: number; // 24 = 12pt
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    bullet?: boolean;
    spacingBefore?: number;
    spacingAfter?: number;
  }
) {
  return new Paragraph({
    alignment: options?.align || AlignmentType.LEFT,
    bullet: options?.bullet ? { level: 0 } : undefined,
    spacing: {
      before: options?.spacingBefore ?? 60,
      after: options?.spacingAfter ?? 60,
      line: 276, // 1.15 line spacing
    },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        bold: options?.bold ?? false,
        size: options?.size ?? 24, // 12pt
        color: options?.color,
      }),
    ],
  });
}

/**
 * Helper membuat cell tabel
 */
function createCell(
  children: Paragraph[],
  options?: {
    widthPercent?: number;
    shadingColor?: string;
    bold?: boolean;
  }
) {
  return new TableCell({
    width: options?.widthPercent
      ? { size: options.widthPercent, type: WidthType.PERCENTAGE }
      : undefined,
    shading: options?.shadingColor
      ? { type: ShadingType.CLEAR, fill: options.shadingColor }
      : undefined,
    margins: {
      top: 120, // ~6pt
      bottom: 120,
      left: 140, // ~7pt
      right: 140,
    },
    children: children.length > 0 ? children : [createPara("")],
  });
}

/**
 * Helper membuat baris 2-kolom untuk komponen modul
 */
function createComponentRow(
  no: string,
  komponenTitle: string,
  descriptions: Paragraph[]
) {
  const leftCell = createCell(
    [
      createPara(`${no} ${komponenTitle}`, {
        bold: true,
        size: 23,
      }),
    ],
    { widthPercent: 30, shadingColor: "F5F0E6" } // Surface soft krem
  );

  const rightCell = createCell(descriptions, { widthPercent: 70 });

  return new TableRow({
    children: [leftCell, rightCell],
  });
}

/**
 * Generator File DOCX Resmi (Option A - Programmatic Native Engine)
 */
export async function generateDocxModulAjar(
  data: StructuredModulAjarData
): Promise<Buffer> {
  const {
    informasiUmum,
    tujuanPembelajaran,
    profilPelajarPancasila,
    materiAlatBahan,
    modelPembelajaran,
    kegiatanPembelajaran,
    asesmen,
    refleksi,
    daftarPustaka,
    pengayaanRemedial,
    lembarPengesahan,
  } = data;

  // 1. Baris Informasi Umum
  const infoParas: Paragraph[] = [
    createPara(`Nama Penyusun: ${informasiUmum.namaPenyusun}`),
    createPara(`Nama Institusi: ${informasiUmum.namaInstitusi}`),
    createPara(`Mata Pelajaran: ${informasiUmum.mataPelajaran || "-"}`),
    createPara(`Tahun Penyusunan: ${informasiUmum.tahunPenyusunan}`),
    createPara(`Jenjang Sekolah: ${informasiUmum.jenjangSekolah}`),
    createPara(`Fase / Kelas: Fase ${informasiUmum.fase} / Kelas ${informasiUmum.kelas}`),
    createPara(`Alokasi Waktu: ${informasiUmum.alokasiWaktu}`),
  ];

  // 2. Baris Tujuan Pembelajaran
  const tujuanParas: Paragraph[] = [
    createPara("Fase Capaian Pembelajaran (CP):", { bold: true }),
    createPara(tujuanPembelajaran.faseCP),
    createPara("Elemen / Domain CP:", { bold: true, spacingBefore: 100 }),
    ...(tujuanPembelajaran.elemenCP || []).map((e) => createPara(e, { bullet: true })),
    createPara("Tujuan Pembelajaran:", { bold: true, spacingBefore: 100 }),
    ...(tujuanPembelajaran.tujuan || []).map((t) => createPara(t, { bullet: true })),
    createPara("Essential Question(s) / Pertanyaan Pemantik:", { bold: true, spacingBefore: 100 }),
    ...(tujuanPembelajaran.pertanyaanPemantik || []).map((q) => createPara(q, { bullet: true })),
    createPara(`Lingkungan Belajar: ${tujuanPembelajaran.lingkunganBelajar || "Indoor / Outdoor"}`, { spacingBefore: 100 }),
  ];

  // 3. Baris Profil Pelajar Pancasila
  const p3Paras: Paragraph[] = [
    createPara("Dimensi Profil Pelajar Pancasila yang Berkaitan:", { bold: true }),
    ...(profilPelajarPancasila || []).map((p) => createPara(p, { bullet: true })),
  ];

  // 4. Baris Materi, Alat, dan Bahan
  const materiParas: Paragraph[] = [
    createPara("Materi Ajar / Sumber Utama:", { bold: true }),
    createPara(materiAlatBahan.materiUtama),
    createPara("Sumber Belajar:", { bold: true, spacingBefore: 100 }),
    ...(materiAlatBahan.sumberBelajar || []).map((s) => createPara(s, { bullet: true })),
    createPara("Fasilitas / Sarana Prasarana:", { bold: true, spacingBefore: 100 }),
    ...(materiAlatBahan.fasilitas || []).map((f) => createPara(f, { bullet: true })),
  ];

  // 5. Baris Model Pembelajaran
  const modelParas: Paragraph[] = [
    createPara(`Model: ${modelPembelajaran.namaModel}`, { bold: true }),
    createPara(`Fokus: ${modelPembelajaran.fokus}`),
    createPara(`Metode: ${(modelPembelajaran.metode || []).join(", ")}`, { spacingBefore: 80 }),
  ];

  // 6. Baris Kegiatan Pembelajaran (Pendahuluan, Inti per Sintaks, Penutup)
  const kegiatanParas: Paragraph[] = [
    createPara("A. Kegiatan Pendahuluan:", { bold: true }),
    ...(kegiatanPembelajaran.pendahuluan || []).map((k) => createPara(k, { bullet: true })),

    createPara("B. Kegiatan Inti (Sesuai Sintaks Model):", { bold: true, spacingBefore: 140 }),
    ...(kegiatanPembelajaran.inti || []).flatMap((tahap, idx) => [
      createPara(`${idx + 1}. ${tahap.tahapSintaks}`, { bold: true, color: COLOR_PRIMARY_HEX, spacingBefore: 80 }),
      createPara(`• Aktivitas Guru: ${tahap.aktivitasGuru}`),
      createPara(`• Aktivitas Siswa: ${tahap.aktivitasSiswa}`),
    ]),

    createPara("C. Kegiatan Penutup:", { bold: true, spacingBefore: 140 }),
    ...(kegiatanPembelajaran.penutup || []).map((k) => createPara(k, { bullet: true })),
  ];

  // 7. Baris Asesmen
  const asesmenParas: Paragraph[] = [
    createPara(`Target Penilaian: ${asesmen.targetPenilaian}`),
    createPara(`Jenis Asesmen: ${(asesmen.jenisAsesmen || []).join(", ")}`),
    createPara(`Kriteria Ketercapaian TP: ${asesmen.kriteriaKetercapaian}`, { spacingBefore: 80 }),
    createPara(`Cara Melakukan Asesmen: ${asesmen.caraPenilaian}`),
    createPara("Rubrik Asesmen:", { bold: true, spacingBefore: 100 }),
    ...(asesmen.rubrik || []).map((r) =>
      createPara(`• [${r.aspek} - Maks ${r.skorMaks} Poin]: ${r.kriteria}`)
    ),
  ];

  // 8. Baris Refleksi Guru dan Siswa
  const refleksiParas: Paragraph[] = [
    createPara("Refleksi Guru:", { bold: true }),
    ...(refleksi.refleksiGuru || []).map((rg) => createPara(rg, { bullet: true })),
    createPara("Refleksi Peserta Didik:", { bold: true, spacingBefore: 120 }),
    ...(refleksi.refleksiSiswa || []).map((rs) => createPara(rs, { bullet: true })),
  ];

  // 9. Baris Daftar Pustaka
  const pustakaParas: Paragraph[] = (daftarPustaka || []).map((dp) =>
    createPara(dp, { bullet: true })
  );

  // 10. Baris Pengayaan dan Remedial
  const pengayaanParas: Paragraph[] = [
    createPara("Pengayaan (Bagi Murid Tuntas):", { bold: true }),
    createPara(pengayaanRemedial.pengayaan),
    createPara("Remedial (Bimbingan Murid Belum Tuntas):", { bold: true, spacingBefore: 100 }),
    createPara(pengayaanRemedial.remedial),
  ];

  // Tabel Header Row
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      createCell([createPara("No. & Komponen", { bold: true, color: "FFFFFF" })], {
        widthPercent: 30,
        shadingColor: COLOR_PRIMARY_HEX,
      }),
      createCell([createPara("Deskripsi / Keterangan", { bold: true, color: "FFFFFF" })], {
        widthPercent: 70,
        shadingColor: COLOR_PRIMARY_HEX,
      }),
    ],
  });

  // Table Utama 10 Komponen
  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      headerRow,
      createComponentRow("1.", "Informasi Umum Perangkat Ajar", infoParas),
      createComponentRow("2.", "Tujuan Pembelajaran", tujuanParas),
      createComponentRow("3.", "Profil Pelajar Pancasila", p3Paras),
      createComponentRow("4.", "Materi Ajar, Alat, dan Bahan", materiParas),
      createComponentRow("5.", "Model Pembelajaran", modelParas),
      createComponentRow("6.", "Urutan Kegiatan Pembelajaran", kegiatanParas),
      createComponentRow("7.", "Asesmen", asesmenParas),
      createComponentRow("8.", "Refleksi Guru dan Siswa", refleksiParas),
      createComponentRow("9.", "Daftar Pustaka", pustakaParas),
      createComponentRow("10.", "Pengayaan dan Remedial", pengayaanParas),
    ],
  });

  // Lembar Pengesahan (Tanda Tangan 2 Kolom)
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          createCell(
            [
              createPara("Mengetahui,", { align: AlignmentType.CENTER }),
              createPara(`Kepala Sekolah ${informasiUmum.namaInstitusi}`, {
                bold: true,
                align: AlignmentType.CENTER,
              }),
              createPara("", { spacingBefore: 700 }), // Ruang tanda tangan
              createPara(lembarPengesahan.kepalaSekolah.nama, {
                bold: true,
                align: AlignmentType.CENTER,
              }),
              createPara(`NIP. ${lembarPengesahan.kepalaSekolah.nip}`, {
                align: AlignmentType.CENTER,
              }),
            ],
            { widthPercent: 50 }
          ),
          createCell(
            [
              createPara(lembarPengesahan.kotaTanggal || "..................., ................ 2026", {
                align: AlignmentType.CENTER,
              }),
              createPara("Guru Mata Pelajaran,", {
                bold: true,
                align: AlignmentType.CENTER,
              }),
              createPara("", { spacingBefore: 700 }), // Ruang tanda tangan
              createPara(lembarPengesahan.guruPengajar.nama, {
                bold: true,
                align: AlignmentType.CENTER,
              }),
              createPara(`NIP. ${lembarPengesahan.guruPengajar.nip}`, {
                align: AlignmentType.CENTER,
              }),
            ],
            { widthPercent: 50 }
          ),
        ],
      }),
    ],
  });

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1418, // 2.5 cm (1 cm = 567 twips)
              bottom: 1418, // 2.5 cm
              left: 1701, // 3.0 cm (margin resmi kiri)
              right: 1418, // 2.5 cm
            },
          },
        },
        children: [
          // Header Judul Dokumen
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 0, after: 100 },
            children: [
              new TextRun({
                text: `MODUL AJAR ${informasiUmum.jenjangSekolah.toUpperCase()} ${informasiUmum.kelas.toUpperCase()}`,
                bold: true,
                font: FONT_FAMILY,
                size: 28, // 14pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: "KURIKULUM MERDEKA",
                bold: true,
                font: FONT_FAMILY,
                size: 26, // 13pt
                color: COLOR_PRIMARY_HEX,
              }),
            ],
          }),

          // Tabel 10 Bagian Resmi
          mainTable,

          // Jarak Sebelum Lembar Pengesahan
          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Tabel Lembar Pengesahan
          signTable,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
