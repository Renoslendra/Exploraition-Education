import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
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
            &copy; {new Date().getFullYear()} Modulin by Exploraition. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-gray-500">
            <span>Dibuat oleh tim S.Kom-EDI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
