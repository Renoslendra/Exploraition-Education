"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  PlusCircle,
  LayoutDashboard,
  User,
  Edit3,
  Check,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase/client";

interface UserProfileState {
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // State untuk profile pengguna
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    name: "Guru Pengajar",
    email: "guru.demo@modulin.id",
    image: null,
    role: "Guru Pengajar",
  });

  // Modal edit profil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [editRoleInput, setEditRoleInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sinkronisasi data user dari NextAuth (Google), Supabase, dan localStorage
  const syncProfile = () => {
    if (typeof window === "undefined") return;

    const savedName = localStorage.getItem("modulin_user_name");
    const savedRole = localStorage.getItem("modulin_user_role");
    const loggedInFlag = localStorage.getItem("modulin_logged_in");
    const isDashboardRoute =
      pathname?.startsWith("/editor") ||
      pathname?.startsWith("/create") ||
      pathname?.startsWith("/dashboard");

    // 1. Jika terautentikasi lewat Google (NextAuth)
    if (session?.user) {
      setIsLoggedIn(true);
      setUserProfile({
        name: savedName || session.user.name || "Guru Pengajar",
        email: session.user.email || "",
        image: session.user.image || null,
        role: savedRole || "Guru Pengajar",
      });
      return;
    }

    // 2. Jika bukan NextAuth, periksa Supabase Auth
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const sbUser = data?.user;
        if (sbUser) {
          setIsLoggedIn(true);
          const isDemo = sbUser.email === "guru.demo@modulin.id";
          const metaName = sbUser.user_metadata?.full_name;
          setUserProfile({
            name:
              savedName ||
              metaName ||
              (isDemo ? "Guru Demo Modulin" : sbUser.email?.split("@")[0] || "Guru Pengajar"),
            email: sbUser.email || "guru.demo@modulin.id",
            image: sbUser.user_metadata?.avatar_url || null,
            role: savedRole || (isDemo ? "Pendidik (Akun Demo)" : "Guru Pengajar"),
          });
        } else if (loggedInFlag === "true" || isDashboardRoute) {
          setIsLoggedIn(true);
          setUserProfile({
            name: savedName || "Guru Demo Modulin",
            email: "guru.demo@modulin.id",
            image: null,
            role: savedRole || "Pendidik (Akun Demo)",
          });
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        if (loggedInFlag === "true" || isDashboardRoute) {
          setIsLoggedIn(true);
          setUserProfile({
            name: savedName || "Guru Demo Modulin",
            email: "guru.demo@modulin.id",
            image: null,
            role: savedRole || "Pendidik (Akun Demo)",
          });
        } else {
          setIsLoggedIn(false);
        }
      });
  };

  useEffect(() => {
    syncProfile();
    setImageError(false);
  }, [pathname, session, status]);

  // Listener untuk update custom event dari modal/halaman lain
  useEffect(() => {
    const handleCustomUpdate = () => {
      syncProfile();
    };
    window.addEventListener("modulin_user_updated", handleCustomUpdate);
    return () => window.removeEventListener("modulin_user_updated", handleCustomUpdate);
  }, []);

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("modulin_logged_in");
      localStorage.removeItem("modulin_user_name");
      localStorage.removeItem("modulin_user_role");
    }
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);

    try {
      await supabase.auth.signOut();
    } catch {}

    if (session) {
      await signOut({ callbackUrl: "/" });
    } else {
      window.location.href = "/";
    }
  };

  const openEditModal = () => {
    setEditNameInput(userProfile.name);
    setEditRoleInput(userProfile.role);
    setIsEditModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;

    localStorage.setItem("modulin_user_name", editNameInput.trim());
    if (editRoleInput.trim()) {
      localStorage.setItem("modulin_user_role", editRoleInput.trim());
    }

    setUserProfile((prev) => ({
      ...prev,
      name: editNameInput.trim(),
      role: editRoleInput.trim() || prev.role,
    }));

    setSaveSuccess(true);
    window.dispatchEvent(new Event("modulin_user_updated"));

    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 600);
  };

  const getInitials = (name: string) => {
    if (!name) return "G";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const renderAvatar = (size: "sm" | "md" = "sm") => {
    const dimensions = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm";

    if (userProfile.image && !imageError) {
      return (
        <img
          src={userProfile.image}
          alt={userProfile.name}
          className={`${size === "sm" ? "w-8 h-8" : "w-11 h-11"} rounded-full object-cover border border-white/30 shadow-sm shrink-0`}
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div
        className={`${dimensions} rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#facc15] text-[#1a5c50] font-bold flex items-center justify-center shadow-inner shrink-0 tracking-wider`}
      >
        {getInitials(userProfile.name)}
      </div>
    );
  };

  const publicNavItems = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Fitur", href: "/fitur" },
    { label: "Template", href: "/editor" },
  ];

  const loggedInNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Buat Modul", href: "/create" },
    { label: "Riwayat Modul", href: "/editor" },
  ];

  const currentNavItems = isLoggedIn ? loggedInNavItems : publicNavItems;

  const checkIsActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const isHeroPage =
    !isLoggedIn &&
    (pathname === "/" || pathname === "/tentang" || pathname === "/fitur");
  const isSolid = !isHeroPage || isScrolled || isMobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center ${
          isSolid
            ? "h-[64px] bg-[#1a5c50] shadow-lg py-2"
            : "h-[80px] bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-full flex items-center justify-between">
          {/* Kiri: Logotype Modulin */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 transition-transform hover:scale-105 duration-200"
          >
            <Image
              src="/modulin-icon-only.png"
              alt="Modulin Logo"
              width={34}
              height={34}
              className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] md:w-[38px] md:h-[38px]"
            />
            <span className="font-display font-bold text-[22px] md:text-[26px] text-white tracking-tight drop-shadow-md">
              Modulin
            </span>
          </Link>

          {/* Tengah: Menu Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {currentNavItems.map((item) => {
              const active = checkIsActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[15px] drop-shadow-md transition-colors group ${
                    active
                      ? "text-white font-bold"
                      : "text-white/80 hover:text-white font-medium"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Kanan: Profil/Dropdown jika Logged In, atau Tombol Masuk */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full pl-1.5 pr-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-md group max-w-[240px]"
                >
                  {renderAvatar("sm")}
                  <div className="hidden sm:flex flex-col text-left leading-none overflow-hidden">
                    <span className="text-[13px] font-bold text-white tracking-tight truncate max-w-[130px]">
                      {userProfile.name}
                    </span>
                    <span className="text-[10px] text-white/75 font-medium mt-0.5 truncate max-w-[130px]">
                      {userProfile.role}
                    </span>
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-white/80 transition-transform duration-200 shrink-0 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-[#1c1b18] border border-[#383531] rounded-2xl shadow-2xl py-2 z-50 animate-fade-in text-white divide-y divide-[#383531]">
                    {/* Header Profil Dropdown */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {renderAvatar("md")}
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-bold text-white truncate">
                            {userProfile.name}
                          </p>
                          <p className="text-xs text-[#a09b93] truncate">
                            {userProfile.email}
                          </p>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#2a7d6e]/30 text-[#4ade80] border border-[#2a7d6e]/50 font-medium">
                            {userProfile.role}
                          </span>
                        </div>
                      </div>

                      {/* Tombol Edit Nama & Profil */}
                      <button
                        onClick={openEditModal}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-3 bg-white/10 hover:bg-white/15 text-[#e2dbd0] hover:text-white rounded-lg border border-white/15 transition-all cursor-pointer"
                      >
                        <Edit3 size={13} className="text-[#facc15]" />
                        <span>Edit Nama & Gelar</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#e2dbd0] hover:bg-[#2a7d6e] hover:text-white transition-colors"
                      >
                        <LayoutDashboard
                          size={15}
                          className="text-[#2a7d6e] group-hover:text-white"
                        />
                        <span>Dashboard Utama</span>
                      </Link>
                      <Link
                        href="/create"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#e2dbd0] hover:bg-[#2a7d6e] hover:text-white transition-colors"
                      >
                        <PlusCircle
                          size={15}
                          className="text-[#2a7d6e] group-hover:text-white"
                        />
                        <span>Buat Modul Baru</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={15} />
                        <span>Keluar / Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full px-6 hover:bg-[#dc2626] transition-all duration-200 items-center justify-center cursor-pointer shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]"
              >
                Masuk
              </Link>
            )}

            {/* Hamburger Mobile */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Navigasi Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-[64px] left-0 w-full bg-[#1a5c50] shadow-xl md:hidden border-t border-white/10 flex flex-col py-4 px-6 gap-3 animate-fade-in">
            {currentNavItems.map((item) => {
              const active = checkIsActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-[16px] border-b border-white/10 transition-all flex items-center justify-between ${
                    active
                      ? "text-white font-bold bg-white/15 shadow-inner"
                      : "text-white/90 hover:text-white font-medium hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isLoggedIn ? (
              <div className="pt-2 border-t border-white/20 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {renderAvatar("sm")}
                    <div className="text-xs text-white overflow-hidden">
                      <p className="font-bold truncate">{userProfile.name}</p>
                      <p className="text-white/70 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openEditModal();
                    }}
                    className="p-1.5 bg-white/15 hover:bg-white/25 rounded-md text-white shrink-0 ml-2"
                    title="Edit Nama"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="h-10 bg-red-600/90 text-white text-sm font-bold rounded-full mt-1 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full mt-2 flex items-center justify-center shadow-md"
              >
                Masuk
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Modal Dialog Edit Nama & Gelar Pengajar */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f4] w-full max-w-md rounded-2xl shadow-2xl border border-[#e2dbd0] overflow-hidden">
            <div className="bg-[#1a5c50] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <User size={18} className="text-[#facc15]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Edit Profil Pengajar</h3>
                  <p className="text-xs text-white/80">Sesuaikan nama resmi & gelar Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1917] uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar Akademik
                </label>
                <input
                  type="text"
                  required
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  placeholder="Contoh: Muhammad Zakaria, S.Pd., M.Pd."
                  className="w-full h-11 px-3.5 bg-white border border-[#d6cfc4] rounded-xl text-sm text-[#1a1917] focus:outline-none focus:ring-2 focus:ring-[#2a7d6e] focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-[#6b6862] mt-1">
                  Nama ini akan otomatis digunakan pada identitas modul ajar dan lembar pengesahan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1917] uppercase tracking-wider mb-1.5">
                  Peran / Mata Pelajaran yang Diampu
                </label>
                <input
                  type="text"
                  value={editRoleInput}
                  onChange={(e) => setEditRoleInput(e.target.value)}
                  placeholder="Contoh: Guru Pengajar / Guru IPA SMP"
                  className="w-full h-11 px-3.5 bg-white border border-[#d6cfc4] rounded-xl text-sm text-[#1a1917] focus:outline-none focus:ring-2 focus:ring-[#2a7d6e] focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 h-10 text-xs font-medium text-[#6b6862] hover:text-[#1a1917] hover:bg-[#ede7dc] rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="px-5 h-10 bg-[#2a7d6e] hover:bg-[#1f6358] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                >
                  {saveSuccess ? (
                    <>
                      <Check size={14} />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
