"use client";

import { useState, useEffect } from "react";
import TipTapEditor from "@/components/editor/TipTapEditor";
import OfficialTablePreview from "@/components/modul/OfficialTablePreview";
import { Download, FileText, Printer, CheckCircle2, ArrowLeft, Sparkles, LayoutList, PenSquare, Cloud, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import type { StructuredModulAjarData } from "@/types/modul";

const DEFAULT_FALLBACK_DATA: StructuredModulAjarData = {
  informasiUmum: {
    namaPenyusun: "Ahmad Faozan, S.Pd.I",
    namaInstitusi: "SMK Mabdaul Falah Al-Hasyimi",
    mataPelajaran: "Bahasa Inggris",
    tahunPenyusunan: "2026",
    jenjangSekolah: "SMK",
    fase: "E",
    kelas: "10",
    alokasiWaktu: "2 x 45 menit (1 Pertemuan)",
  },
  tujuanPembelajaran: {
    faseCP: "Pada akhir Fase E, peserta didik menggunakan teks lisan, tulisan, dan visual dalam bahasa Inggris untuk berkomunikasi sesuai dengan situasi, tujuan, dan pemirsa/pembacanya.",
    elemenCP: ["Menyimak - Berbicara", "Membaca - Memirsa", "Menulis - Mempresentasikan"],
    tujuan: [
      "Mengidentifikasi konteks, ide pokok, dan detail spesifik dari teks deskriptif lisan dan tulis tentang atlet berprestasi.",
      "Memproduksi teks deskriptif tulis sederhana mengenai great athletes dengan struktur dan tata bahasa yang tepat.",
    ],
    pertanyaanPemantik: [
      "Do you like sports? Who is your favorite athlete?",
      "What qualities make someone a great world champion?",
    ],
    lingkunganBelajar: "Ruang kelas dan laboratorium multimedia",
  },
  profilPelajarPancasila: ["Bernalar Kritis", "Gotong Royong", "Mandiri"],
  materiAlatBahan: {
    materiUtama: "Descriptive Text: Great Athletes & Sportsmanship",
    sumberBelajar: [
      "Buku Bahasa Inggris Kelas X Kurikulum Merdeka Kemendikbudristek",
      "Video dokumenter atlet inspiratif",
    ],
    fasilitas: ["Laptop", "LCD Proyektor", "Lembar Kerja Peserta Didik (LKPD)", "Akses Internet"],
  },
  modelPembelajaran: {
    namaModel: "Project-Based Learning (PjBL)",
    kodeModel: "pjbl",
    fokus: "Menghasilkan produk nyata (infografis biografi atlet)",
    metode: ["Diskusi Kelompok", "Riset Terbimbing", "Pembuatan Karya", "Presentasi Galeri"],
  },
  kegiatanPembelajaran: {
    pendahuluan: [
      "Guru menyapa peserta didik dengan salam dan doa pembuka.",
      "Guru memeriksa kehadiran dan kesiapan belajar peserta didik.",
      "Apersepsi: Guru menampilkan klip video atlet berprestasi dan memantik diskusi singkat.",
      "Guru menyampaikan tujuan pembelajaran, cakupan materi, dan rencana proyek profil atlet.",
    ],
    inti: [
      {
        tahapSintaks: "Fase 1: Penentuan Pertanyaan Mendasar",
        aktivitasGuru: "Guru memfasilitasi eksplorasi teks deskriptif dan menantang peserta didik membuat profil inspiratif atlet dunia.",
        aktivitasSiswa: "Peserta didik menyimak contoh profil dan menentukan atlet pilihan kelompok.",
      },
      {
        tahapSintaks: "Fase 2: Perancangan Desain Proyek",
        aktivitasGuru: "Guru membimbing pembagian peran dalam kelompok dan struktur draf biografi (identifikasi, deskripsi kepribadian, prestasi).",
        aktivitasSiswa: "Peserta didik membagi tugas riset kosakata dan rancangan layout poster biografi.",
      },
      {
        tahapSintaks: "Fase 3: Penyusunan Jadwal & Pelaksanaan Riset",
        aktivitasGuru: "Guru memantau efektivitas waktu riset dan membantu pemilihan tata bahasa (simple present & adjective).",
        aktivitasSiswa: "Peserta didik mengumpulkan data prestasi atlet dan menyusun draf paragraf deskripsi.",
      },
      {
        tahapSintaks: "Fase 4: Pembuatan Produk & Monitoring",
        aktivitasGuru: "Guru melakukan pendampingan teknis dan memberikan umpan balik formatif terhadap draf teks.",
        aktivitasSiswa: "Kelompok menyelesaikan karya infografis dan teks deskriptif.",
      },
      {
        tahapSintaks: "Fase 5: Pengujian Hasil & Presentasi",
        aktivitasGuru: "Guru memoderasi sesi pameran karya (gallery walk) dan penilaian teman sejawat.",
        aktivitasSiswa: "Setiap kelompok memajang karyanya dan bertukar umpan balik apresiatif.",
      },
      {
        tahapSintaks: "Fase 6: Evaluasi Pengalaman",
        aktivitasGuru: "Guru memberikan apresiasi dan penguatan konseptual atas teks deskriptif yang dihasilkan.",
        aktivitasSiswa: "Peserta didik mengungkapkan refleksi perasaan dan pembelajaran selama mengerjakan proyek.",
      },
    ],
    penutup: [
      "Guru dan peserta didik menyimpulkan esensi pembelajaran dan kaidah teks deskripsi.",
      "Guru mengumumkan rencana asesmen sumatif pada pertemuan berikutnya.",
      "Pembelajaran ditutup dengan rasa syukur dan doa bersama.",
    ],
  },
  asesmen: {
    targetPenilaian: "Peserta didik reguler / tipikal (Individu dan Kelompok)",
    jenisAsesmen: [
      "Asesmen Formatif: Observasi keaktifan diskusi dan rubrik draf teks",
      "Asesmen Sumatif: Penilaian unjuk kerja poster biografi atlet",
    ],
    kriteriaKetercapaian: "Peserta didik mencapai minimal 75% kriteria rubrik penulisan teks deskripsi.",
    caraPenilaian: "Rubrik holistik unjuk kerja menulis dan observasi sikap profil Pancasila.",
    rubrik: [
      {
        aspek: "Struktur Teks (Identification & Description)",
        skorMaks: 30,
        kriteria: "Menyajikan struktur teks deskriptif yang runut dan lengkap sesuai kaidah genre.",
      },
      {
        aspek: "Kaidah Kebahasaan (Language Features)",
        skorMaks: 35,
        kriteria: "Penggunaan simple present tense, kata sifat, dan ejaan yang tepat serta minim kesalahan.",
      },
      {
        aspek: "Kreativitas & Orisinalitas Konten",
        skorMaks: 20,
        kriteria: "Penyajian informasi menarik, inspiratif, dan dilengkapi rujukan fakta yang akurat.",
      },
      {
        aspek: "Kerja Sama Tim & Presentasi",
        skorMaks: 15,
        kriteria: "Partisipasi aktif seluruh anggota kelompok saat penyusunan dan penyampaian hasil.",
      },
    ],
  },
  refleksi: {
    refleksiGuru: [
      "Apakah seluruh kelompok dapat menyelesaikan proyek tepat waktu sesuai alokasi jadwal?",
      "Bagian sintaks mana yang membutuhkan asistensi guru paling intensif?",
      "Langkah perbaikan apa yang perlu disiapkan untuk pertemuan lanjutan?",
    ],
    refleksiSiswa: [
      "Kosa kata bahasa Inggris baru apa saja yang kamu kuasai hari ini?",
      "Apakah kamu merasa percaya diri saat menyajikan deskripsi atlet favoritmu di depan teman?",
      "Tantangan apa yang paling seru saat berkolaborasi dalam kelompok?",
    ],
  },
  daftarPustaka: [
    "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2024). Panduan Pembelajaran dan Asesmen Kurikulum Merdeka.",
    "Buku Teks Utama Bahasa Inggris Work in Progress untuk SMA/SMK Kelas X, Pusat Perbukuan Balitbang Kemendikbudristek.",
  ],
  pengayaanRemedial: {
    pengayaan: "Peserta didik yang telah melampaui kriteria ketuntasan diarahkan menyusun teks komparasi antara dua atlet dunia dengan kosakata lanjutan.",
    remedial: "Bimbingan perorangan terfokus pada penyusunan kalimat sederhana (simple present) dengan bantuan word-bank bagi peserta didik yang belum tuntas.",
  },
  lembarPengesahan: {
    kotaTanggal: "Jepara, 15 Juli 2026",
    kepalaSekolah: {
      nama: "M. Lutfi Sholeh, S.Pd.I",
      nip: "-",
      jabatan: "Kepala SMK Mabdaul Falah Al Hasyimi",
    },
    guruPengajar: {
      nama: "Ahmad Faozan, S.Pd.I",
      nip: "-",
      jabatan: "Guru Mata Pelajaran",
    },
  },
};

export default function EditorPage() {
  // State for list of module history entries
  const [moduleHistory, setModuleHistory] = useState<StructuredModulAjarData[]>([]);
  // Selected module from history
  const [selectedFromHistory, setSelectedFromHistory] = useState<boolean>(false);
  // Existing states retain their order
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");
  const [contentHtml, setContentHtml] = useState<string>("");
  const [structuredData, setStructuredData] = useState<StructuredModulAjarData | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("Modul Ajar");
  const [status, setStatus] = useState<"draft" | "final">("draft");
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ambil data dari localStorage jika ada hasil dari form /create
  useEffect(() => {
    try {
      const savedHtml = localStorage.getItem("modulin_active_html");
      const savedStructured = localStorage.getItem("modulin_active_structured");
      const savedTitle = localStorage.getItem("modulin_active_title");

      if (savedStructured) {
        try {
          const parsed = JSON.parse(savedStructured);
          setStructuredData(parsed);
          setSelectedFromHistory(true); // Langsung buka modul aktif yang baru dibuat
          
          if (savedTitle) {
            setModuleTitle(savedTitle);
          } else {
            setModuleTitle(`Modul Ajar ${parsed.informasiUmum?.mataPelajaran || ""} Kelas ${parsed.informasiUmum?.kelas || ""}`);
          }
        } catch {
          setStructuredData(DEFAULT_FALLBACK_DATA);
        }
      } else {
        setStructuredData(DEFAULT_FALLBACK_DATA);
      }

      // Load module history dari localStorage
      const savedHistory = localStorage.getItem("modulin_history");
      let localHistoryList: StructuredModulAjarData[] = [];
      if (savedHistory) {
        try {
          localHistoryList = JSON.parse(savedHistory);
          setModuleHistory(localHistoryList);
        } catch {
          console.warn("Failed to parse module history");
        }
      }

      // Sinkronisasi dengan riwayat cloud dari API
      fetch("/api/modules")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data?.data) && data.data.length > 0) {
            const cloudModules: StructuredModulAjarData[] = data.data
              .map((m: any) => m.structured_data)
              .filter(Boolean);
            
            // Gabungkan unik berdasarkan mata pelajaran & kelas
            const combined = [...localHistoryList];
            for (const cm of cloudModules) {
              const exists = combined.some(
                (lh) =>
                  lh?.informasiUmum?.mataPelajaran === cm?.informasiUmum?.mataPelajaran &&
                  lh?.informasiUmum?.kelas === cm?.informasiUmum?.kelas
              );
              if (!exists) combined.push(cm);
            }
            setModuleHistory(combined);
          }
        })
        .catch(() => {});

      if (savedHtml) {
        setContentHtml(savedHtml);
      }
    } catch (err) {
      console.error("Gagal membaca active module dari localStorage:", err);
      setStructuredData(DEFAULT_FALLBACK_DATA);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveToCloud = async () => {
    setIsSavingCloud(true);
    try {
      const activeId = localStorage.getItem("modulin_active_id");
      const endpoint = activeId ? `/api/modules/${activeId}` : "/api/modules";
      const method = activeId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredData: structuredData || DEFAULT_FALLBACK_DATA,
          htmlContent: contentHtml,
          status,
          title: moduleTitle,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Gagal menyimpan ke cloud.");
      }

      if (resData.module?.id) {
        localStorage.setItem("modulin_active_id", resData.module.id);
      }
      showToast("Modul berhasil disimpan ke cloud database.");
    } catch (err: any) {
      console.warn("Save cloud error:", err);
      showToast(err?.message || "Gagal menyimpan ke cloud. Pastikan sudah login.");
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleUpdateStructuredData = (updated: StructuredModulAjarData) => {
    setStructuredData(updated);
    try {
      localStorage.setItem("modulin_active_structured", JSON.stringify(updated));
    } catch (err) {
      console.error("Gagal menyimpan update ke localStorage:", err);
    }
    showToast("Identitas dan lembar pengesahan berhasil diperbarui!");
  };

  // Handler Download Word (.docx) via Native Option A
  const handleDownloadDocx = async () => {
    setIsExportingWord(true);
    try {
      const payload: StructuredModulAjarData = structuredData || DEFAULT_FALLBACK_DATA;

      const res = await fetch("/api/modules/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal meng-generate file DOCX dari server.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeMapel = (payload.informasiUmum.mataPelajaran || "Modul")
        .replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `Modul_Ajar_${safeMapel}_Kelas_${payload.informasiUmum.kelas}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast("File Word (.docx) berhasil diunduh.");
    } catch (err: any) {
      console.error("Export DOCX error:", err);
      alert("Gagal mengunduh file Word: " + (err?.message || "Unknown error"));
    } finally {
      setIsExportingWord(false);
    }
  };

  // Handler Cetak / PDF
  const handlePrintPdf = () => {
    window.print();
  };

  const currentData = structuredData || DEFAULT_FALLBACK_DATA;

  return (
    <div className="flex-1 bg-surface-dark text-on-dark min-h-[calc(100vh-64px)] pb-[64px] print:bg-white print:text-black print:pb-0">
      {!selectedFromHistory ? (
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-on-dark">Riwayat Modul</h1>
            <Link href="/create" className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary-active transition-colors">
              + Buat Modul Baru
            </Link>
          </div>
          
          {moduleHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleHistory.map((mod, idx) => (
                <div key={idx} className="bg-surface-dark-elevated p-5 rounded-lg border border-surface-dark-soft cursor-pointer hover:border-primary transition-all shadow-sm group" onClick={() => {
                  setStructuredData(mod);
                  setContentHtml(mod?.informasiUmum?.namaPenyusun || "");
                  setSelectedFromHistory(true);
                  setActiveTab("preview");
                }}>
                  <div className="text-[12px] text-primary font-medium mb-1">{mod?.informasiUmum?.kelas ? `Kelas ${mod.informasiUmum.kelas}` : "Semua Kelas"}</div>
                  <h3 className="text-lg font-semibold text-on-dark mb-2 group-hover:text-primary transition-colors">{mod?.informasiUmum?.mataPelajaran || "Modul Tanpa Judul"}</h3>
                  <p className="text-sm text-on-dark-soft line-clamp-2">{mod?.informasiUmum?.namaPenyusun}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-dark-elevated border border-surface-dark-soft rounded-lg p-10 text-center flex flex-col items-center justify-center">
              <FileText size={48} className="text-on-dark-soft mb-4" />
              <h3 className="text-lg font-medium text-on-dark mb-2">Belum ada riwayat modul</h3>
              <p className="text-sm text-on-dark-soft mb-6 max-w-md">Anda belum membuat atau mengedit modul apa pun. Buat modul pertama Anda sekarang.</p>
              <Link href="/create" className="px-5 py-2.5 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary-active transition-colors">
                Mulai Buat Modul
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Toast Notification (Hidden on print) */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in text-[14px] print:hidden">
              <CheckCircle2 size={18} className="text-white" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Top Action Toolbar (Hidden on print) */}
          <div className="bg-surface-dark-elevated border-b border-surface-dark-soft h-[60px] flex items-center px-4 sm:px-6 sticky top-[64px] z-40 print:hidden">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedFromHistory(false)}
                  className="text-on-dark-soft hover:text-on-dark flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Kembali</span>
                </button>
                <div className="h-4 w-[1px] bg-surface-dark-soft hidden sm:block"></div>
                <span className="text-[13px] text-muted-soft hidden md:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status === "final" ? "bg-primary" : "bg-accent-amber"}`}></span>
                  Status: <strong className="text-on-dark uppercase text-[11px]">{status}</strong>
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center bg-surface-dark rounded-md p-1 border border-surface-dark-soft">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-surface-dark-elevated text-on-dark shadow-sm border border-surface-dark-soft"
                      : "text-on-dark-soft hover:text-on-dark"
                  }`}
                >
                  <LayoutList size={14} className={activeTab === "preview" ? "text-primary" : ""} />
                  <span>Format Resmi</span>
                </button>
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded transition-all cursor-pointer ${
                    activeTab === "editor"
                      ? "bg-surface-dark-elevated text-on-dark shadow-sm border border-surface-dark-soft"
                      : "text-on-dark-soft hover:text-on-dark"
                  }`}
                >
                  <PenSquare size={14} className={activeTab === "editor" ? "text-primary" : ""} />
                  <span>Editor Teks</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToCloud}
                  disabled={isSavingCloud}
                  className="text-[12px] border border-surface-dark-soft rounded-md px-3 py-1.5 hover:bg-surface-dark-soft transition-colors bg-surface-dark-elevated text-on-dark flex items-center gap-1.5 cursor-pointer font-sans disabled:opacity-50"
                  title="Simpan perubahan ke cloud database"
                >
                  {isSavingCloud ? <Loader2 size={14} className="animate-spin text-primary" /> : <Save size={14} className="text-primary" />}
                  <span>{isSavingCloud ? "Menyimpan..." : "Simpan"}</span>
                </button>

                <button
                  onClick={() => {
                    const nextStatus = status === "draft" ? "final" : "draft";
                    setStatus(nextStatus);
                    showToast(`Status modul diubah menjadi ${nextStatus.toUpperCase()}`);
                  }}
                  className="text-[12px] hidden lg:block border border-surface-dark-soft rounded-md px-3 py-1.5 hover:bg-surface-dark-soft transition-colors bg-surface-dark-elevated text-on-dark-soft hover:text-on-dark cursor-pointer font-sans"
                >
                  {status === "draft" ? "Tandai Final" : "Draf"}
                </button>

                <button
                  onClick={handlePrintPdf}
                  className="text-[12px] border border-surface-dark-soft rounded-md px-3 py-1.5 hover:bg-surface-dark-soft transition-colors bg-surface-dark-elevated text-on-dark flex items-center gap-1.5 cursor-pointer font-sans"
                  title="Cetak atau simpan PDF"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Cetak / PDF</span>
                </button>

                <button
                  onClick={handleDownloadDocx}
                  disabled={isExportingWord}
                  className="text-[12px] bg-primary text-on-primary font-medium rounded-md px-3.5 py-1.5 hover:bg-primary-active transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 font-sans"
                  title="Unduh berkas .docx resmi"
                >
                  <Download size={14} />
                  <span>{isExportingWord ? "Menyiapkan..." : "Unduh Word (.docx)"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 mt-6 print:p-0 print:m-0 print:max-w-full">
            {/* Title & Info Bar (Hidden on print) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print:hidden">
              <div>
                <span className="bg-surface-cream-strong text-ink text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {currentData?.modelPembelajaran?.namaModel || "Kurikulum Merdeka"}
                </span>
                <h1 className="font-display text-[28px] sm:text-[32px] font-semibold text-on-dark mt-2 tracking-tight">
                  {currentData.informasiUmum.mataPelajaran 
                    ? `Modul Ajar: ${currentData.informasiUmum.mataPelajaran} (Kelas ${currentData.informasiUmum.kelas})`
                    : moduleTitle}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-on-dark-soft bg-surface-dark-elevated px-3 py-1.5 rounded-md border border-surface-dark-soft">
                <Sparkles size={14} className="text-primary" />
                <span>Standar BSKAP</span>
              </div>
            </div>

            {/* AI Disclaimer Banner (Hidden on print) */}
            <div className="bg-accent-amber-light border-l-[3px] border-accent-amber rounded-r-md p-3.5 mb-6 print:hidden">
              <p className="text-[13px] text-body">
                <strong>Catatan Guru:</strong> Periksa dan sesuaikan isi dokumen dengan kondisi kelas sebelum pelaksanaan pembelajaran.
              </p>
            </div>

            {/* Tab Content */}
            {activeTab === "preview" ? (
              <OfficialTablePreview
                data={currentData}
                onUpdateData={handleUpdateStructuredData}
                onDownloadDocx={handleDownloadDocx}
                isExporting={isExportingWord}
              />
            ) : (
              <div className="w-full">
                <div className="mb-3 text-[13px] text-on-dark-soft flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className="text-primary hover:underline text-[12px] flex items-center gap-1 cursor-pointer"
                  >
                    Lihat Format Resmi ➔
                  </button>
                </div>
                <TipTapEditor
                  initialContent={contentHtml || `
                    <h1>Modul Ajar: ${currentData.informasiUmum.mataPelajaran || "Mata Pelajaran"}</h1>
                    <p><strong>Penyusun:</strong> ${currentData.informasiUmum.namaPenyusun} (${currentData.informasiUmum.namaInstitusi})</p>
                    <p><strong>Fase / Kelas:</strong> Fase ${currentData.informasiUmum.fase} / Kelas ${currentData.informasiUmum.kelas}</p>
                    <hr/>
                    <h2>Tujuan Pembelajaran</h2>
                    <p>${currentData.tujuanPembelajaran.faseCP}</p>
                  `}
                  onChange={(newHtml) => {
                    setContentHtml(newHtml);
                    try {
                      localStorage.setItem("modulin_active_html", newHtml);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
