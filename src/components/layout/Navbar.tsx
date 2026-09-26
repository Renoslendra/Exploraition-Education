"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-[56px] bg-canvas border-b border-hairline sticky top-0 z-50 flex items-center">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/modulin-logo.png" 
            alt="Modulin Logo" 
            width={24} 
            height={24}
            className="object-contain"
          />
          <span className="font-display text-[22px] font-semibold tracking-[-0.2px] text-ink">
            Modulin
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 h-[56px]">
          <Link 
            href="/dashboard" 
            className={`text-[14px] font-medium transition-colors flex items-center h-full hover:text-primary ${pathname === "/dashboard" ? "text-primary border-b-2 border-primary" : "text-muted"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/create" 
            className={`text-[14px] font-medium transition-colors flex items-center h-full hover:text-primary ${pathname === "/create" ? "text-primary border-b-2 border-primary" : "text-muted"}`}
          >
            Buat Modul
          </Link>
        </div>

        {/* Profile (Dummy) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold">
            PA
          </div>
          <span className="text-[14px] font-medium text-ink hidden md:block">
            Pak Andi
          </span>
        </div>
      </div>
    </nav>
  );
}
