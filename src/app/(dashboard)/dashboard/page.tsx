import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[64px]">
      <h1 className="font-display text-[36px] font-semibold text-ink mb-8 tracking-[-0.5px]">
        Modul Ajar Saya
      </h1>
      
      <div className="bg-surface-card rounded-lg border border-hairline p-12 text-center">
        <p className="text-muted mb-6 text-[15px]">
          Anda belum memiliki modul. Yuk mulai buat modul pertama Anda!
        </p>
        <Link 
          href="/create" 
          className="inline-flex bg-primary text-on-primary rounded-md px-5 py-2.5 text-[14px] font-medium hover:bg-primary-active transition-colors shadow-sm"
        >
          Buat Modul Baru
        </Link>
      </div>
    </div>
  );
}
