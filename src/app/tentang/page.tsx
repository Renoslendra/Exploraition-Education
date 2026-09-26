"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, Sparkles, Target, BookOpen, Clock, Award, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const TENTANG_FAQS = [
  {
    q: "Apa itu Modulin?",
    a: "Modulin adalah platform cerdas berbasis AI yang dirancang khusus untuk membantu Guru Indonesia menyusun Modul Ajar dan RPP berstandar Kurikulum Merdeka secara otomatis, cepat, dan presisi."
  },
  {
    q: "Siapa yang membuat Modulin?",
    a: "Modulin dikembangkan oleh tim Exploraition untuk memberikan solusi praktis dalam mengurangi beban administrasi guru, khususnya dalam penyusunan format BSKAP resmi yang siap supervisi."
  },
  {
    q: "Apakah modul yang dihasilkan sesuai standar?",
    a: "Tentu saja. Format akhir yang dihasilkan oleh Modulin telah disesuaikan dengan standar regulasi BSKAP terbaru dari Kemendikbudristek untuk memastikan kelengkapan komponen."
  },
  {
    q: "Apakah Modulin dapat disunting secara manual?",
    a: "Ya! Setelah AI menyusun draf modul, Anda memiliki akses penuh ke Editor Teks Instan untuk menambah, mengurangi, atau memodifikasi tabel & komponen sesuai kebutuhan kelas."
  }
];

const STATS_DATA = [
  { icon: Clock, label: "Waktu Hemat", value: "< 15 Menit", desc: "Dari input hingga cetak" },
  { icon: BookOpen, label: "Model Belajar", value: "6 Model", desc: "PBL, PjBL, Discovery, dll." },
  { icon: ShieldCheck, label: "Kesesuaian", value: "100% BSKAP", desc: "Standar resmi Kemendikbud" },
  { icon: Award, label: "Format Ekspor", value: "DOCX & PDF", desc: "Siap disunting & diprint" },
];

const NILAI_UTAMA = [
  {
    icon: Target,
    title: "Presisi Pedagogik",
    desc: "Komponen Capaian dan Tujuan Pembelajaran diturunkan secara logis sesuai fase dan indikator Kurikulum Merdeka."
  },
  {
    icon: Sparkles,
    title: "Efisiensi Berbasis AI",
    desc: "Memangkas durasi penyusunan dokumen dari hitungan jam menjadi hitungan menit tanpa mengurangi keakuratan substansi."
  },
  {
    icon: HeartHandshake,
    title: "Berpihak Pada Guru",
    desc: "Dirancang sederhana dan intuitif agar guru dapat lebih fokus pada interaksi mendidik siswa di kelas."
  }
];

export default function TentangPage() {
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
            alt="Modulin Hero Banner"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            unoptimized={true}
          />

          {/* Overlay Gradient for optimal readability and seamless top color blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a5c50]/90 via-[#1a5c50]/80 to-[#1a5c50]/95 z-[1]" />

          {/* Top Hero Heading & Breadcrumb */}
          <div className="relative z-10 text-center flex flex-col items-center my-auto pt-4 animate-fade-in-up max-w-5xl">
            <div className="text-[13px] text-white/90 mb-6 font-inter inline-flex items-center bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
              <Link href="/" className="hover:text-white transition-colors font-medium">Beranda</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white font-semibold">Tentang Kami</span>
            </div>

            <h1 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-6 max-w-3xl leading-[1.15] drop-shadow-md">
              Mengenal <span className="text-[#facc15] italic underline decoration-white/40 decoration-wavy underline-offset-4">Modulin</span> Lebih Dekat
            </h1>
            <p className="text-white/90 text-[16px] md:text-[20px] max-w-2xl leading-relaxed mb-10 drop-shadow-sm">
              Modulin hadir sebagai asisten penyusunan modul ajar yang didesain khusus 
              untuk memenuhi kebutuhan administratif Guru Indonesia di era Kurikulum Merdeka.
            </p>

            {/* Dynamic Stats Grid inside Section 1 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl">
              {STATS_DATA.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#facc15] text-[#1a5c50] flex items-center justify-center mb-4 font-bold shadow-sm">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-[#facc15] uppercase tracking-wider mb-1">
                        {stat.label}
                      </div>
                      <p className="text-[12px] text-white/80 leading-tight">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gentle Scroll Down Cue */}
          <div className="relative z-10 pt-6 pb-2 text-center text-xs text-white/80 flex flex-col items-center gap-1 animate-bounce">
            <ChevronDown size={20} className="text-[#facc15]" />
          </div>
        </section>

        {/* ==================== SECTION 2: PRINSIP DAN KEUNGGULAN (ON SCROLL) ==================== */}
        <section className="w-full bg-white border-y border-[#e2dbd0] py-20 md:py-28 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display font-semibold text-3xl md:text-5xl text-[#1a1917] mb-3">
                Prinsip dan Keunggulan Modulin
              </h2>
              <p className="text-sm md:text-base text-[#6b6862]">
                Fondasi pedagogik yang membedakan Modulin dalam membantu penyusunan dokumen pembelajaran resmi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {NILAI_UTAMA.map((nilai, idx) => {
                const Icon = nilai.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#faf8f4] rounded-2xl p-8 border border-[#e2dbd0] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#e6f3f0]/50 rounded-full blur-xl group-hover:bg-[#2a7d6e]/20 transition-all duration-500" />
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#e2dbd0] text-[#1a5c50] flex items-center justify-center mb-6 group-hover:bg-[#1a5c50] group-hover:text-white group-hover:border-[#1a5c50] transition-all duration-300 shadow-2xs">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-display font-semibold text-xl md:text-2xl text-[#1a1917] mb-3">
                        {nilai.title}
                      </h3>
                      <p className="text-[#6b6862] text-[14px] md:text-[15px] leading-relaxed">
                        {nilai.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 3: FAQ PERTANYAAN ==================== */}
        <section className="w-full bg-[#faf8f4] py-20 md:py-28 px-4 md:px-6 border-b border-[#e2dbd0]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-[#e2dbd0] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#e2dbd0] gap-4">
                <div>
                  <h2 className="font-display font-semibold text-2xl md:text-4xl text-[#1a1917] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#1a5c50] text-white flex items-center justify-center text-sm font-bold shadow-sm">?</span>
                    Pertanyaan Seputar Platform
                  </h2>
                  <p className="text-xs text-[#6b6862] mt-1">
                    Jawaban atas hal-hal yang sering ditanyakan pengajar.
                  </p>
                </div>
                <span className="text-xs bg-[#e6f3f0] text-[#2a7d6e] px-3.5 py-1.5 rounded-full font-medium border border-[#2a7d6e]/20 self-start md:self-auto">
                  {TENTANG_FAQS.length} Pertanyaan Populer
                </span>
              </div>

              <div className="space-y-3">
                {TENTANG_FAQS.map((faq, idx) => {
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
                        className="w-full flex items-center justify-between p-5 text-left font-inter font-semibold text-[#1a1917] text-[15px] md:text-[16px] cursor-pointer"
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

        {/* ==================== SECTION 4: CTA BANNER ==================== */}
        <section className="w-full bg-[#faf8f4] py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-r from-[#1a5c50] via-[#2a7d6e] to-[#1f6358] p-8 md:p-14 text-white shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                  <span className="text-xs uppercase tracking-widest text-[#facc15] font-semibold">
                    Siap Menghemat Waktu?
                  </span>
                  <h3 className="font-display font-bold text-2xl md:text-4xl text-white mt-1 mb-3">
                    Buat Modul Ajar Pertama Anda Sekarang
                  </h3>
                  <p className="text-white/80 text-sm md:text-base font-normal leading-relaxed">
                    Hanya butuh 3 langkah sederhana untuk mendapatkan modul kedinasan lengkap.
                  </p>
                </div>
                <Link
                  href="/create"
                  className="group h-13 px-9 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-sm rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 shrink-0 cursor-pointer"
                >
                  <span>Coba Sekarang</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


