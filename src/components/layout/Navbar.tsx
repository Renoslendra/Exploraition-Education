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
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    const loggedInFlag =
      typeof window !== "undefined"
        ? localStorage.getItem("modulin_logged_in")
        : null;
    const isDashboardRoute =
      pathname?.startsWith("/editor") ||
      pathname?.startsWith("/create") ||
      pathname?.startsWith("/dashboard");

    if (loggedInFlag === "true" || isDashboardRoute) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("modulin_logged_in");
    }
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
    window.location.href = "/";
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
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full pl-2 pr-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-md group"
              >
                <div className="w-8 h-8 rounded-full bg-[#facc15] text-[#1a5c50] font-bold text-sm flex items-center justify-center shadow-inner shrink-0">
                  A
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[13px] font-bold text-white tracking-tight">
                    Ahmad Faozan
                  </span>
                  <span className="text-[10px] text-white/75 font-medium mt-0.5">
                    Guru Pengajar
                  </span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-white/80 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-[#1c1b18] border border-[#383531] rounded-2xl shadow-2xl py-2 z-50 animate-fade-in text-white divide-y divide-[#383531]">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#facc15] text-[#1a5c50] font-bold text-base flex items-center justify-center shrink-0">
                      A
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">
                        Ahmad Faozan, S.Pd.I
                      </p>
                      <p className="text-xs text-[#a09b93] truncate">
                        guru@modulin.id
                      </p>
                    </div>
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
              <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#facc15] text-[#1a5c50] font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <div className="text-xs text-white">
                  <p className="font-bold">Ahmad Faozan, S.Pd.I</p>
                  <p className="text-white/70">guru@modulin.id</p>
                </div>
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
  );
}
