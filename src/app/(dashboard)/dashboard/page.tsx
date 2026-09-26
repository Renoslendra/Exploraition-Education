"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Download,
  ArrowRight,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  BadgeCheck,
  Check,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  User,
} from "lucide-react";
import type { StructuredModulAjarData } from "@/types/modul";

export default function DashboardPage() {
  const router = useRouter();

  // State
  const [activeModule, setActiveModule] = useState<StructuredModulAjarData | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("Modul Ajar");
  const [isExported, setIsExported] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    try {
      const savedStructured = localStorage.getItem("modulin_active_structured");
      const savedTitle = localStorage.getItem("modulin_active_title");
      const savedExported = localStorage.getItem("modulin_exported") === "true";
      const savedEdited = localStorage.getItem("modulin_edited") === "true";

      if (savedStructured) {
        setActiveModule(JSON.parse(savedStructured));
      }
      if (savedTitle) {
        setModuleTitle(savedTitle);
      }
      setIsExported(savedExported);
      setIsEdited(savedEdited);

      // Sinkronisasi modul dari cloud database jika tersedia
      fetch("/api/modules")
        .then((res) => res.json())
        .then((resData) => {
          if (resData?.success && Array.isArray(resData?.data) && resData.data.length > 0) {
            const first = resData.data[0];
            if (first?.structured_data) {
              setActiveModule((prev) => prev || first.structured_data);
              setModuleTitle(`Modul Ajar: ${first.mata_pelajaran} Kelas ${first.kelas}`);
            }
          }
        })
        .catch(() => {});
    } catch (err) {
      console.error("Error reading from localStorage:", err);
    }
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadDocx = async (data: StructuredModulAjarData) => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/modules/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Gagal mengunduh file DOCX.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeMapel = (data.informasiUmum.mataPelajaran || "Modul").replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `Modul_Ajar_${safeMapel}_Kelas_${data.informasiUmum.kelas}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update exported status
      localStorage.setItem("modulin_exported", "true");
      setIsExported(true);

      showToast("File Word (.docx) berhasil diunduh.");
    } catch (err: any) {
      console.error(err);
      alert("Gagal mengunduh file: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditorClick = () => {
    localStorage.setItem("modulin_edited", "true");
    setIsEdited(true);
  };

  if (!mounted) return null;

  const todayDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dailyTipIndex = new Date().getDay();
  const tips = [
    "Fase D mencakup kelas 7 sampai 9 SMP. Tujuan Pembelajaran harus merujuk CP Fase D, bukan per kelas.",
    "PBL berakhir pada solusi atau ide. PjBL berakhir pada produk nyata yang bisa dipegang atau dipresentasikan.",
    "Pertanyaan pemantik yang baik tidak bisa dijawab dengan ya atau tidak. Mulai dengan Mengapa atau Bagaimana.",
    "Profil Pelajar Pancasila bukan hiasan. Pilih 2 hingga 3 dimensi yang benar-benar tercermin dalam kegiatan pembelajaran.",
    "Asesmen formatif tidak harus berupa kuis. Observasi diskusi kelompok juga valid sebagai data capaian.",
    "Diferensiasi proses artinya cara guru menyampaikan berbeda, bukan soalnya yang berbeda.",
    "LKPD yang baik memandu siswa berpikir, bukan sekadar mengisi titik-titik.",
  ];
  const todayTip = tips[dailyTipIndex];

  const models = [
    { code: "pbl", name: "Problem-Based Learning", desc: "Pemecahan masalah nyata yang berakhir pada solusi.", label: "Model 01" },
    { code: "pjbl", name: "Project-Based Learning", desc: "Pemecahan masalah nyata yang berakhir pada produk.", label: "Model 02" },
    { code: "dl", name: "Discovery Learning", desc: "Penemuan konsep secara mandiri melalui eksplorasi.", label: "Model 03" },
    { code: "il", name: "Inquiry Learning", desc: "Penyelidikan ilmiah berbasis pertanyaan.", label: "Model 04" },
    { code: "cooperative", name: "Cooperative Learning", desc: "Kolaborasi terstruktur dalam kelompok kecil.", label: "Model 05" },
    { code: "circ", name: "CIRC", desc: "Literasi membaca dan menulis secara kooperatif.", label: "Model 06" },
  ];

  const faqs = [
    {
      q: "Apa itu Fase dalam Kurikulum Merdeka?",
      a: "Fase mengelompokkan capaian pembelajaran berdasarkan rentang kelas, bukan per kelas. Fase D misalnya mencakup kelas 7, 8, dan 9 sekaligus. Guru menyusun modul berdasarkan fase, bukan kelas spesifik.",
    },
    {
      q: "Apa bedanya PBL dan PjBL?",
      a: "PBL (Problem-Based Learning) berakhir pada solusi atau rekomendasi. PjBL (Project-Based Learning) berakhir pada produk nyata yang bisa dilihat, dipegang, atau dipresentasikan. Keduanya dimulai dari masalah, tapi arahnya berbeda.",
    },
    {
      q: "Apa itu format BSKAP?",
      a: "BSKAP adalah Badan Standar, Kurikulum, dan Asesmen Pendidikan. Format BSKAP No. 032/H/KR/2024 adalah panduan resmi struktur modul ajar Kurikulum Merdeka yang terdiri dari tiga komponen: Informasi Umum, Komponen Inti, dan Lampiran.",
    },
    {
      q: "Apa itu Capaian Pembelajaran?",
      a: "Capaian Pembelajaran (CP) adalah kompetensi yang harus dicapai peserta didik di akhir fase. CP menggantikan KI dan KD dari Kurikulum 2013. Guru menjabarkan CP menjadi Tujuan Pembelajaran (TP) lalu menyusun Alur Tujuan Pembelajaran (ATP).",
    },
    {
      q: "Apa itu Profil Pelajar Pancasila?",
      a: "Profil Pelajar Pancasila adalah enam dimensi karakter yang ingin dikembangkan: Beriman dan Bertakwa, Berkebinekaan Global, Bergotong Royong, Mandiri, Bernalar Kritis, dan Kreatif. Modul ajar harus mencantumkan dimensi mana yang relevan dengan kegiatan pembelajaran.",
    },
    {
      q: "Apa bedanya modul ajar dan RPP?",
      a: "RPP (Rencana Pelaksanaan Pembelajaran) adalah dokumen perencanaan satu pertemuan dari Kurikulum 2013. Modul ajar Kurikulum Merdeka lebih lengkap: mencakup identitas, CP, TP, kegiatan pembelajaran per pertemuan, asesmen, dan lampiran seperti LKPD dan rubrik.",
    },
    {
      q: "Apakah modul ajar harus sama untuk semua kelas dalam satu fase?",
      a: "Tidak harus. Fase D misalnya mencakup kelas 7 hingga 9, tapi guru bisa menyusun modul per kelas sesuai kedalaman materi. Yang penting, Tujuan Pembelajaran tetap mengacu pada CP Fase D yang sama.",
    },
  ];

  // Helper for staggered animations
  const fadeItem = (delayIndex: number) => `animate-fade-in-up delay-[${delayIndex * 60}ms] fill-mode-both`;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 300ms ease-out forwards;
        }
        .fill-mode-both {
          animation-fill-mode: both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .delay-\\[0ms\\] { animation-delay: 0ms; }
        .delay-\\[60ms\\] { animation-delay: 60ms; }
        .delay-\\[120ms\\] { animation-delay: 120ms; }
        .delay-\\[180ms\\] { animation-delay: 180ms; }
        .delay-\\[240ms\\] { animation-delay: 240ms; }
        .delay-\\[300ms\\] { animation-delay: 300ms; }
        .delay-\\[360ms\\] { animation-delay: 360ms; }
        .delay-\\[420ms\\] { animation-delay: 420ms; }
        
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(42, 125, 110, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(42, 125, 110, 0); }
          100% { box-shadow: 0 0 0 0 rgba(42, 125, 110, 0); }
        }
        .animate-subtle-pulse {
          animation: subtlePulse 2s infinite;
        }
      `}</style>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2a7d6e] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up text-[14px]">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================== ZONA 1: ORIENTASI ==================== */}
      <div className="w-full bg-[#faf8f4] border-b border-[#e2dbd0] py-8 px-4">
        <div className="max-w-5xl mx-auto w-full">
          {/* 1A. Greeting Header */}
          <div className={`flex flex-col md:flex-row md:items-start justify-between gap-6 ${fadeItem(0)}`}>
            <div>
              <div className="text-[11px] font-inter uppercase tracking-wide text-[#6b6862] mb-2">
                {todayDate}
              </div>
              <h1 className="font-display text-[36px] font-semibold text-[#1a1917] mb-1">
                Selamat datang kembali.
              </h1>
              <p className="text-[14px] font-inter text-[#444340]">
                Lanjutkan menyusun modul ajar atau mulai yang baru.
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#2a7d6e] text-white rounded-md px-5 h-[40px] text-[14px] font-medium hover:bg-[#1f6358] transition-colors shadow-sm self-start"
            >
              <Plus size={16} />
              <span>Buat Modul Baru</span>
            </Link>
          </div>

          {/* 1B. Stats Strip */}
          <div className={`mt-6 bg-[#f0ebe0] rounded-xl p-5 md:px-8 md:py-5 flex flex-col md:flex-row gap-6 md:gap-0 justify-between ${fadeItem(1)}`}>
            <div className="flex-1 flex items-start gap-3">
              <FileText className="text-[#2a7d6e] shrink-0" size={20} />
              <div>
                <div className="text-[11px] font-inter uppercase text-[#6b6862] mb-1">Modul Aktif</div>
                <div className="text-[15px] font-inter font-semibold text-[#1a1917]">{activeModule ? "1" : "0"}</div>
              </div>
            </div>
            <div className="hidden md:block w-[1px] bg-[#e2dbd0] mx-6"></div>
            <div className="flex-1 flex items-start gap-3">
              <BadgeCheck className="text-[#2a7d6e] shrink-0" size={20} />
              <div>
                <div className="text-[11px] font-inter uppercase text-[#6b6862] mb-1">Format</div>
                <div className="text-[15px] font-inter font-semibold text-[#1a1917]">BSKAP Resmi</div>
              </div>
            </div>
            <div className="hidden md:block w-[1px] bg-[#e2dbd0] mx-6"></div>
            <div className="flex-1 flex items-start gap-3">
              <Download className={!activeModule ? "text-[#a09b93] shrink-0" : isExported ? "text-[#2a7d6e] shrink-0" : "text-[#d4940a] shrink-0"} size={20} />
              <div>
                <div className="text-[11px] font-inter uppercase text-[#6b6862] mb-1">Status Ekspor</div>
                <div className={`text-[15px] font-inter font-semibold ${!activeModule ? "text-[#a09b93]" : isExported ? "text-[#2a7d6e]" : "text-[#d4940a]"}`}>
                  {!activeModule ? "Tidak Ada Modul" : isExported ? "Sudah Diekspor" : "Belum Diekspor"}
                </div>
              </div>
            </div>
            <div className="hidden md:block w-[1px] bg-[#e2dbd0] mx-6"></div>
            <div className="flex-1 flex items-start gap-3">
              <BookOpen className="text-[#2a7d6e] shrink-0" size={20} />
              <div>
                <div className="text-[11px] font-inter uppercase text-[#6b6862] mb-1">Kurikulum</div>
                <div className="text-[15px] font-inter font-semibold text-[#1a1917]">Merdeka</div>
              </div>
            </div>
          </div>

          {/* 1C. Progress Indicator */}
          {activeModule && (
            <div className={`mt-5 ${fadeItem(2)}`}>
              <div className="flex items-center w-full max-w-2xl mx-auto md:mx-0">
                {/* Step 1: Generate */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#2a7d6e] flex items-center justify-center text-white">
                    <Check size={14} />
                  </div>
                  <div className="text-[12px] font-inter text-[#2a7d6e] mt-2 absolute top-6 whitespace-nowrap">Generate</div>
                </div>

                <div className={`flex-1 h-[2px] mx-2 ${isEdited ? 'bg-[#2a7d6e]' : 'bg-[#e2dbd0]'}`}></div>

                {/* Step 2: Edit */}
                <div className="flex flex-col items-center relative z-10">
                  {isEdited ? (
                    <div className="w-6 h-6 rounded-full bg-[#2a7d6e] flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#2a7d6e] bg-[#faf8f4] flex items-center justify-center text-[11px] font-bold text-[#1a1917] animate-subtle-pulse">
                      2
                    </div>
                  )}
                  <div className={`text-[12px] font-inter mt-2 absolute top-6 whitespace-nowrap ${isEdited ? 'text-[#2a7d6e]' : 'text-[#1a1917] font-semibold'}`}>Edit</div>
                </div>

                <div className={`flex-1 h-[2px] mx-2 ${isExported ? 'bg-[#2a7d6e]' : 'bg-[#e2dbd0]'}`}></div>

                {/* Step 3: Ekspor */}
                <div className="flex flex-col items-center relative z-10">
                  {isExported ? (
                    <div className="w-6 h-6 rounded-full bg-[#2a7d6e] flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${isEdited ? 'border-[#2a7d6e] text-[#1a1917] bg-[#faf8f4] animate-subtle-pulse' : 'border-[#e2dbd0] text-[#6b6862] bg-[#faf8f4]'}`}>
                      3
                    </div>
                  )}
                  <div className={`text-[12px] font-inter mt-2 absolute top-6 whitespace-nowrap ${isExported ? 'text-[#2a7d6e]' : (isEdited ? 'text-[#1a1917] font-semibold' : 'text-[#6b6862]')}`}>Ekspor</div>
                </div>
              </div>

              <div className="mt-9 text-[12px] font-inter text-[#6b6862]">
                {!isEdited ? "Tinjau dan sesuaikan konten modul sebelum diekspor." : !isExported ? "Modul siap diunduh dalam format Word (DOCX)." : "Modul telah berhasil diekspor."}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 py-12">
        {/* ==================== ZONA 2: KERJA ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* 2A. Kolom Kiri: Modul Aktif (8 cols) */}
          <div className="md:col-span-8 flex flex-col">
            <div className={`text-[11px] font-inter uppercase tracking-wide text-[#6b6862] mb-3 ${fadeItem(3)}`}>Modul Ajar Saya</div>
            
            {activeModule ? (
              <div className={`bg-[#f0ebe0] border border-[#e2dbd0] rounded-xl p-8 hover:shadow-[0_4px_16px_rgba(26,25,23,0.08)] hover:-translate-y-[2px] transition-all duration-200 ${fadeItem(4)}`}>
                <div className="flex items-center gap-3">
                  <div className="bg-[#e6f3f0] text-[#2a7d6e] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                    {activeModule.modelPembelajaran?.namaModel || "Kurikulum Merdeka"}
                  </div>
                  <div className="bg-[#e8e1d3] text-[#6b6862] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                    Fase {activeModule.informasiUmum.fase}
                  </div>
                </div>

                <h2 className="font-display text-[28px] font-semibold text-[#1a1917] mt-3">
                  {activeModule.informasiUmum.mataPelajaran ? `Modul Ajar: ${activeModule.informasiUmum.mataPelajaran}` : moduleTitle}
                </h2>

                <div className="text-[13px] font-inter text-[#6b6862] mt-1">
                  {activeModule.informasiUmum.namaInstitusi} &middot; Kelas {activeModule.informasiUmum.kelas} &middot; TA {activeModule.informasiUmum.tahunPenyusunan || "2026/2027"}
                </div>

                <div className="h-[1px] bg-[#e2dbd0] my-4"></div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-inter text-[#a09b93] mb-1">
                      <BookOpen size={14} className="text-[#2a7d6e]" />
                      <span>Materi</span>
                    </div>
                    <div className="text-[13px] font-inter text-[#444340] line-clamp-2">
                      {activeModule.materiAlatBahan?.materiUtama || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-inter text-[#a09b93] mb-1">
                      <User size={14} className="text-[#2a7d6e]" />
                      <span>Penyusun</span>
                    </div>
                    <div className="text-[13px] font-inter text-[#444340] line-clamp-2">
                      {activeModule.informasiUmum.namaPenyusun}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-inter text-[#a09b93] mb-1">
                      <Clock size={14} className="text-[#2a7d6e]" />
                      <span>Alokasi Waktu</span>
                    </div>
                    <div className="text-[13px] font-inter text-[#444340] line-clamp-2">
                      {activeModule.informasiUmum.alokasiWaktu}
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#e2dbd0] my-4"></div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/editor"
                    onClick={handleEditorClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2a7d6e] text-white rounded-md h-[44px] text-[14px] font-medium hover:bg-[#1f6358] transition-colors"
                  >
                    Buka di Editor
                  </Link>
                  <button
                    onClick={() => handleDownloadDocx(activeModule)}
                    disabled={isExporting}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#e2dbd0] bg-transparent text-[#1a1917] rounded-md h-[44px] text-[14px] font-medium hover:bg-[#e8e1d3] transition-colors disabled:opacity-50"
                  >
                    <Download size={16} />
                    <span>{isExporting ? "Memproses..." : "Unduh Word"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={`bg-[#f0ebe0] border border-dashed border-[#e2dbd0] rounded-xl p-12 text-center flex flex-col items-center ${fadeItem(4)}`}>
                <div className="relative w-[120px] h-[100px] mb-6 mx-auto">
                  {/* Card back */}
                  <div className="absolute inset-x-4 top-0 h-[80px] bg-[#faf8f4] border border-[#e2dbd0] rounded-lg opacity-40 transform scale-90"></div>
                  {/* Card middle */}
                  <div className="absolute inset-x-2 top-2 h-[80px] bg-[#faf8f4] border border-[#e2dbd0] rounded-lg opacity-70 transform scale-95"></div>
                  {/* Card front */}
                  <div className="absolute inset-x-0 top-4 h-[80px] bg-[#faf8f4] border border-[#e2dbd0] rounded-lg shadow-sm p-3 flex flex-col gap-2">
                    <div className="w-8 h-2 bg-[#2a7d6e] rounded-sm opacity-80"></div>
                    <div className="w-3/4 h-1.5 bg-[#e8e1d3] rounded-sm mt-1"></div>
                    <div className="w-1/2 h-1.5 bg-[#e8e1d3] rounded-sm"></div>
                  </div>
                </div>
                <h2 className="font-display text-[22px] font-semibold text-[#1a1917] mb-2">Belum ada modul ajar.</h2>
                <p className="text-[14px] font-inter text-[#6b6862] mb-6 max-w-sm">Buat modul pertamamu dan hemat hingga 5 jam kerja administratif.</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-[#2a7d6e] text-white rounded-md px-6 h-[44px] text-[14px] font-medium hover:bg-[#1f6358] transition-colors"
                >
                  <Plus size={16} />
                  <span>Buat Modul Ajar</span>
                </Link>
              </div>
            )}
          </div>

          {/* 2B. Kolom Kanan: Quick Actions Panel (4 cols) */}
          <div className="md:col-span-4 flex flex-col">
            <div className={`text-[11px] font-inter uppercase tracking-wide text-[#6b6862] mb-3 ${fadeItem(4)}`}>Aksi Cepat</div>
            
            <div className={`bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-6 ${fadeItem(5)}`}>
              <Link
                href={activeModule ? "/editor" : "#"}
                onClick={(e) => {
                  if (!activeModule) e.preventDefault();
                  else handleEditorClick();
                }}
                className={`flex items-center justify-center gap-2 w-full h-[48px] rounded-md mb-2 transition-colors ${activeModule ? "bg-[#e6f3f0] text-[#2a7d6e] hover:bg-[#d5ebe5]" : "bg-[#e6f3f0] text-[#2a7d6e] opacity-40 cursor-not-allowed"}`}
              >
                <span className="text-[14px] font-medium">Lanjut Edit Modul</span>
                <ArrowRight size={16} />
              </Link>
              
              <button
                onClick={() => activeModule && handleDownloadDocx(activeModule)}
                disabled={!activeModule || isExporting}
                className={`flex items-center justify-center gap-2 w-full h-[48px] border border-[#e2dbd0] bg-[#faf8f4] text-[#1a1917] rounded-md mb-2 transition-colors ${activeModule ? "hover:bg-[#e8e1d3]" : "opacity-40 cursor-not-allowed"}`}
              >
                <Download size={16} />
                <span className="text-[14px] font-medium">{isExporting ? "Memproses..." : "Unduh Word Sekarang"}</span>
              </button>
              
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 w-full h-[48px] bg-[#2a7d6e] text-white rounded-md hover:bg-[#1f6358] transition-colors"
              >
                <Plus size={16} />
                <span className="text-[14px] font-medium">Buat Modul Baru</span>
              </Link>

              {activeModule && !isExported && (
                <>
                  <div className="h-[1px] bg-[#e2dbd0] my-4"></div>
                  <div className="bg-[#fef8e8] border-l-3 border-[#d4940a] rounded-md rounded-l-none p-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <AlertCircle size={14} className="text-[#d4940a] shrink-0 mt-0.5" />
                      <p className="text-[12px] font-inter text-[#444340] leading-snug">
                        Modul ini belum diekspor. Unduh sebagai Word atau PDF sebelum digunakan di kelas.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDownloadDocx(activeModule)}
                      className="text-[12px] font-inter text-[#2a7d6e] text-left hover:underline w-fit self-start ml-5"
                    >
                      Unduh Sekarang
                    </button>
                  </div>
                </>
              )}

              <div className="h-[1px] bg-[#e2dbd0] my-4"></div>

              <div>
                <div className="text-[10px] font-inter uppercase tracking-wide text-[#a09b93] mb-2">Tips Hari Ini</div>
                <div className="flex gap-2">
                  <Lightbulb size={14} className="text-[#2a7d6e] shrink-0 mt-0.5" />
                  <p className="text-[13px] font-inter text-[#444340] leading-[1.6]">
                    {todayTip}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==================== ZONA 3: PENDUKUNG ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 3A. Section Model Pembelajaran */}
          <div className={`lg:col-span-7 ${fadeItem(6)}`}>
            <div className="mb-4">
              <h3 className="text-[11px] font-inter uppercase tracking-wide text-[#6b6862]">Mulai dengan Model Pembelajaran</h3>
              <p className="text-[13px] font-inter text-[#a09b93]">Pilih model dan langsung buat modul baru.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {models.map((m) => (
                <div 
                  key={m.code}
                  onClick={() => router.push(`/create?model=${m.code}`)}
                  className="group bg-[#faf8f4] border border-[#e2dbd0] rounded-lg p-4 md:px-5 md:py-4 cursor-pointer hover:border-[#2a7d6e] hover:bg-[#e6f3f0] hover:-translate-y-[2px] transition-all duration-150 flex flex-col"
                >
                  <div className="text-[10px] font-inter uppercase text-[#2a7d6e] font-semibold mb-2">{m.label}</div>
                  <div className="font-display text-[18px] font-semibold text-[#1a1917] mb-1">{m.name}</div>
                  <div className="text-[12px] font-inter text-[#a09b93] line-clamp-1 mb-3 flex-1">{m.desc}</div>
                  <div className="self-end mt-auto text-[#2a7d6e]">
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3B. Section Panduan Cepat */}
          <div className={`lg:col-span-5 ${fadeItem(7)}`}>
            <div className="mb-4">
              <h3 className="text-[11px] font-inter uppercase tracking-wide text-[#6b6862]">Panduan Cepat</h3>
              <p className="text-[13px] font-inter text-[#a09b93]">Pertanyaan umum seputar Kurikulum Merdeka.</p>
            </div>

            <div className="border-t border-[#e2dbd0]">
              {faqs.map((faq, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={idx} className="border-b border-[#e2dbd0] py-4">
                    <button 
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="text-[14px] font-inter font-medium text-[#1a1917] pr-4">{faq.q}</span>
                      <ChevronDown size={16} className={`text-[#a09b93] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div 
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                    >
                      <p className="text-[13px] font-inter text-[#444340] leading-[1.7] pt-2 pb-1">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
