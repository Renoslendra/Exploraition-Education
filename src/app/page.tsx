"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  BadgeCheck,
  Download,
  X,
  Check,
  FileText,
  ChevronRight,
  Info,
  Target,
  Users,
  BarChart,
  Clipboard,
  Bot,
  PlusSquare,
  Send,
  ArrowRight,
  ChevronDown,
  Menu
} from "lucide-react";

/* Typewriter Data for Hero Section */
const HERO_TYPEWRITER = {
  label1: "Tujuan Pembelajaran",
  content1:
    "Peserta didik mampu menganalisis interaksi antarkomponen ekosistem dan merancang solusi pelestarian lingkungan secara terstruktur.",
  label2: "Tahap 1: Orientasi Masalah",
  content2:
    "Guru menayangkan video studi kasus abrasi pesisir. Siswa merumuskan pertanyaan penyelidikan mandiri dalam kelompok.",
};

/* 6 Model Pembelajaran Data */
interface ModelDetail {
  id: string;
  name: string;
  description: string;
  steps: string[];
  example: string;
}

const MODELS_DATA: ModelDetail[] = [
  {
    id: "pbl",
    name: "Problem-Based Learning (PBL)",
    description:
      "Pembelajaran berbasis masalah kontekstual untuk mengasah kemampuan investigasi dan nalar kritis siswa.",
    steps: [
      "Orientasi Masalah",
      "Organisasi Belajar",
      "Penyelidikan Mandiri",
      "Penyajian Solusi",
      "Evaluasi Proses",
    ],
    example:
      "Tahap Orientasi Masalah: Siswa mengamati video dokumenter abrasi pesisir utara dan mencatat 3 rumusan persoalan prioritas.",
  },
  {
    id: "pjbl",
    name: "Project-Based Learning (PjBL)",
    description:
      "Pembelajaran berbasis proyek berjadwal yang menghasilkan produk nyata melalui serangkaian tahapan terencana.",
    steps: [
      "Pertanyaan Mendasar",
      "Desain Proyek",
      "Penyusunan Jadwal",
      "Monitoring Karya",
      "Uji Hasil & Evaluasi",
    ],
    example:
      "Tahap Desain Proyek: Setiap kelompok merancang sketsa miniatur tanggul biopori ramah lingkungan serta membagi tugas anggota.",
  },
  {
    id: "dl",
    name: "Discovery Learning",
    description:
      "Pembelajaran melalui observasi dan eksplorasi terarah untuk membuktikan konsep keilmuan secara empiris.",
    steps: [
      "Stimulasi",
      "Identifikasi Masalah",
      "Pengumpulan Data",
      "Pengolahan Data",
      "Pembuktian Konsep",
    ],
    example:
      "Tahap Pengumpulan Data: Siswa menguji derajat keasaman tiga sampel cairan menggunakan kertas lakmus di laboratorium.",
  },
  {
    id: "inquiry",
    name: "Inquiry Terbimbing",
    description:
      "Penyelidikan saintifik terpandu untuk menjawab pertanyaan penelitian melalui eksperimen berbasis bukti.",
    steps: [
      "Orientasi Konteks",
      "Rumusan Masalah",
      "Pengajuan Hipotesis",
      "Eksperimen Lapangan",
      "Kesimpulan Ilmiah",
    ],
    example:
      "Tahap Eksperimen: Siswa menguji pengaruh variasi massa beban terhadap periode ayunan bandul sederhana secara berulang.",
  },
  {
    id: "diferensiasi",
    name: "Pembelajaran Berdiferensiasi",
    description:
      "Penyesuaian konten, proses, dan produk belajar berdasarkan profil kesiapan dan modalitas belajar murid.",
    steps: [
      "Asesmen Awal",
      "Pemetaan Minat",
      "Diferensiasi Proses",
      "Diferensiasi Produk",
      "Refleksi Capaian",
    ],
    example:
      "Tahap Diferensiasi Proses: Siswa visual menelaah diagram infografis siklus rantai makanan, sedangkan siswa auditori mendengarkan rekaman narasi.",
  },
  {
    id: "cooperative",
    name: "Cooperative Learning",
    description:
      "Kerja kelompok terstruktur dengan pembagian peran terencana dan pertanggungjawaban individu.",
    steps: [
      "Penyampaian Tujuan",
      "Penyajian Informasi",
      "Pembentukan Tim",
      "Kerja Kelompok",
      "Evaluasi & Apresiasi",
    ],
    example:
      "Tahap Kerja Kelompok: Setiap anggota tim mendalami satu subtopik ekosistem lalu saling bertukar materi melalui metode Jigsaw.",
  },
];

export default function LandingPage() {
  /* 1. Splash Screen States */
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Reduced Motion Detection */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /* 3. Hero Typewriter States */
  const [typewriterIndex, setTypewriterIndex] = useState(0);

  /* 5. Features Intersection Observer State */
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  /* 6. Editor Preview Document Animation States */
  const [docBlockCount, setDocBlockCount] = useState(0);
  const [docFadingOut, setDocFadingOut] = useState(false);

  /* 7. Stepper States */
  const [activeStep, setActiveStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  /* 8. Learning Models State */
  const [selectedModelId, setSelectedModelId] = useState("pbl");

  /* 9. Scroll State for Navbar */
  const [isScrolled, setIsScrolled] = useState(false);

  /* 10. Hero Headline Typewriter */
  const HERO_WORDS = ["Modul Ajar", "RPP Merdeka", "Bahan Ajar", "Soal Ujian"];
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const [heroText, setHeroText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = HERO_WORDS[heroWordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && heroText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && heroText === "") {
      setIsDeleting(false);
      setHeroWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    } else {
      timeout = setTimeout(() => {
        setHeroText(currentWord.substring(0, heroText.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? 50 : 100);
    }

    return () => clearTimeout(timeout);
  }, [heroText, isDeleting, heroWordIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Initialize reduced motion and Splash Screen Timer */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setShowSplash(false);
      setMainVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setSplashFading(true);
      setMainVisible(true);

      const hideTimer = setTimeout(() => {
        setShowSplash(false);
      }, 400);

      return () => clearTimeout(hideTimer);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  /* Hero Section Typewriter Loop */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const totalChars =
      HERO_TYPEWRITER.label1.length +
      HERO_TYPEWRITER.content1.length +
      HERO_TYPEWRITER.label2.length +
      HERO_TYPEWRITER.content2.length;

    let timeoutId: NodeJS.Timeout;

    if (typewriterIndex < totalChars) {
      timeoutId = setTimeout(() => {
        setTypewriterIndex((prev) => prev + 1);
      }, 28);
    } else {
      // Completed, blink cursor for 1.5s then restart
      timeoutId = setTimeout(() => {
        setTypewriterIndex(0);
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [typewriterIndex, prefersReducedMotion]);

  /* Intersection Observer for Features (Before vs After) */
  useEffect(() => {
    if (!featuresRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  /* Editor Preview Document Fade per Block Loop */
  useEffect(() => {
    if (prefersReducedMotion) {
      setDocBlockCount(5);
      return;
    }

    let timer: NodeJS.Timeout;

    if (docBlockCount < 5 && !docFadingOut) {
      timer = setTimeout(() => {
        setDocBlockCount((prev) => prev + 1);
      }, 1200);
    } else if (docBlockCount === 5 && !docFadingOut) {
      // Hold for 2.0s with blinking cursor, then fade out
      timer = setTimeout(() => {
        setDocFadingOut(true);
      }, 2000);
    } else if (docFadingOut) {
      // Fade out slowly (800ms) and restart from 0
      timer = setTimeout(() => {
        setDocBlockCount(0);
        setDocFadingOut(false);
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [docBlockCount, docFadingOut, prefersReducedMotion]);

  /* Stepper Auto-Advance (3.5s loop, stops on user click) */
  useEffect(() => {
    if (!autoAdvance || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(interval);
  }, [autoAdvance, prefersReducedMotion]);

  /* Helper to calculate typed strings in hero typewriter */
  const l1 = HERO_TYPEWRITER.label1.length;
  const l2 = HERO_TYPEWRITER.content1.length;
  const l3 = HERO_TYPEWRITER.label2.length;
  const l4 = HERO_TYPEWRITER.content2.length;

  const currentLabel1 = prefersReducedMotion
    ? HERO_TYPEWRITER.label1
    : HERO_TYPEWRITER.label1.slice(0, Math.min(typewriterIndex, l1));

  const currentContent1 = prefersReducedMotion
    ? HERO_TYPEWRITER.content1
    : typewriterIndex > l1
      ? HERO_TYPEWRITER.content1.slice(0, Math.min(typewriterIndex - l1, l2))
      : "";

  const currentLabel2 = prefersReducedMotion
    ? HERO_TYPEWRITER.label2
    : typewriterIndex > l1 + l2
      ? HERO_TYPEWRITER.label2.slice(0, Math.min(typewriterIndex - l1 - l2, l3))
      : "";

  const currentContent2 = prefersReducedMotion
    ? HERO_TYPEWRITER.content2
    : typewriterIndex > l1 + l2 + l3
      ? HERO_TYPEWRITER.content2.slice(
        0,
        Math.min(typewriterIndex - l1 - l2 - l3, l4)
      )
      : "";

  const isCompleteHero = typewriterIndex >= l1 + l2 + l3 + l4;
  const activeHeroField =
    typewriterIndex >= l1 + l2 + l3
      ? "content2"
      : typewriterIndex >= l1 + l2
        ? "label2"
        : typewriterIndex >= l1
          ? "content1"
          : "label1";

  const selectedModel =
    MODELS_DATA.find((m) => m.id === selectedModelId) || MODELS_DATA[0];

  return (
    <div className="bg-[#faf8f4] text-[#1a1917] font-body antialiased selection:bg-[#e6f3f0] selection:text-[#2a7d6e] min-h-screen flex flex-col relative">
      {/* ==================== 1. SPLASH SCREEN ==================== */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf8f4] transition-opacity duration-400 ease-out ${splashFading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          <div className="flex flex-col items-center">
            {/* Logotype with fade-in scale */}
            <div className="flex flex-col items-center animate-splash-logo">
              <Image
                src="/modulin-icon-only.png"
                alt="Modulin Icon"
                width={96}
                height={96}
                className="object-contain mb-6 drop-shadow-xl"
              />
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#1a5c50] tracking-tight">
                Modulin
              </span>
            </div>

            {/* Premium Loading Line */}
            <div className="mt-8 w-48 h-[3px] bg-[#e2dbd0] rounded-full overflow-hidden relative">
              <style>{`
                @keyframes indeterminate-slide {
                  0% { transform: translateX(-100%) scaleX(0.2); }
                  50% { transform: translateX(0) scaleX(1); }
                  100% { transform: translateX(100%) scaleX(0.2); }
                }
                .animate-indeterminate {
                  animation: indeterminate-slide 1.5s infinite ease-in-out;
                  transform-origin: left;
                }
              `}</style>
              <div className="absolute top-0 left-0 h-full w-full bg-[#1a5c50] rounded-full animate-indeterminate"></div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN PAGE CONTAINER ==================== */}
      <div
        className={`flex-1 flex flex-col transition-opacity duration-500 ${mainVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* ==================== 2. NAVIGASI ==================== */}
        <header
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
              ? "h-[64px] bg-[#1a5c50]/90 backdrop-blur-md shadow-lg py-2"
              : "h-[80px] bg-transparent py-4"
            } ${mainVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            {/* Kiri: Logotype Modulin */}
            <Link
              href="/"
              className="flex items-center gap-3 transition-transform hover:scale-105 duration-200"
            >
              <Image
                src="/modulin-icon-only.png"
                alt="Modulin Icon"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              />
              <span
                className="font-display font-bold text-[28px] text-white tracking-tight drop-shadow-md"
              >
                Modulin
              </span>
            </Link>

            {/* Tengah: Menu Navigasi */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="relative text-white text-[15px] font-bold drop-shadow-md group">
                Beranda
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-100"></span>
              </Link>
              <Link href="/tentang" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
                Tentang
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300"></span>
              </Link>
              <Link href="/fitur" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
                Fitur
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300"></span>
              </Link>
              <Link href="/editor" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
                Template
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300"></span>
              </Link>
            </nav>

            {/* Kanan: Tombol Masuk Desktop & Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden md:inline-flex h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full px-6 hover:bg-[#dc2626] transition-all duration-200 items-center justify-center cursor-pointer shadow-lg"
              >
                Masuk
              </Link>
              
              {/* Hamburger Mobile */}
              <button 
                className="md:hidden text-white p-2 z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menu Navigasi Mobile Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#1a5c50] shadow-xl md:hidden border-t border-white/10 flex flex-col py-4 px-6 gap-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-white text-[16px] font-bold py-2 border-b border-white/10">Beranda</Link>
              <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Tentang</Link>
              <Link href="/fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Fitur</Link>
              <Link href="/editor" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Template</Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full mt-2 flex items-center justify-center">
                Masuk
              </Link>
            </div>
          )}
        </header>

        <main className="flex-1">
          {/* ==================== 3. HERO SECTION ==================== */}
          <section className="relative h-screen overflow-hidden">
            {/* Full-Width Background Image */}
            <Image
              src="/hero-banner.png"
              alt="Modulin Hero Banner - Guru Indonesia"
              fill
              className="object-cover object-[85%_center] md:object-center"
              priority
              quality={100}
              unoptimized={true}
            />

            {/* Dark overlay gradient for text readability on left side */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a5c50]/95 via-[#1a5c50]/80 md:from-[#1a5c50]/80 md:via-[#2a7d6e]/40 to-transparent z-[1]" />

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
              <div className="max-w-xl py-16 md:py-24">
                <h1 className="font-display font-semibold text-5xl sm:text-6xl lg:text-[72px] leading-[1.08] tracking-[-2px] text-[#faf8f4] mb-4 drop-shadow-lg min-h-[160px] md:min-h-[155px]">
                  Bikin <span className="text-[#facc15]">{heroText}</span><span className="animate-pulse">|</span><br />Tanpa Lembur.
                </h1>
                <p className="text-[15px] sm:text-base font-normal text-[#faf8f4]/90 leading-relaxed mb-8 drop-shadow-sm">
                  Modul ajar Kurikulum Merdeka, format resmi, siap ekspor Word. Bantu guru Indonesia susun dokumen berkualitas tanpa lembur.
                </p>

                {/* CTA Buttons - Premium Editorial Style */}
                <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                  <Link
                    href="/create"
                    className="group relative w-full sm:w-auto h-14 bg-white text-[#1a5c50] text-[15px] font-bold px-9 rounded-full flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:-translate-y-1"
                  >
                    <span className="relative z-10">Mulai Buat Modul</span>
                    <ArrowRight className="w-[18px] h-[18px] relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  <Link
                    href="/editor"
                    className="group w-full sm:w-auto h-14 border border-white/30 bg-white/5 backdrop-blur-md hover:bg-white/15 text-white text-[15px] font-semibold px-9 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <FileText className="w-[18px] h-[18px] text-white/70 group-hover:text-white transition-colors duration-300" />
                    <span>Lihat Contoh Format</span>
                  </Link>
                </div>
              </div>
            </div>

          </section>

          {/* ==================== 4. SOCIAL PROOF ==================== */}
          <section className="bg-[#f0ebe0] border-b border-[#e2dbd0] py-5 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-normal text-[#444340] leading-relaxed">
                "Rata-rata guru Indonesia menghabiskan 3 hingga 6 jam untuk
                menyusun satu modul ajar secara manual."
              </p>
              <p className="text-sm text-[#6b6862] italic mt-2">
                (Kemendikbud, Survei Beban Administratif Guru 2023)
              </p>
            </div>
          </section>

          {/* ==================== 5. FITUR: SEBELUM VS SESUDAH ==================== */}
          <section className="py-20 md:py-24 bg-[#faf8f4] border-b border-[#e2dbd0]">
            <div className="max-w-5xl mx-auto px-6">
              <div
                ref={featuresRef}
                className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-[#e2dbd0] relative"
              >
                {/* Kolom Kiri: Tanpa Modulin */}
                <div className="bg-[#fef2f0] p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-[#c4503d] mb-6">
                      Tanpa Modulin
                    </h3>
                    <ul className="space-y-5">
                      {[
                        "Menyalin dari internet, format tidak sesuai standar pengawas",
                        "3 hingga 6 jam per modul, belum termasuk revisi",
                        "Capaian Pembelajaran tidak selaras dengan fase kelas",
                        "Rubrik asesmen dibuat manual dari nol",
                      ].map((item, index) => (
                        <li
                          key={index}
                          style={{
                            transitionDelay: prefersReducedMotion
                              ? "0ms"
                              : `${index * 80}ms`,
                          }}
                          className={`flex items-start gap-3 text-sm text-[#444340] leading-relaxed transition-all duration-500 ease-out ${featuresVisible || prefersReducedMotion
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                            }`}
                        >
                          <X className="w-4 h-4 text-[#c4503d] shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Garis Vertikal Tengah Teal (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#2a7d6e]/30 z-10" />

                {/* Kolom Kanan: Dengan Modulin */}
                <div className="bg-[#e6f3f0] p-8 md:p-10 flex flex-col justify-between border-t md:border-t-0 border-[#e2dbd0]">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-[#2a7d6e] mb-6">
                      Dengan Modulin
                    </h3>
                    <ul className="space-y-5">
                      {[
                        "Format resmi BSKAP, siap supervisi pengawas",
                        "15 menit dari input hingga dokumen siap unduh",
                        "CP dan TP selaras otomatis berdasarkan fase dan kelas",
                        "Rubrik asesmen tergenerate sesuai model pembelajaran",
                      ].map((item, index) => (
                        <li
                          key={index}
                          style={{
                            transitionDelay: prefersReducedMotion
                              ? "0ms"
                              : `${index * 80 + 320}ms`,
                          }}
                          className={`flex items-start gap-3 text-sm text-[#1a1917] font-medium leading-relaxed transition-all duration-500 ease-out ${featuresVisible || prefersReducedMotion
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                            }`}
                        >
                          <Check className="w-4 h-4 text-[#2a7d6e] shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 6. EDITOR PREVIEW ==================== */}
          <section className="py-20 md:py-24 bg-[#1c1b18] text-[#faf8f4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center mb-14">
                <span className="text-xs uppercase tracking-widest text-[#2a7d6e] font-semibold">
                  Lingkungan Kerja Guru
                </span>
                <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight text-[#faf8f4] mt-2 mb-4">
                  Editor Terstruktur Modul Ajar
                </h2>
                <p className="text-sm text-[#a09b93] leading-relaxed">
                  Sesuaikan urutan kegiatan, lengkapi instruksi diferensiasi, dan
                  sunting isi dokumen sebelum mengunduh berkas.
                </p>
              </div>

              {/* Tiga Panel Studio Interface Mockup */}
              <div className="bg-[#282623] rounded-xl border border-[#383531] shadow-2xl overflow-hidden">
                {/* Topbar Editor */}
                <div className="bg-[#121110] px-4 py-3 border-b border-[#383531] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#444340]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#444340]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#444340]" />
                    </div>
                    <span className="text-[#a09b93] border-l border-[#383531] pl-3 font-mono text-[11px]">
                      Modul_Ajar_IPA_FaseD_Ekosistem.docx
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#2a7d6e] bg-[#2a7d6e]/15 px-2 py-0.5 rounded border border-[#2a7d6e]/30">
                      Tersimpan Otomatis
                    </span>
                    <button className="bg-[#2a7d6e] text-white px-3 py-1.5 rounded-md text-xs hover:bg-[#1f6358] flex items-center gap-1.5 font-medium transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor Dokumen</span>
                    </button>
                  </div>
                </div>

                {/* 3 Panel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                  {/* Panel Kiri: Navigator Section */}
                  <div className="md:col-span-3 bg-[#222120] p-4 border-r border-[#383531] text-xs space-y-1">
                    <div className="text-[11px] text-[#6b6862] uppercase tracking-wider mb-3 font-semibold">
                      Struktur Modul Ajar
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-[#282623] text-[#2a7d6e] font-medium">
                      <span className="flex items-center gap-2">
                        <Info className="w-4 h-4" /> Identitas Umum
                      </span>
                      <Check className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md text-[#a09b93]">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" /> Capaian & TP
                      </span>
                      <Check className="w-3.5 h-3.5 text-[#2a7d6e]" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md text-[#a09b93]">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" /> Profil Pelajar Pancasila
                      </span>
                      <Check className="w-3.5 h-3.5 text-[#2a7d6e]" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-[#2a7d6e]/20 text-[#faf8f4] border border-[#2a7d6e]/40 font-medium">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#2a7d6e]" /> Kegiatan
                        Inti (Sintaks)
                      </span>
                      <span className="text-[10px] bg-[#2a7d6e] text-white px-1.5 py-0.5 rounded">
                        Aktif
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md text-[#a09b93]">
                      <span className="flex items-center gap-2">
                        <BarChart className="w-4 h-4" /> Asesmen & Rubrik
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md text-[#a09b93]">
                      <span className="flex items-center gap-2">
                        <Clipboard className="w-4 h-4" /> LKPD Siswa
                      </span>
                    </div>
                  </div>

                  {/* Panel Tengah: Live Generating Document Canvas */}
                  <div className="md:col-span-6 bg-[#121110] p-6 flex items-center justify-center overflow-y-auto">
                    <div
                      className={`bg-white text-[#1a1917] p-8 rounded-lg shadow-md w-full max-w-md text-xs leading-relaxed transition-opacity duration-700 ${docFadingOut ? "opacity-0" : "opacity-100"
                        }`}
                    >
                      {/* Block 0: Header */}
                      <div
                        className={`border-b border-gray-200 pb-3 mb-4 text-center transition-all duration-500 ${docBlockCount >= 1
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2 pointer-events-none"
                          }`}
                      >
                        <h4 className="font-display font-semibold text-base uppercase text-black">
                          MODUL AJAR: KEGIATAN INTI
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Model: Problem-Based Learning (PBL) • 2 JP (80 Menit)
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Block 1: Tahap 1 Orientasi Masalah */}
                        <div
                          className={`transition-all duration-500 ${docBlockCount >= 2
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                        >
                          <h5 className="font-semibold text-gray-900 text-[11px] mb-1">
                            Tahap 1: Orientasi Siswa pada Masalah (15 Menit)
                          </h5>
                          <p className="text-gray-700 text-[11px] leading-relaxed">
                            Guru menayangkan video dokumenter singkat fenomena
                            abrasi pesisir utara Jawa. Peserta didik mencatat 2
                            pertanyaan pemantik mandiri.
                          </p>
                        </div>

                        {/* Block 2: Callout Diferensiasi */}
                        <div
                          className={`bg-[#e6f3f0] border-l-2 border-[#2a7d6e] p-2.5 rounded text-[10.5px] transition-all duration-500 ${docBlockCount >= 3
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                        >
                          <span className="font-semibold text-[#1f6358] block mb-0.5">
                            Diferensiasi Proses:
                          </span>
                          <p className="text-gray-800 leading-tight">
                            Murid dengan gaya belajar kinestetik mengamati
                            replika sedimen; murid visual menganalisis peta foto
                            satelit.
                          </p>
                        </div>

                        {/* Block 3: Tahap 2 Mengorganisasi Siswa */}
                        <div
                          className={`transition-all duration-500 ${docBlockCount >= 4
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                        >
                          <h5 className="font-semibold text-gray-900 text-[11px] mb-1">
                            Tahap 2: Mengorganisasi Siswa untuk Belajar (20
                            Menit)
                          </h5>
                          <p className="text-gray-700 text-[11px] leading-relaxed">
                            Peserta didik dibagi menjadi 5 kelompok heterogen
                            untuk merumuskan hipotesis pencegahan abrasi dengan
                            metode tanggul alami.
                          </p>
                        </div>

                        {/* Block 4: Tahap 3 Penyelidikan */}
                        <div
                          className={`transition-all duration-500 ${docBlockCount >= 5
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                        >
                          <h5 className="font-semibold text-gray-900 text-[11px] mb-1">
                            Tahap 3: Membimbing Penyelidikan Mandiri dan Kelompok
                            (25 Menit)
                          </h5>
                          <p className="text-gray-700 text-[11px] leading-relaxed">
                            Guru memfasilitasi pengisian LKPD dan memverifikasi
                            sumber data ilmiah tiap tim.
                            {/* Blinking cursor at the end of last paragraph */}
                            {docBlockCount === 5 && !docFadingOut && (
                              <span className="inline-block w-1.5 h-3.5 bg-[#2a7d6e] ml-1 animate-blink align-middle" />
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Footer Sheet */}
                      <div className="mt-6 pt-3 border-t border-gray-200 text-[10px] text-gray-400 flex justify-between">
                        <span>Standar Resmi BSKAP</span>
                        <span>Halaman 3 dari 6</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel Kanan: Asisten Pedagogik Copilot */}
                  <div className="md:col-span-3 bg-[#222120] p-4 border-l border-[#383531] flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#383531]">
                        <Bot className="text-[#2a7d6e] w-4 h-4" />
                        <span className="font-medium text-[#2a7d6e]">
                          Asisten Pedagogik Modulin
                        </span>
                      </div>

                      <div className="bg-[#282623] p-3 rounded-lg border border-[#383531] mb-3 text-xs leading-relaxed text-[#faf8f4]">
                        <p className="mb-1.5 text-[#2a7d6e] font-medium">
                          Saran Diferensiasi Konten:
                        </p>
                        <p className="text-[11px] text-[#a09b93] leading-relaxed">
                          Sediakan infografis kosakata dasar sains tentang
                          rantai makanan bagi siswa yang butuh penguatan konsep.
                        </p>
                        <button className="mt-2.5 w-full bg-[#2a7d6e]/20 hover:bg-[#2a7d6e]/30 text-[#2a7d6e] text-[11px] py-1.5 px-2 rounded border border-[#2a7d6e]/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                          <PlusSquare className="w-3.5 h-3.5" />
                          <span>Sisipkan ke Rencana</span>
                        </button>
                      </div>

                      <div className="bg-[#282623] p-3 rounded-lg border border-[#383531] text-xs text-[#faf8f4]">
                        <p className="mb-1 text-[#d4940a] font-medium">
                          Cek Keterpaduan HOTS:
                        </p>
                        <p className="text-[11px] text-[#a09b93] leading-relaxed">
                          Pertanyaan nomor 4 pada rubrik sudah mencakup level C4
                          (Menganalisis) dan C5 (Mengevaluasi).
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#383531]">
                      <div className="relative">
                        <input
                          className="w-full bg-[#121110] border border-[#383531] text-xs text-[#faf8f4] placeholder-[#6b6862] rounded-md px-3 py-2 pr-8 focus:outline-none focus:border-[#2a7d6e] transition-colors"
                          placeholder="Tanyakan saran asesmen..."
                          type="text"
                          readOnly
                        />
                        <button className="absolute right-2.5 top-2 text-[#2a7d6e] hover:text-white transition-colors">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 7. ALUR 3 LANGKAH: STEPPER INTERAKTIF ==================== */}
          <section className="py-20 md:py-24 bg-[#faf8f4] border-b border-[#e2dbd0]">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-[#2a7d6e] font-semibold">
                  Alur Kerja
                </span>
                <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight text-[#1a1917] mt-2 mb-3">
                  Tiga Langkah Pembuatan Modul
                </h2>
                <p className="text-sm text-[#444340]">
                  Tahapan terarah dari penentuan materi hingga dokumen siap
                  cetak.
                </p>
              </div>

              {/* Stepper Tabs Bar */}
              <div className="max-w-3xl mx-auto mb-10 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center justify-between relative min-w-[600px] px-2">
                  {/* Step 1 Tab Button */}
                  <button
                    onClick={() => {
                      setAutoAdvance(false);
                      setActiveStep(0);
                    }}
                    className={`relative z-10 px-4 py-2.5 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeStep === 0
                        ? "bg-[#2a7d6e] text-white shadow-sm font-bold"
                        : "bg-[#f0ebe0] text-[#6b6862] hover:bg-[#e8e1d3]"
                      }`}
                  >
                    <span>01. Pilih Model Pembelajaran</span>
                  </button>

                  {/* Connector Line 1 */}
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${activeStep >= 1 ? "bg-[#2a7d6e]" : "bg-[#e2dbd0]"
                      }`}
                  />

                  {/* Step 2 Tab Button */}
                  <button
                    onClick={() => {
                      setAutoAdvance(false);
                      setActiveStep(1);
                    }}
                    className={`relative z-10 px-4 py-2.5 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeStep === 1
                        ? "bg-[#2a7d6e] text-white shadow-sm font-bold"
                        : "bg-[#f0ebe0] text-[#6b6862] hover:bg-[#e8e1d3]"
                      }`}
                  >
                    <span>02. Isi Identitas Modul</span>
                  </button>

                  {/* Connector Line 2 */}
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${activeStep >= 2 ? "bg-[#2a7d6e]" : "bg-[#e2dbd0]"
                      }`}
                  />

                  {/* Step 3 Tab Button */}
                  <button
                    onClick={() => {
                      setAutoAdvance(false);
                      setActiveStep(2);
                    }}
                    className={`relative z-10 px-4 py-2.5 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeStep === 2
                        ? "bg-[#2a7d6e] text-white shadow-sm font-bold"
                        : "bg-[#f0ebe0] text-[#6b6862] hover:bg-[#e8e1d3]"
                      }`}
                  >
                    <span>03. Unduh Dokumen</span>
                  </button>
                </div>
              </div>

              {/* Panel Konten Berubah Sesuai Langkah Aktif */}
              <div className="max-w-3xl mx-auto min-h-[320px]">
                {/* Langkah 1: Pilih Model Pembelajaran */}
                {activeStep === 0 && (
                  <div className="animate-step-enter bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-6 md:p-8 shadow-sm">
                    <h4 className="font-display font-semibold text-xl text-[#1a1917] mb-2">
                      Langkah 1: Pilih Pendekatan Pedagogik
                    </h4>
                    <p className="text-xs text-[#6b6862] mb-6">
                      Sintaks kegiatan belajar langsung disesuaikan dengan
                      karakteristik model terpilih.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {MODELS_DATA.map((model) => {
                        const isSelected = selectedModelId === model.id;
                        return (
                          <button
                            key={model.id}
                            onClick={() => setSelectedModelId(model.id)}
                            className={`p-3.5 rounded-lg text-left transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#e6f3f0] border-2 border-[#2a7d6e] shadow-sm"
                                : "bg-white border border-[#e2dbd0] hover:border-[#2a7d6e]/50 hover:bg-[#faf8f4]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-xs text-[#1a1917]">
                                {model.id.toUpperCase()}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] bg-[#2a7d6e] text-white px-1.5 py-0.5 rounded font-medium">
                                  Dipilih
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#444340] line-clamp-1 font-medium">
                              {model.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Langkah 2: Isi Identitas Modul Mockup */}
                {activeStep === 1 && (
                  <div className="animate-step-enter bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-6 md:p-8 shadow-sm">
                    <h4 className="font-display font-semibold text-xl text-[#1a1917] mb-2">
                      Langkah 2: Identitas dan Topik Pembelajaran
                    </h4>
                    <p className="text-xs text-[#6b6862] mb-6">
                      Sistem menentukan fase dan target capaian secara otomatis
                      dari jenjang dan kelas.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#444340] mb-1.5">
                          Mata Pelajaran
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="Ilmu Pengetahuan Alam (IPA)"
                          className="w-full bg-white border border-[#e2dbd0] rounded-md px-3.5 py-2 text-xs sm:text-sm text-[#1a1917] font-normal cursor-default"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#444340] mb-1.5">
                          Jenjang dan Kelas
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="SMP • Kelas VII (Fase D)"
                          className="w-full bg-white border border-[#e2dbd0] rounded-md px-3.5 py-2 text-xs sm:text-sm text-[#1a1917] font-normal cursor-default"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#444340] mb-1.5">
                          Topik / Materi Pokok
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="Interaksi Komponen Ekosistem dan Mitigasi Abrasi"
                          className="w-full bg-white border border-[#e2dbd0] rounded-md px-3.5 py-2 text-xs sm:text-sm text-[#1a1917] font-normal cursor-default"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#444340] mb-1.5">
                          Alokasi Waktu
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="3 Pertemuan (6 JP @ 40 Menit)"
                          className="w-full bg-white border border-[#e2dbd0] rounded-md px-3.5 py-2 text-xs sm:text-sm text-[#1a1917] font-normal cursor-default"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Langkah 3: Unduh Dokumen */}
                {activeStep === 2 && (
                  <div className="animate-step-enter bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-6 md:p-8 shadow-sm">
                    <h4 className="font-display font-semibold text-xl text-[#1a1917] mb-2">
                      Langkah 3: Pratinjau Dokumen Selesai
                    </h4>
                    <p className="text-xs text-[#6b6862] mb-6">
                      Format kedinasan standar BSKAP No. 032/H/KR/2024 siap
                      disimpan dan dicetak.
                    </p>

                    <div className="bg-white border border-[#e2dbd0] rounded-xl p-6 text-center max-w-md mx-auto shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-[#e6f3f0] text-[#2a7d6e] flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h5 className="font-semibold text-sm text-[#1a1917] mb-1">
                        Modul_Ajar_IPA_FaseD.docx
                      </h5>
                      <p className="text-xs text-[#6b6862] mb-6">
                        Margin Resmi Dinas 3-2.5-2.5-2.5 cm • Lengkap dengan
                        Rubrik
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button className="w-full sm:w-auto bg-[#2a7d6e] hover:bg-[#1f6358] text-white text-xs font-medium px-5 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer">
                          <Download className="w-4 h-4" />
                          <span>Unduh Word (.docx)</span>
                        </button>
                        <button className="w-full sm:w-auto border border-[#e2dbd0] bg-[#faf8f4] hover:bg-[#f0ebe0] text-[#1a1917] text-xs font-medium px-5 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer">
                          <Download className="w-4 h-4 text-[#6b6862]" />
                          <span>Unduh PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ==================== 8. MODEL PEMBELAJARAN: PANEL INTERAKTIF ==================== */}
          <section className="py-20 md:py-24 bg-[#f0ebe0] border-b border-[#e2dbd0]">
            <div className="max-w-5xl mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center mb-14">
                <span className="text-xs uppercase tracking-widest text-[#2a7d6e] font-semibold">
                  Fondasi Didaktik
                </span>
                <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight text-[#1a1917] mt-2 mb-4">
                  Pilihan Model Pembelajaran Resmi
                </h2>
                <p className="text-sm text-[#444340] leading-relaxed">
                  Pilih salah satu model untuk meninjau sintaks bertahap dan
                  contoh kegiatan pembelajarannya.
                </p>
              </div>

              {/* Layout Dua Kolom: Kiri List Vertikal, Kanan Detail Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Kolom Kiri: 6 Model Pembelajaran List */}
                <div className="lg:col-span-4 bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-2 space-y-1 shadow-sm">
                  {MODELS_DATA.map((model) => {
                    const isActive = model.id === selectedModelId;
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`w-full text-left px-4 py-3 text-xs sm:text-sm transition-all duration-150 rounded-r-md cursor-pointer block ${isActive
                            ? "bg-[#e6f3f0] border-l-[3px] border-[#2a7d6e] text-[#1a1917] font-medium"
                            : "bg-transparent text-[#6b6862] hover:bg-[#f0ebe0] border-l-[3px] border-transparent"
                          }`}
                      >
                        {model.name}
                      </button>
                    );
                  })}
                </div>

                {/* Kolom Kanan: Panel Detail Model yang Dipilih */}
                <div
                  key={selectedModel.id}
                  className="lg:col-span-8 bg-[#faf8f4] border border-[#e2dbd0] rounded-xl p-6 sm:p-8 shadow-sm animate-step-enter overflow-hidden"
                >
                  <h3 className="font-display font-semibold text-[28px] text-[#1a1917] leading-tight mb-2">
                    {selectedModel.name}
                  </h3>
                  <p className="text-sm text-[#444340] leading-relaxed mb-6">
                    {selectedModel.description}
                  </p>

                  {/* Diagram Sintak Horizontal */}
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-wider text-[#6b6862] font-semibold block mb-3">
                      Alur Sintaks Pembelajaran
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
                      {selectedModel.steps.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className="shrink-0 bg-[#f0ebe0] border border-[#2a7d6e] rounded-md px-3 py-2 text-xs font-medium text-[#1a1917] whitespace-nowrap">
                            <span className="text-[#2a7d6e] mr-1.5 font-semibold">
                              {idx + 1}.
                            </span>
                            <span>{step}</span>
                          </div>
                          {idx < selectedModel.steps.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-[#2a7d6e] shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Contoh Kegiatan Spesifik dalam Card Krem */}
                  <div className="bg-[#f0ebe0] border border-[#e2dbd0] rounded-lg p-4">
                    <span className="text-xs font-semibold text-[#2a7d6e] block mb-1">
                      Contoh Kegiatan Nyata di Kelas:
                    </span>
                    <p className="text-xs text-[#444340] leading-relaxed">
                      {selectedModel.example}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 9. CTA PENUTUP ==================== */}
          <section className="relative py-12 md:py-14 border-t border-[#e2dbd0] overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/cta-background.jpg" 
                alt="Indonesian Teacher" 
                fill
                className="object-cover object-center"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/95 via-[#1a5c50]/90 to-[#1a1917]/95"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Guru-guru Indonesia tidak punya waktu untuk format yang salah.
              </h2>
              <p className="text-lg sm:text-xl font-medium text-white max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Modulin menyusunnya dalam format yang benar, dalam waktu yang
                jauh lebih singkat.
              </p>

              <div className="flex justify-center mb-8">
                <Link
                  href="/create"
                  className="bg-white hover:bg-gray-100 text-[#1a5c50] text-[15px] font-bold px-10 py-4 rounded-full transition-all duration-300 inline-flex items-center justify-center shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 cursor-pointer"
                >
                  Mulai Sekarang, Gratis
                </Link>
              </div>

            </div>
          </section>
        </main>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-[#121110] pt-20 pb-8 mt-auto border-t border-[#1a1917]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
              {/* Brand Column */}
              <div className="col-span-1 md:col-span-2">
                <Link href="/" className="flex items-center gap-3 mb-6">
                  <Image src="/modulin-icon-only.png" alt="Modulin Icon" width={40} height={40} className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                  <span className="font-display font-bold text-3xl text-white tracking-tight">Modulin</span>
                </Link>
                <p className="text-[14px] text-gray-400 max-w-sm leading-relaxed">
                  Platform cerdas untuk membantu Guru Indonesia menyusun Modul Ajar dan RPP berstandar Kurikulum Merdeka secara otomatis, cepat, dan presisi.
                </p>
              </div>

              {/* Links Column 1 */}
              <div>
                <h4 className="text-white font-semibold text-[13px] uppercase tracking-widest mb-6">Produk</h4>
                <ul className="space-y-4">
                  <li><Link href="/create" className="text-gray-400 hover:text-white text-[14px] transition-colors">Generator Modul Ajar</Link></li>
                  <li><Link href="/editor" className="text-gray-400 hover:text-white text-[14px] transition-colors">Template Resmi BSKAP</Link></li>
                  <li><Link href="/fitur" className="text-gray-400 hover:text-white text-[14px] transition-colors">Asisten Pedagogik</Link></li>
                </ul>
              </div>

              {/* Links Column 2 */}
              <div>
                <h4 className="text-white font-semibold text-[13px] uppercase tracking-widest mb-6">Dukungan</h4>
                <ul className="space-y-4">
                  <li><Link href="/tentang" className="text-gray-400 hover:text-white text-[14px] transition-colors">Bantuan Guru (FAQ)</Link></li>
                  <li><Link href="/kebijakan-privasi" className="text-gray-400 hover:text-white text-[14px] transition-colors">Kebijakan Privasi</Link></li>
                  <li><Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white text-[14px] transition-colors">Syarat & Ketentuan</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[13px] text-gray-500">
                © {new Date().getFullYear()} Modulin by Exploraition. Hak Cipta Dilindungi.
              </p>
              <div className="flex items-center gap-6 text-[13px] text-gray-500">
                <span>Dibuat oleh tim S.Kom-EDI</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
