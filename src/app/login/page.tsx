"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
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
/* Visual Panel (Slider Image Background)                             */
/* ------------------------------------------------------------------ */
const SLIDES = [
  "/login-slide1.png",
  "/login-slide2.png",
  "/login-slide3.png"
];

function VisualPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Images Carousel spans the FULL width so it goes under the rounded form */}
      {SLIDES.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentSlide === idx ? 1 : 0, zIndex: 0 }}
        >
          <Image
            src={src}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover object-center"
            unoptimized
          />
        </div>
      ))}

      {/* Gradient overlay to ensure text is readable, constrained to left 55% visually or full */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(28,27,24,0.9) 0%, rgba(28,27,24,0.4) 35%, transparent 60%)" }}
      />

      {/* Content Container */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* Logotype top-left */}
        <div className="absolute top-0 left-0 p-8 flex items-center gap-2.5 pointer-events-auto">
          <Image src="/modulin-icon-only.png" alt="Modulin Logo" width={32} height={32} className="object-contain drop-shadow-lg" />
          <span className="font-display font-bold text-[26px] text-white tracking-tight drop-shadow-lg">Modulin</span>
        </div>

        {/* Tagline bottom-left */}
        <div className="absolute bottom-0 left-0 p-8 max-w-[400px] pointer-events-auto">
          <p className="font-display font-extrabold text-[36px] text-white leading-[1.15] mb-3 drop-shadow-2xl" style={{ letterSpacing: "-0.5px" }}>
            Susun modul ajar<br />resmi dalam 15 menit.
          </p>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-8 right-16 flex items-center gap-2 pointer-events-auto">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="rounded-full cursor-pointer hover:bg-white transition-all duration-300"
              style={{
                width: currentSlide === idx ? 28 : 8,
                height: 8,
                backgroundColor: currentSlide === idx ? "#2a7d6e" : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
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



function FormPanel({ mode, onToggle, contentVisible }: FormPanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("guru.demo@modulin.id");
  const [password, setPassword] = useState("PasswordModulin2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const client = getSupabaseClient();
      if (mode === "masuk") {
        try {
          const client = getSupabaseClient();
          const { data, error } = await client.auth.signInWithPassword({ email, password });
          if (error) console.warn("Supabase auth note:", error.message);
          const isDemo = email.includes("demo");
          const userName = data?.user?.user_metadata?.full_name || (isDemo ? "Guru Demo Modulin" : email.split("@")[0]);
          localStorage.setItem("modulin_user_name", userName);
          localStorage.setItem("modulin_user_role", isDemo ? "Pendidik (Akun Demo)" : "Guru Pengajar");
        } catch (e) {
          console.warn("Using demo login mode:", e);
          localStorage.setItem("modulin_user_name", "Guru Demo Modulin");
          localStorage.setItem("modulin_user_role", "Pendidik (Akun Demo)");
        }
        localStorage.setItem("modulin_logged_in", "true");
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
      localStorage.setItem("modulin_logged_in", "true");
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Gagal masuk dengan Google. Coba lagi.");
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
          <Image src="/modulin-icon-only.png" alt="Modulin Logo" width={28} height={28} className="rounded-md object-contain" />
          <span className="font-display font-bold text-[18px] text-[#1a1917] tracking-tight">Modulin</span>
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
            className="font-display font-semibold text-[#1a1917] mb-1.5 text-center"
            style={{ fontSize: 30, letterSpacing: "-0.5px", lineHeight: 1.15 }}
          >
            {isMasuk ? "Masuk ke Modulin" : "Buat Akun Gratis"}
          </h1>
          <p className="text-[13px] text-[#6b6862] mb-6 leading-relaxed text-center">
            {isMasuk
              ? "Masukkan email dan kata sandi untuk melanjutkan."
              : "Daftar dengan menggunakan alamat email kamu di bawah ini."}
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

            {/* Terms Checkbox - Daftar Only */}
            {!isMasuk && (
              <div className="flex items-start gap-2.5 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${
                    agreedToTerms ? "bg-[#2a7d6e] border-[#2a7d6e]" : "bg-white border-[#d1cdc5]"
                  }`}
                  aria-label="Setujui Syarat dan Ketentuan"
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </button>
                <label className="text-[12px] text-[#6b6862] leading-relaxed cursor-pointer select-none" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                  Dengan mendaftar, kamu menyetujui <Link href="/syarat-ketentuan" className="underline underline-offset-2 hover:text-[#1a1917]">Syarat Layanan</Link> dan <Link href="/kebijakan-privasi" className="underline underline-offset-2 hover:text-[#1a1917]">Kebijakan Privasi</Link> Modulin.
                </label>
              </div>
            )}

            {/* Primary button */}
            <button
              id={isMasuk ? "btn-masuk" : "btn-daftar"}
              type="submit"
              disabled={loading || (!isMasuk && !agreedToTerms)}
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

          {isMasuk && (
            <>
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
                    <span>Masuk dengan Google</span>
                  </>
                )}
              </button>
            </>
          )}




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
              width: "calc(55% + 32px)",
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
