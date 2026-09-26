"use client";

import { useState, useEffect } from "react";
import type { StructuredModulAjarData } from "@/types/modul";
import { Download, Printer, Edit3, Check, Sparkles, BookOpen } from "lucide-react";

interface OfficialTablePreviewProps {
  data: StructuredModulAjarData;
  onUpdateData?: (updated: StructuredModulAjarData) => void;
  onDownloadDocx?: () => void;
  isExporting?: boolean;
}

export default function OfficialTablePreview({
  data,
  onUpdateData,
  onDownloadDocx,
  isExporting = false,
}: OfficialTablePreviewProps) {
  const [isEditingSign, setIsEditingSign] = useState(false);

  // Form local state for quick editing pengesahan & identitas
  const [kotaTanggal, setKotaTanggal] = useState(
    data.lembarPengesahan?.kotaTanggal || "Jakarta, 15 Juli 2026"
  );
  const [namaKepsek, setNamaKepsek] = useState(
    data.lembarPengesahan?.kepalaSekolah?.nama || "Kepala Sekolah, M.Pd"
  );
  const [nipKepsek, setNipKepsek] = useState(
    data.lembarPengesahan?.kepalaSekolah?.nip || "19750101 200001 1 001"
  );
  const [namaGuru, setNamaGuru] = useState(
    data.lembarPengesahan?.guruPengajar?.nama || data.informasiUmum.namaPenyusun || "Guru Pengajar"
  );
  const [nipGuru, setNipGuru] = useState(
    data.lembarPengesahan?.guruPengajar?.nip || "-"
  );

  useEffect(() => {
    if (data.lembarPengesahan) {
      if (data.lembarPengesahan.kotaTanggal) setKotaTanggal(data.lembarPengesahan.kotaTanggal);
      if (data.lembarPengesahan.kepalaSekolah?.nama) setNamaKepsek(data.lembarPengesahan.kepalaSekolah.nama);
      if (data.lembarPengesahan.kepalaSekolah?.nip) setNipKepsek(data.lembarPengesahan.kepalaSekolah.nip);
      if (data.lembarPengesahan.guruPengajar?.nama) setNamaGuru(data.lembarPengesahan.guruPengajar.nama);
      if (data.lembarPengesahan.guruPengajar?.nip) setNipGuru(data.lembarPengesahan.guruPengajar.nip);
    }
  }, [data]);

  const handleSaveSign = () => {
    const updated: StructuredModulAjarData = {
      ...data,
      lembarPengesahan: {
        kotaTanggal,
        kepalaSekolah: {
          ...data.lembarPengesahan?.kepalaSekolah,
          nama: namaKepsek,
          nip: nipKepsek,
        },
        guruPengajar: {
          ...data.lembarPengesahan?.guruPengajar,
          nama: namaGuru,
          nip: nipGuru,
        },
      },
    };

    if (onUpdateData) {
      onUpdateData(updated);
    }
    setIsEditingSign(false);
  };

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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Bar Above Preview (Hidden during print) */}
      <div className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 bg-surface-dark-elevated p-3 rounded-lg border border-surface-dark-soft print:hidden">
        <div className="flex items-center gap-2 text-on-dark-soft text-[13px]">
          <Sparkles size={16} className="text-primary" />
          <span>Format Dokumen Resmi (BSKAP)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingSign(!isEditingSign)}
            className="text-[12px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-dark-soft hover:bg-surface-dark text-on-dark transition-colors border border-surface-dark-soft cursor-pointer font-sans"
          >
            <Edit3 size={14} />
            <span>{isEditingSign ? "Tutup" : "Ubah Pengesahan"}</span>
          </button>

          {onDownloadDocx && (
            <button
              type="button"
              onClick={onDownloadDocx}
              disabled={isExporting}
              className="text-[12px] flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary hover:bg-primary-active text-on-primary font-medium transition-colors disabled:opacity-50 cursor-pointer font-sans"
            >
              <Download size={14} />
              <span>{isExporting ? "Menyiapkan..." : "Unduh Word (.docx)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Signature & Info Edit Drawer (Hidden during print) */}
      {isEditingSign && (
        <div className="w-full max-w-4xl mb-6 bg-surface-card border border-hairline p-5 rounded-xl shadow-sm print:hidden animate-fade-in text-ink">
          <h3 className="text-[15px] font-semibold mb-3 flex items-center gap-2 text-primary">
            <Edit3 size={16} />
            Ubah Lembar Pengesahan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block font-medium mb-1 text-body-strong">Kota & Tanggal Pengesahan</label>
              <input
                type="text"
                value={kotaTanggal}
                onChange={(e) => setKotaTanggal(e.target.value)}
                placeholder="Contoh: Jepara, 15 Juli 2026"
                className="w-full bg-canvas border border-hairline rounded px-3 py-1.5 text-[13px] text-ink"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-body-strong">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={namaKepsek}
                onChange={(e) => setNamaKepsek(e.target.value)}
                className="w-full bg-canvas border border-hairline rounded px-3 py-1.5 text-[13px] text-ink"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-body-strong">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={nipKepsek}
                onChange={(e) => setNipKepsek(e.target.value)}
                className="w-full bg-canvas border border-hairline rounded px-3 py-1.5 text-[13px] text-ink"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-body-strong">Nama Guru Pengajar</label>
              <input
                type="text"
                value={namaGuru}
                onChange={(e) => setNamaGuru(e.target.value)}
                className="w-full bg-canvas border border-hairline rounded px-3 py-1.5 text-[13px] text-ink"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-body-strong">NIP Guru Pengajar</label>
              <input
                type="text"
                value={nipGuru}
                onChange={(e) => setNipGuru(e.target.value)}
                placeholder="NIP atau -"
                className="w-full bg-canvas border border-hairline rounded px-3 py-1.5 text-[13px] text-ink"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsEditingSign(false)}
              className="px-3 py-1.5 text-[13px] rounded border border-hairline hover:bg-canvas text-body"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSign}
              className="px-4 py-1.5 text-[13px] rounded bg-primary hover:bg-primary-active text-on-primary font-medium flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Check size={14} />
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      {/* A4 Paper Document Container (Visual replica of Word Document) */}
      <div 
        className="w-full max-w-4xl bg-white text-black p-8 sm:p-12 rounded-lg shadow-xl border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full font-serif"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {/* Document Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-950 mb-1">
            MODUL AJAR {informasiUmum.jenjangSekolah || "PENDIDIKAN"} {informasiUmum.kelas ? `KELAS ${informasiUmum.kelas}` : ""}
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-[#1f6358] uppercase tracking-wide">
            KURIKULUM MERDEKA
          </h2>
          {informasiUmum.mataPelajaran && (
            <p className="text-base font-semibold text-gray-800 mt-1">
              Mata Pelajaran: {informasiUmum.mataPelajaran}
            </p>
          )}
        </div>

        {/* 10-Component Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 text-[13px] leading-relaxed">
            <thead>
              <tr className="bg-[#2a7d6e] text-white">
                <th className="border border-gray-400 p-2.5 text-left w-[30%] font-bold text-[14px]">
                  No. &amp; Komponen
                </th>
                <th className="border border-gray-400 p-2.5 text-left w-[70%] font-bold text-[14px]">
                  Deskripsi / Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 1. Informasi Umum */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  1. Informasi Umum Perangkat Ajar
                </td>
                <td className="border border-gray-400 p-3 space-y-1">
                  <p><span className="font-semibold">Nama Penyusun:</span> {informasiUmum.namaPenyusun}</p>
                  <p><span className="font-semibold">Nama Institusi:</span> {informasiUmum.namaInstitusi}</p>
                  <p><span className="font-semibold">Mata Pelajaran:</span> {informasiUmum.mataPelajaran || "-"}</p>
                  <p><span className="font-semibold">Tahun Penyusunan:</span> {informasiUmum.tahunPenyusunan}</p>
                  <p><span className="font-semibold">Jenjang Sekolah:</span> {informasiUmum.jenjangSekolah}</p>
                  <p><span className="font-semibold">Fase / Kelas:</span> Fase {informasiUmum.fase} / Kelas {informasiUmum.kelas}</p>
                  <p><span className="font-semibold">Alokasi Waktu:</span> {informasiUmum.alokasiWaktu}</p>
                </td>
              </tr>

              {/* 2. Tujuan Pembelajaran */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  2. Tujuan Pembelajaran
                </td>
                <td className="border border-gray-400 p-3 space-y-2.5">
                  <div>
                    <p className="font-semibold text-gray-900">Fase Capaian Pembelajaran (CP):</p>
                    <p className="italic text-gray-800 mt-0.5">{tujuanPembelajaran.faseCP}</p>
                  </div>

                  {tujuanPembelajaran.elemenCP && tujuanPembelajaran.elemenCP.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900">Elemen / Domain CP:</p>
                      <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                        {tujuanPembelajaran.elemenCP.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">Tujuan Pembelajaran:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(tujuanPembelajaran.tujuan || []).map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Pertanyaan Pemantik:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(tujuanPembelajaran.pertanyaanPemantik || []).map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <p>
                    <span className="font-semibold">Lingkungan Belajar:</span> {tujuanPembelajaran.lingkunganBelajar || "Ruang kelas dan laboratorium"}
                  </p>
                </td>
              </tr>

              {/* 3. Profil Pelajar Pancasila */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  3. Profil Pelajar Pancasila
                </td>
                <td className="border border-gray-400 p-3">
                  <p className="font-semibold text-gray-900 mb-1">
                    Dimensi Terpilih:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {(profilPelajarPancasila || []).map((p, i) => (
                      <li key={i} className="font-medium text-gray-900">{p}</li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* 4. Materi, Alat, dan Bahan */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  4. Materi Ajar, Alat, dan Bahan
                </td>
                <td className="border border-gray-400 p-3 space-y-2">
                  <p><span className="font-semibold">Materi Pokok:</span> {materiAlatBahan.materiUtama}</p>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Sumber Belajar:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(materiAlatBahan.sumberBelajar || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Sarana dan Prasarana:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(materiAlatBahan.fasilitas || []).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>

              {/* 5. Model Pembelajaran */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  5. Model Pembelajaran
                </td>
                <td className="border border-gray-400 p-3 space-y-1">
                  <p><span className="font-semibold">Model:</span> {modelPembelajaran.namaModel}</p>
                  <p><span className="font-semibold">Fokus:</span> {modelPembelajaran.fokus}</p>
                  <p><span className="font-semibold">Metode:</span> {(modelPembelajaran.metode || []).join(", ")}</p>
                </td>
              </tr>

              {/* 6. Urutan Kegiatan Pembelajaran */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  6. Urutan Kegiatan Pembelajaran
                </td>
                <td className="border border-gray-400 p-3 space-y-3">
                  <div>
                    <p className="font-bold text-[#1f6358]">A. Pendahuluan</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-1">
                      {(kegiatanPembelajaran.pendahuluan || []).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-bold text-[#1f6358]">
                      B. Kegiatan Inti ({modelPembelajaran.namaModel})
                    </p>
                    <div className="space-y-2.5 mt-1.5">
                      {(kegiatanPembelajaran.inti || []).map((tahap, idx) => (
                        <div key={idx} className="p-2.5 bg-gray-50 rounded border border-gray-200">
                          <p className="font-bold text-gray-950">
                            {idx + 1}. {tahap.tahapSintaks}
                          </p>
                          <p className="mt-1">
                            <span className="font-semibold text-gray-800">Aktivitas Guru:</span> {tahap.aktivitasGuru}
                          </p>
                          <p className="mt-0.5">
                            <span className="font-semibold text-gray-800">Aktivitas Siswa:</span> {tahap.aktivitasSiswa}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-[#1f6358]">C. Penutup</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-1">
                      {(kegiatanPembelajaran.penutup || []).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>

              {/* 7. Asesmen */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  7. Asesmen
                </td>
                <td className="border border-gray-400 p-3 space-y-2">
                  <p><span className="font-semibold">Target Penilaian:</span> {asesmen.targetPenilaian}</p>
                  <p><span className="font-semibold">Jenis Asesmen:</span> {(asesmen.jenisAsesmen || []).join(", ")}</p>
                  <p><span className="font-semibold">Kriteria Ketercapaian:</span> {asesmen.kriteriaKetercapaian}</p>
                  <p><span className="font-semibold">Cara Penilaian:</span> {asesmen.caraPenilaian}</p>

                  <div className="mt-2">
                    <p className="font-semibold text-gray-900 mb-1">Rubrik Penilaian:</p>
                    <table className="w-full border-collapse border border-gray-400 text-[12px]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800">
                          <th className="border border-gray-400 p-1.5 text-left">Aspek Penilaian</th>
                          <th className="border border-gray-400 p-1.5 text-center w-16">Skor Maks</th>
                          <th className="border border-gray-400 p-1.5 text-left">Kriteria Indikator</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(asesmen.rubrik || []).map((r, i) => (
                          <tr key={i}>
                            <td className="border border-gray-400 p-1.5 font-medium">{r.aspek}</td>
                            <td className="border border-gray-400 p-1.5 text-center">{r.skorMaks}</td>
                            <td className="border border-gray-400 p-1.5">{r.kriteria}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              {/* 8. Refleksi */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  8. Refleksi Guru dan Siswa
                </td>
                <td className="border border-gray-400 p-3 space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900">Refleksi Guru:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(refleksi.refleksiGuru || []).map((rg, i) => (
                        <li key={i}>{rg}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Refleksi Siswa:</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {(refleksi.refleksiSiswa || []).map((rs, i) => (
                        <li key={i}>{rs}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>

              {/* 9. Daftar Pustaka */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  9. Daftar Pustaka
                </td>
                <td className="border border-gray-400 p-3">
                  <ul className="list-disc pl-5 space-y-0.5">
                    {(daftarPustaka || []).map((dp, i) => (
                      <li key={i}>{dp}</li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* 10. Pengayaan dan Remedial */}
              <tr className="align-top hover:bg-gray-50/50">
                <td className="border border-gray-400 p-3 font-bold bg-[#faf7f2] text-gray-900">
                  10. Pengayaan dan Remedial
                </td>
                <td className="border border-gray-400 p-3 space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900">Pengayaan:</p>
                    <p className="mt-0.5">{pengayaanRemedial.pengayaan}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Remedial:</p>
                    <p className="mt-0.5">{pengayaanRemedial.remedial}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lembar Pengesahan (2-Column Signature Table) */}
        <div className="mt-8 pt-4">
          <div className="grid grid-cols-2 text-center text-[13px] leading-normal">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">
                Kepala Sekolah {informasiUmum.namaInstitusi || "Sekolah"}
              </p>
              <div className="h-20"></div> {/* Space for signature / stamp */}
              <p className="font-bold underline uppercase">
                {lembarPengesahan?.kepalaSekolah?.nama || "Kepala Sekolah, M.Pd"}
              </p>
              <p>NIP. {lembarPengesahan?.kepalaSekolah?.nip || "-"}</p>
            </div>

            <div>
              <p>{lembarPengesahan?.kotaTanggal || "..................., ................ 2026"}</p>
              <p className="font-bold">Guru Mata Pelajaran,</p>
              <div className="h-20"></div> {/* Space for signature */}
              <p className="font-bold underline uppercase">
                {lembarPengesahan?.guruPengajar?.nama || informasiUmum.namaPenyusun || "Guru Pengajar"}
              </p>
              <p>NIP. {lembarPengesahan?.guruPengajar?.nip || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
