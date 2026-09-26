"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 w-full z-50 h-[64px] bg-[#1a5c50]/90 backdrop-blur-md shadow-lg py-2 flex items-center">
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
          <Link href="/" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
            Beranda
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300"></span>
          </Link>
          <Link href="/tentang" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
            Tentang
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300"></span>
          </Link>
          <Link href="/editor" className="relative text-white text-[15px] font-bold drop-shadow-md group">
            Template
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full transition-transform origin-left scale-x-100"></span>
          </Link>
          <Link href="/fitur" className="relative text-white/90 hover:text-white text-[15px] font-medium drop-shadow-md transition-colors group">
            Fitur
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
        <div className="absolute top-[64px] left-0 w-full bg-[#1a5c50] shadow-xl md:hidden border-t border-white/10 flex flex-col py-4 px-6 gap-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Beranda</Link>
          <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Tentang</Link>
          <Link href="/editor" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-white text-[16px] font-bold py-2 border-b border-white/10">Template</Link>
          <Link href="/fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white text-[16px] font-medium py-2 border-b border-white/10">Fitur</Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="h-10 bg-[#ef4444] text-white text-sm font-bold rounded-full mt-2 flex items-center justify-center">
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
}
