import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-on-dark-soft py-12 border-t border-surface-dark-elevated mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-display text-[22px] font-semibold text-on-dark">
            Modulin
          </span>
          <p className="text-[13px] text-on-dark-soft">
            Penyusun Modul Ajar Resmi Kurikulum Merdeka.
          </p>
        </div>
        
        <div className="text-[13px] flex gap-6">
          <Link href="#" className="hover:text-on-dark transition-colors">Bantuan</Link>
          <Link href="#" className="hover:text-on-dark transition-colors">Privasi</Link>
          <Link href="#" className="hover:text-on-dark transition-colors">Ketentuan</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center text-[12px] text-on-dark-soft">
        &copy; {new Date().getFullYear()} Modulin Team. All Rights Reserved.
      </div>
    </footer>
  );
}
