"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Mail, Lock, Eye, EyeOff, User, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Lazy Supabase client                                                  */
/* ------------------------------------------------------------------ */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error("Supabase env vars tidak ditemukan di .env.local");
  return createClient(url, key);
}

type AuthMode = "masuk" | "daftar";

/* ------------------------------------------------------------------ */
/* Google Icon SVG                                                       */
/* ------------------------------------------------------------------ */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Slide 1: Floating Module Card on dot grid                            */
/* ------------------------------------------------------------------ */
function Slide1() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #e8e1d3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.3,
        }}
      />
      <div
        className="relative z-10 bg-[#282623] rounded-xl border border-[#383531] p-5 shadow-xl"
        style={{ width: 264, animation: "floatCard 3s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#2a7d6e]" style={{ animation: "dotPulse 2s ease-in-out infinite" }} />
          <span className="text-[10px] font-medium text-[#2a7d6e] tracking-wide">AI sedang menyusun...</span>
        </div>
        <div className="space-y-2.5">
          <div className="bg-[#1c1b18] rounded-md p-2.5 border border-[#383531]">
            <span className="block text-[10px] font-semibold text-[#2a7d6e] mb-1.5">Tujuan Pembelajaran</span>
            <div className="space-y-1.5">
              <div className="h-2 bg-[#383531] rounded-full w-full" />
              <div className="h-2 bg-[#383531] rounded-full w-4/5" />
              <div className="h-2 bg-[#383531] rounded-full w-3/5" />
            </div>
          </div>
          <div className="bg-[#1c1b18] rounded-md p-2.5 border border-[#383531]">
            <span className="block text-[10px] font-semibold text-[#2a7d6e] mb-1.5">Tahap 1: Orientasi Masalah</span>
            <div className="space-y-1.5">
              <div className="h-2 bg-[#383531] rounded-full w-full" />
              <div className="h-2 bg-[#383531] rounded-full w-3/4" />
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#383531] flex justify-between text-[10px] text-[#6b6862]">
          <span>IPA • Fase D • Kelas VII</span>
          <span className="text-[#2a7d6e] font-medium">PBL</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide 2: PBL Syntax Diagram                                          */
/* ------------------------------------------------------------------ */
const PBL_STEPS = ["Orientasi\nMasalah", "Organisasi\nBelajar", "Penyelidikan\nMandiri", "Penyajian\nSolusi", "Evaluasi\nProses"];

function Slide2() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-5 px-6">
      <span className="text-[11px] uppercase tracking-widest text-[#6b6862] font-semibold">Sintak Problem-Based Learning</span>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {PBL_STEPS.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="border border-[#2a7d6e] rounded-md px-3 py-2 text-center" style={{ background: "rgba(42,125,110,0.08)" }}>
                {step.split("\n").map((line, li) => (
                  <span key={li} className="block text-[11px] font-medium text-[#e8e1d3] whitespace-nowrap">{line}</span>
                ))}
              </div>
              <span className="mt-1 text-[10px] text-[#6b6862]">Fase {idx + 1}</span>
            </div>
            {idx < PBL_STEPS.length - 1 && (
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="shrink-0 mb-4">
                <path d="M0 5h11M7 1l6 4-6 4" stroke="#2a7d6e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-[12px] text-[#6b6862] text-center max-w-[280px] leading-relaxed">Lima tahapan terstruktur untuk melatih nalar kritis peserta didik.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide 3: Word Document Mockup                                         */
/* ------------------------------------------------------------------ */
function Slide3() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute bg-[#282623] rounded-xl border border-[#383531]"
        style={{ width: 240, height: 300, transform: "rotate(6deg) translateX(12px) translateY(6px)", opacity: 0.45 }}
      />
      <div className="relative bg-white rounded-xl shadow-2xl p-5" style={{ width: 240, transform: "rotate(-3deg)" }}>
        <div
          className="absolute text-[10px] font-semibold text-white px-2.5 py-1 rounded-full shadow-md"
          style={{ top: -12, right: -12, background: "#2a7d6e" }}
        >
          Siap Ekspor
        </div>
        <div className="text-center border-b border-gray-200 pb-2.5 mb-3">
          <span className="block text-[9px] tracking-widest font-bold text-gray-400 uppercase mb-0.5">Kurikulum Merdeka</span>
          <span className="block text-[13px] font-bold text-gray-900 uppercase">MODUL AJAR</span>
          <span className="block text-[10px] text-gray-500 mt-0.5">IPA Fase D • Kelas VII</span>
        </div>
        <div className="space-y-2">
          {[100, 90, 100, 75, 85, 60, 95, 80].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-[#f0ebe0]" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between text-[9px] text-gray-400">
          <span>Standar BSKAP No. 032</span>
          <span>Halaman 1 dari 6</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Visual Panel (stays fixed left or right)                             */
/* ------------------------------------------------------------------ */
const SLIDES = [Slide1, Slide2, Slide3];

function VisualPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadingIn, setFadingIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadingIn(false);
      setTimeout(() => { setCurrentSlide((prev) => (prev + 1) % SLIDES.length); setFadingIn(true); }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const SlideComponent = SLIDES[currentSlide];

  return (
    <div className="relative w-full h-full bg-[#1c1b18] overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(28,27,24,0.55), rgba(28,27,24,0.10))" }} />

      {/* Slide content */}
      <div className="absolute inset-0 z-20" style={{ opacity: fadingIn ? 1 : 0, transition: "opacity 600ms ease-in-out" }}>
        <SlideComponent />
      </div>

      {/* Logotype top-left */}
      <div className="absolute top-0 left-0 z-30 p-8 flex items-center gap-2.5">
        <Image src="/modulin-logo-2.png" alt="Modulin Logo" width={28} height={28} className="rounded-md object-contain" />
        <span className="font-display font-semibold text-[22px] text-[#faf8f4] tracking-tight">Modulin</span>
      </div>

      {/* Tagline bottom-left */}
      <div className="absolute bottom-0 left-0 z-30 p-8 max-w-[300px]">
        <p className="font-display font-semibold text-[26px] text-[#faf8f4] leading-[1.2] mb-2" style={{ letterSpacing: "-0.3px" }}>
          Susun modul ajar resmi dalam 15 menit.
        </p>
        <p className="text-[12px] text-[#a09b93]">Format BSKAP resmi. Ekspor Word dan PDF.</p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setFadingIn(false); setTimeout(() => { setCurrentSlide(idx); setFadingIn(true); }, 300); }}
            className="rounded-full cursor-pointer"
            style={{ width: currentSlide === idx ? 24 : 6, height: 6, backgroundColor: currentSlide === idx ? "#2a7d6e" : "#e8e1d3", opacity: currentSlide === idx ? 1 : 0.5, transition: "width 300ms ease-in-out, background-color 300ms" }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input Field Component                                                 */
/* ------------------------------------------------------------------ */
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

function InputField({ id, label, type, value, onChange, placeholder, icon, rightElement, autoComplete }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#2a2926] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908c84] pointer-events-none">{icon}</div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full h-12 bg-[#f5f0e6] border border-[#e2dbd0] rounded-[12px] pl-10 pr-10 text-[14px] text-[#1a1917] placeholder-[#908c84] outline-none transition-all duration-150 focus:border-[#2a7d6e] focus:ring-2 focus:ring-[#2a7d6e]/15"
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form Panel (slides left/right based on mode)                         */
/* ------------------------------------------------------------------ */
interface FormPanelProps {
  mode: AuthMode;
  onToggle: () => void;
  contentVisible: boolean;
}

const BENEFITS = [
  "Format BSKAP resmi, siap supervisi",
  "Generate modul dalam 15 menit",
  "Ekspor Word dan PDF tanpa biaya",
];

function FormPanel({ mode, onToggle, contentVisible }: FormPanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const client = getSupabaseClient();
      if (mode === "masuk") {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Email atau kata sandi salah. Coba lagi.");
        window.location.href = "/dashboard";
      } else {
        const { error } = await client.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw new Error(error.message);
        setAuthError("Cek email kamu untuk konfirmasi pendaftaran.");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw new Error("Gagal masuk dengan Google. Coba lagi.");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Gagal masuk. Coba lagi.");
      setGoogleLoading(false);
    }
  };

  const isMasuk = mode === "masuk";

  return (
    <div className="relative w-full h-full bg-[#faf8f4] flex flex-col overflow-y-auto md:rounded-l-[32px] md:shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.5)] border-l border-[#ffffff20]">
      {/* Top row: logo (mobile/daftar) + toggle link */}
      <div className="flex items-center justify-between px-7 pt-7 shrink-0">
        {/* Logo — shown on mobile always; on desktop shown when form is on right (masuk mode) */}
        <div className="flex items-center gap-2">
          <Image src="/modulin-logo-2.png" alt="Modulin Logo" width={28} height={28} className="rounded-md object-contain" />
          <span className="font-display font-semibold text-[18px] text-[#1a1917] tracking-tight">Modulin</span>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#6b6862]">
          <span>{isMasuk ? "Belum punya akun?" : "Sudah punya akun?"}</span>
          <button
            onClick={onToggle}
            className="flex items-center gap-1 font-medium text-[#2a7d6e] hover:text-[#1f6358] transition-colors cursor-pointer"
          >
            {isMasuk ? "Daftar" : "Masuk"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Centered form content */}
      <div className="flex-1 flex items-center justify-center px-7 py-6">
        <div
          className="w-full"
          style={{
            maxWidth: 380,
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 200ms ease-out, transform 200ms ease-out",
          }}
        >
          {/* Headline */}
          <h1
            className="font-display font-semibold text-[#1a1917] mb-1.5"
            style={{ fontSize: 30, letterSpacing: "-0.5px", lineHeight: 1.15 }}
          >
            {isMasuk ? "Masuk ke Modulin" : "Buat Akun Gratis"}
          </h1>
          <p className="text-[13px] text-[#6b6862] mb-6 leading-relaxed">
            {isMasuk
              ? "Masukkan email dan kata sandi untuk melanjutkan."
              : "Daftar dengan email atau gunakan akun Google kamu."}
          </p>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Name — Daftar only */}
            {!isMasuk && (
              <InputField
                id="reg-name"
                label="Nama Lengkap"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Nama lengkap kamu"
                icon={<User className="w-4 h-4" />}
                autoComplete="name"
              />
            )}

            <InputField
              id={isMasuk ? "login-email" : "reg-email"}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nama@email.com"
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <InputField
              id={isMasuk ? "login-pass" : "reg-pass"}
              label="Kata Sandi"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder={isMasuk ? "••••••••" : "Minimal 8 karakter"}
              icon={<Lock className="w-4 h-4" />}
              autoComplete={isMasuk ? "current-password" : "new-password"}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[#908c84] hover:text-[#6b6862] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {isMasuk && (
              <div className="text-right -mt-1">
                <button type="button" className="text-[12px] text-[#2a7d6e] hover:text-[#1f6358] transition-colors cursor-pointer">
                  Lupa kata sandi?
                </button>
              </div>
            )}

            {/* Error / info callout */}
            {authError && (
              <div
                className="px-4 py-3 rounded-[10px] text-[13px]"
                style={{
                  background: authError.includes("Cek email") ? "#e6f3f0" : "#fef2f0",
                  borderLeft: `3px solid ${authError.includes("Cek email") ? "#2a7d6e" : "#c4503d"}`,
                  color: authError.includes("Cek email") ? "#1f6358" : "#1a1917",
                  animation: "fadeSlideUp 200ms ease-out",
                }}
                role="alert"
              >
                {authError}
              </div>
            )}

            {/* Primary button */}
            <button
              id={isMasuk ? "btn-masuk" : "btn-daftar"}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[12px] text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? "#1f6358" : "#2a7d6e" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "loginSpin 0.8s linear infinite" }} />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{isMasuk ? "Masuk" : "Daftar"}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#e2dbd0]" />
            <span className="text-[12px] text-[#908c84] font-medium">Atau</span>
            <div className="flex-1 h-px bg-[#e2dbd0]" />
          </div>

          {/* Google button */}
          <button
            id="btn-google"
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full h-12 bg-white hover:bg-[#f5f0e6] border border-[#e2dbd0] rounded-[12px] text-[14px] font-medium text-[#1a1917] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 1px 3px rgba(26,25,23,0.08)" }}
          >
            {googleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#2a7d6e] border-t-transparent rounded-full" style={{ animation: "loginSpin 0.8s linear infinite" }} />
                <span>Menghubungkan...</span>
              </>
            ) : (
              <>
                <GoogleIcon size={18} />
                <span>{isMasuk ? "Masuk dengan Google" : "Daftar dengan Google"}</span>
              </>
            )}
          </button>

          {/* Benefits — Daftar only */}
          {!isMasuk && (
            <ul className="mt-5 space-y-2">
              {BENEFITS.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[12px] text-[#444340]"
                  style={{
                    opacity: contentVisible ? 1 : 0,
                    transform: contentVisible ? "translateY(0)" : "translateY(6px)",
                    transition: `opacity 300ms ease-out ${i * 80}ms, transform 300ms ease-out ${i * 80}ms`,
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-[#e6f3f0] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#2a7d6e]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Disclaimer */}
          <p className="mt-5 text-[11px] text-[#908c84] text-center leading-relaxed">
            Dengan {isMasuk ? "masuk" : "mendaftar"}, kamu menyetujui{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-[#6b6862]">Syarat Layanan</span>{" "}
            dan{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-[#6b6862]">Kebijakan Privasi</span>{" "}
            Modulin.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Login Page                                                       */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("masuk");
  const [contentVisible, setContentVisible] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleToggle = useCallback(() => {
    if (toggling) return;
    setToggling(true);
    /* 1. Fade out form content */
    setContentVisible(false);
    setTimeout(() => {
      /* 2. Switch mode in place */
      setMode((prev) => (prev === "masuk" ? "daftar" : "masuk"));
      /* 3. Fade in new form content */
      setTimeout(() => {
        setContentVisible(true);
        setToggling(false);
      }, 50);
    }, 200);
  }, [toggling]);
  const isDaftar = mode === "daftar";
  const ENTRANCE = reducedMotion
    ? "opacity 300ms ease-out"
    : "opacity 350ms ease-out, transform 350ms ease-out";

  return (
    <>
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50%        { transform: translateY(-8px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="w-full overflow-hidden bg-[#1c1b18]" style={{ height: "100svh" }}>

        {/* ======== DESKTOP: split two panels ======== */}
        <div className="hidden md:block relative w-full h-full overflow-hidden">

          {/* Visual Panel — always LEFT */}
          <div
            className="absolute top-0 h-full"
            style={{
              width: "55%",
              left: "0%",
              opacity: mounted ? 1 : 0,
            }}
          >
            <VisualPanel />
          </div>

          {/* Form Panel — always RIGHT with border radius */}
          <div
            className="absolute top-0 h-full"
            style={{
              width: "45%",
              left: "55%",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(20px)",
              transition: ENTRANCE,
            }}
          >
            <FormPanel mode={mode} onToggle={handleToggle} contentVisible={contentVisible} />
          </div>
        </div>

        {/* ======== MOBILE: form only, full width ======== */}
        <div
          className="md:hidden w-full h-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: ENTRANCE,
          }}
        >
          <FormPanel mode={mode} onToggle={handleToggle} contentVisible={contentVisible} />
        </div>
      </div>
    </>
  );
}
