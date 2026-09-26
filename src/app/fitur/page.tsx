"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, Sparkles, LayoutList, PenSquare, Download, Layers, CheckCircle2, ArrowRight, FileCheck, Bot, ChevronDown as ScrollArrow } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FITUR_FAQS = [
  {
    q: "Berapa lama waktu untuk membuat satu modul?",
    a: "Anda hanya membutuhkan waktu kurang dari 15 menit. Pilih model, masukkan identitas, dan Modulin akan merancang komponen inti seperti Capaian Pembelajaran secara otomatis."
  },
  {
    q: "Format apa saja yang bisa diunduh?",
    a: "Anda dapat mengekspor Modul Ajar dalam bentuk Word (.docx) untuk disunting kembali, atau PDF (.pdf) untuk langsung dicetak dan diserahkan."
  },
  {
    q: "Apakah tersedia untuk semua mata pelajaran?",
    a: "Ya, Modulin mencakup seluruh rentang jenjang (Fase A hingga F) dan dapat disesuaikan untuk berbagai mata pelajaran di Kurikulum Merdeka."
  },
  {
    q: "Apakah saya bisa mengedit hasilnya?",
    a: "Tentu saja! Setelah draf modul selesai dibuat, Anda akan masuk ke halaman Editor Modul Instan di mana Anda dapat merevisi teks, menambah tabel, atau menyesuaikan alur sebelum mengekspornya."
  }
];

const FITUR_UTAMA = [
  {
    id: "auto-drafting",
    icon: Sparkles,
    badge: "Otomatisasi",
    title: "Penyusunan Otomatis",
    desc: "Komponen utama seperti Capaian Pembelajaran, Tujuan Pembelajaran, hingga Kegiatan Inti dirancang otomatis dan presisi.",
    details: ["Penyesuaian Fase & Kelas", "Sintaks Model Terintegrasi", "Pertanyaan Pemantik Otomatis"]
  },
  {
    id: "bskap-standard",
    icon: LayoutList,
    badge: "Kedinasan",
    title: "Format Resmi BSKAP",
    desc: "Keluaran dokumen disusun persis mengikuti struktur panduan BSKAP Kemendikbudristek No. 032/H/KR/2024.",
    details: ["Tabel Identitas Resmi", "Rubrik Asesmen Lengkap", "Lembar Pengesahan Siap Cetak"]
  },
  {
    id: "instant-editor",
    icon: PenSquare,
    badge: "Fleksibel",
    title: "Editor Modul Instan",
    desc: "Anda bisa langsung merevisi hasil, menambah baris tabel, atau mengubah gaya bahasa langsung dari editor visual.",
    details: ["Real-time TipTap Editor", "Format Teks Kaya", "Autosave Ke Memori Lokal"]
  },
  {
    id: "multi-export",
    icon: Download,
    badge: "Multiformat",
    title: "Ekspor Word & PDF",
    desc: "Satu klik untuk mengunduh dokumen .docx yang rapi tanpa merusak tata letak margin dan font standar kedinasan.",
    details: ["Formatting Native Word", "Pratinjau PDF Langsung", "Bebas Watermark"]
  },
  {
    id: "pedagogic-models",
    icon: Layers,
    badge: "6 Model",
    title: "Sintaks Pedagogik Presisi",
    desc: "Mendukung PBL, PjBL, Discovery, Inquiry Terbimbing, Diferensiasi, hingga Cooperative Learning.",
    details: ["Alur Kegiatan Runtut", "Peran Guru & Siswa Jelas", "HOTS & PPP Terintegrasi"]
  },
  {
    id: "asisten-pedagogik",
    icon: Bot,
    badge: "Interaktif",
    title: "Asisten Pedagogik Virtual",
    desc: "Rekomendasi strategi diferensiasi konten, asesmen formatif, dan pengayaan remedial siap pakai.",
    details: ["Saran Diferensiasi", "Cek Keterpaduan HOTS", "Variasi LKPD Siswa"]
  }
];

export default function FiturPage() {
  const [selectedFitur, setSelectedFitur] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] text-[#1a1917] selection:bg-[#e6f3f0] selection:text-[#1f6358]">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ==================== SECTION 1: HERO (FULL VIEWPORT WITH BACKGROUND) ==================== */}
        <section className="relative min-h-screen w-full flex flex-col justify-between items-center pt-24 pb-12 px-4 md:px-6 overflow-hidden text-white">
          {/* Background Image */}
          <Image
            src="/hero-banner.png"
            alt="Modulin Fitur Banner"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            unoptimized={true}
          />

          {/* Overlay Gradient for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a5c50]/90 via-[#1a5c50]/80 to-[#1a5c50]/95 z-[1]" />

          <div className="relative z-10 text-center flex flex-col items-center my-auto pt-6 max-w-4xl animate-fade-in-up">
            <div className="text-[13px] text-white/90 mb-6 font-inter inline-flex items-center bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
              <Link href="/" className="hover:text-white transition-colors font-medium">Beranda</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white font-semibold">Fitur Unggulan</span>
            </div>

            <h1 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-6 leading-[1.15] drop-shadow-md">
              Fitur yang Dirancang <span className="text-[#facc15] italic underline decoration-white/40 underline-offset-4">Khusus</span> untuk Guru
            </h1>
            <p className="text-white/90 text-[16px] md:text-[20px] max-w-2xl leading-relaxed mb-6 drop-shadow-sm">
              Eksplorasi fungsionalitas di dalam Modulin. Semua fitur ini diciptakan agar Anda dapat 
              fokus pada pengajaran, bukan terjebak dalam administrasi.
            </p>
          </div>

          <div className="relative z-10 pt-4 pb-2 text-center text-xs text-white/80 flex flex-col items-center gap-1 animate-bounce">
            <ScrollArrow size={20} className="text-[#facc15]" />
          </div>
        </section>

        {/* ==================== SECTION 2: FITUR CARDS GRID (ON SCROLL) ==================== */}
        <section className="w-full bg-white border-y border-[#e2dbd0] py-20 md:py-28 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display font-semibold text-3xl md:text-5xl text-[#1a1917] mb-3">
                Kumpulan Fitur Unggulan Modulin
              </h2>
              <p className="text-sm md:text-base text-[#6b6862]">
                Klik pada kartu fitur di bawah untuk melihat pratinjau sistemnya secara langsung.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FITUR_UTAMA.map((fitur, i) => {
                const Icon = fitur.icon;
                const isSelected = selectedFitur === i;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedFitur(i)}
                    className={`group rounded-2xl p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? "bg-[#faf8f4] border-[#2a7d6e] shadow-lg ring-2 ring-[#2a7d6e]/20 -translate-y-1"
                        : "bg-white border-[#e2dbd0] shadow-sm hover:shadow-md hover:border-[#2a7d6e]/40 hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected ? "bg-[#1a5c50] text-white shadow-md scale-105" : "bg-[#e6f3f0] text-[#2a7d6e] group-hover:bg-[#1a5c50] group-hover:text-white"
                        }`}>
                          <Icon size={24} />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#6b6862] border border-[#e2dbd0]">
                          {fitur.badge}
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-xl text-[#1a1917] mb-3 group-hover:text-[#1a5c50] transition-colors">
                        {fitur.title}
                      </h3>
                      <p className="text-[#6b6862] text-[14px] leading-relaxed mb-6">
                        {fitur.desc}
                      </p>
                    </div>

                    <div className="border-t border-[#e2dbd0]/60 pt-4 space-y-2">
                      {fitur.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-[12.5px] text-[#444340] font-medium">
                          <CheckCircle2 size={14} className="text-[#2a7d6e] shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 3: SPOTLIGHT MOCKUP ==================== */}
        <section className="w-full bg-[#1c1b18] text-[#faf8f4] py-20 md:py-28 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="font-display font-semibold text-2xl md:text-4xl text-white mt-1">
                {FITUR_UTAMA[selectedFitur].title}
              </h2>
              <p className="text-sm text-[#a09b93] mt-2">
                {FITUR_UTAMA[selectedFitur].desc}
              </p>
            </div>

            <div className="bg-[#282623] rounded-xl border border-[#383531] p-6 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#383531] pb-3 mb-4 text-xs">
                <span className="text-[#2a7d6e] font-mono font-medium flex items-center gap-2">
                  <FileCheck size={16} /> Modulin System Core
                </span>
                <span className="text-[10px] bg-[#2a7d6e]/20 text-[#2a7d6e] px-2.5 py-0.5 rounded border border-[#2a7d6e]/30">
                  Sistem Aktif
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#a09b93]">
                {FITUR_UTAMA[selectedFitur].details.map((item, idx) => (
                  <div key={idx} className="bg-[#121110] p-3.5 rounded-lg border border-[#383531] flex items-center justify-between">
                    <span className="text-white font-medium">{item}</span>
                    <span className="text-[11px] text-[#2a7d6e] font-mono">Tersedia ✓</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-[#2a7d6e] hover:bg-[#1f6358] text-white text-xs font-bold px-6 py-3 rounded-lg transition-colors shadow-sm"
                >
                  <span>Coba Fitur Ini Sekarang</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 4: FAQ ==================== */}
        <section className="w-full bg-[#faf8f4] py-20 md:py-28 px-4 md:px-6 border-b border-[#e2dbd0]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-[#e2dbd0] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#e2dbd0] gap-4">
                <div>
                  <h2 className="font-display font-semibold text-2xl md:text-3xl text-[#1a1917] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#facc15] text-[#1a1917] flex items-center justify-center text-sm font-bold shadow-sm">★</span>
                    Pertanyaan Seputar Fitur
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {FITUR_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-[#2a7d6e] bg-[#faf8f4] shadow-sm"
                          : "border-[#e2dbd0] bg-white hover:border-[#2a7d6e]/50"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-inter font-semibold text-[#1a1917] text-[15px] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
                          isOpen ? "rotate-180 bg-[#2a7d6e] text-white" : "bg-[#f0ebe0] text-[#6b6862]"
                        }`}>
                          <ChevronDown size={16} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-[#6b6862] text-[14px] leading-relaxed border-t border-[#e2dbd0]/60 animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 5: CTA BANNER ==================== */}
        <section className="w-full bg-[#faf8f4] py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl bg-[#1a5c50] p-8 md:p-12 text-white text-center flex flex-col items-center justify-center shadow-lg">
              <h3 className="font-display font-bold text-2xl md:text-4xl mb-2">
                Mulai Buat Dokumen Pembelajaran Anda
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-xl mb-6">
                Hemat waktu hingga 90% dalam menyusun dokumen pembelajaran Kurikulum Merdeka.
              </p>
              <Link
                href="/create"
                className="h-13 px-9 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-sm rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                Mulai Sekarang — Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}




