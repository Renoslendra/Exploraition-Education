"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  Zap,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Research Otomatis",
    description:
      "Masukkan bab & topik, AI langsung riset scope materi dan Capaian Pembelajaran sesuai Kurikulum Merdeka.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "7+ Model Pembelajaran",
    description:
      "PBL, PjBL, Discovery Learning, Inquiry, CTL, dan lainnya — lengkap dengan penjelasan dan sintaks.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Export PDF & Word",
    description:
      "Modul ajar siap cetak dalam format PDF atau DOCX. Edit langsung di web sebelum export.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Hemat Berjam-jam",
    description:
      "Dari input identitas sampai modul lengkap — hanya butuh beberapa menit, bukan berhari-hari.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih Model Pembelajaran",
    desc: "Pilih model seperti PBL, PjBL, atau Discovery Learning. Kami jelaskan setiap model agar Anda paham perbedaannya.",
  },
  {
    number: "02",
    title: "Isi Identitas Modul",
    desc: "Nama guru, instansi, mata pelajaran, kelas, fase, bab, dan topik. Semua yang dibutuhkan modul ajar.",
  },
  {
    number: "03",
    title: "AI Generate & Research",
    desc: "AI riset materi bab Anda, lalu generate seluruh bagian modul ajar sesuai format Kemendikbud.",
  },
  {
    number: "04",
    title: "Edit & Export",
    desc: "Edit narasi di editor langsung di web. Puas? Export ke PDF atau Word dalam satu klik.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[56px]">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image 
                src="/modulin-logo.png" 
                alt="Modulin Logo" 
                width={44} 
                height={44}
                className="object-contain hover:scale-105 transition-transform"
              />
              <span
                className="text-xl font-bold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Modulin
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#fitur"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Fitur
              </a>
              <a
                href="#cara-kerja"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Cara Kerja
              </a>
              <a
                href="#model"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Model Pembelajaran
              </a>
              <Link
                href="/create"
                className="bg-primary text-on-primary rounded-md px-5 py-2.5 text-[14px] font-medium hover:bg-primary-active transition-colors"
              >
                Buat Modul
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#fitur"
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </a>
              <a
                href="#cara-kerja"
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cara Kerja
              </a>
              <a
                href="#model"
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Model Pembelajaran
              </a>
              <Link
                href="/create"
                className="block w-full text-center bg-primary text-on-primary rounded-md px-5 py-2.5 text-[14px] font-medium hover:bg-primary-active transition-colors"
              >
                Buat Modul
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-canvas">
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-primary/20 mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-primary">
              Powered by Gemini AI
            </span>
          </div>

          <h1
            className="text-[48px] font-semibold leading-[1.1] tracking-[-1px] mb-6 animate-fade-in-up text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Buat Modul Ajar
            <br />
            dalam Hitungan Menit
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Generator modul ajar AI yang memahami Kurikulum Merdeka. Pilih model
            pembelajaran, isi identitas, dan biarkan AI menyusun modul lengkap
            untuk Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/create"
              className="inline-flex items-center justify-center bg-primary text-on-primary rounded-md px-5 py-2.5 h-[40px] text-[14px] font-medium hover:bg-primary-active transition-colors animate-fade-in-up delay-300"
            >
              Mulai Buat Modul
            </Link>
            <a
              href="#cara-kerja"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/80 text-foreground font-semibold text-lg hover:bg-white transition-all border border-border shadow-sm"
            >
              Lihat Cara Kerja
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in-up delay-500">
            {[
              "Sesuai Kurikulum Merdeka",
              "18 Bagian Lengkap",
              "Export PDF & Word",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-muted-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 px-4 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Fitur Unggulan
            </span>
            <h2
              className="text-[36px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Semua yang Guru Butuhkan
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Tidak perlu lagi menghabiskan waktu berjam-jam menulis modul ajar
              dari nol. Modulin mengotomatisasi seluruh proses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-16 px-4 bg-surface-soft">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cara Kerja
            </span>
            <h2
              className="text-[36px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              4 Langkah Sederhana
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-active flex items-center justify-center shadow-inner">
                  <span className="text-white font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && i % 2 === 0 && (
                  <div className="hidden sm:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Preview Section */}
      <section id="model" className="py-16 px-4 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Model Pembelajaran
            </span>
            <h2
              className="text-[36px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pilih Model yang Tepat
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Modulin mendukung berbagai model pembelajaran yang direkomendasikan
              Kemendikbud untuk Kurikulum Merdeka.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🧩", name: "Problem Based Learning", tag: "PBL" },
              { icon: "🚀", name: "Project Based Learning", tag: "PjBL" },
              { icon: "🔍", name: "Discovery Learning", tag: "DL" },
              { icon: "🔬", name: "Inquiry Learning", tag: "IL" },
              { icon: "🌍", name: "Contextual Teaching & Learning", tag: "CTL" },
              { icon: "🤝", name: "Cooperative Learning", tag: "CL" },
            ].map((model) => (
              <div
                key={model.tag}
                className="flex items-center gap-4 p-[24px] rounded-[12px] bg-surface-card border border-hairline transition-all cursor-default"
              >
                <span className="text-3xl">{model.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{model.name}</h3>
                  <span className="text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {model.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-canvas">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-[16px] bg-primary relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2
                className="text-[36px] font-semibold leading-[1.15] tracking-[-0.5px] text-on-primary mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Siap Membuat Modul Ajar?
              </h2>
              <p className="text-[15px] text-on-primary/80 mb-8 max-w-lg mx-auto">
                Bergabung dengan guru-guru Indonesia yang sudah menghemat waktu
                dengan Modulin.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center justify-center bg-canvas text-primary font-medium text-[14px] px-5 py-2.5 h-[40px] rounded-md hover:bg-surface-soft transition-colors"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark py-[48px] px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src="/modulin-logo.png" alt="Modulin Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-semibold text-on-dark text-[22px]" style={{ fontFamily: "var(--font-display)" }}>Modulin</span>
          </div>
          <p className="text-[13px] text-on-dark-soft">
            © 2026 Modulin. Dibuat dengan ❤️ untuk guru Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
