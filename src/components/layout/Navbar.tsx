"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Fitur", href: "/fitur" },
    { label: "Template", href: "/editor" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const isHeroPage = pathname === "/" || pathname === "/tentang" || pathname === "/fitur";
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
        <Link href="/" className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-105 duration-200">
          <Image
            src="/modulin-icon-only.png"
            alt="Modulin Icon"
            width={32}
            height={32}
            className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] md:w-[40px] md:h-[40px]"
          />
          <span className="font-display font-bold text-[22px] md:text-[28px] text-white tracking-tight drop-shadow-md">
            Modulin
          </span>
        </Link>

        {/* Tengah: Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = checkIsActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[15px] drop-shadow-md transition-colors group ${
                  active ? "text-white font-bold" : "text-white/80 hover:text-white font-medium"
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

        {/* Kanan: Tombol Masuk Desktop & Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full px-6 hover:bg-[#dc2626] transition-all duration-200 items-center justify-center cursor-pointer shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]"
          >
            Masuk
          </Link>

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
          {navItems.map((item) => {
            const active = checkIsActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-[16px] border-b border-white/10 transition-all ${
                  active
                    ? "text-white font-bold bg-white/15 shadow-inner"
                    : "text-white/90 hover:text-white font-medium hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full mt-2 flex items-center justify-center shadow-md"
          >
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
}

