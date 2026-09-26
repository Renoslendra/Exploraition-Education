import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, Sparkles, LayoutList, PenSquare } from "lucide-react";
import Link from "next/link";

const FITUR_FAQS = [
  {
    q: "Berapa lama waktu untuk membuat satu modul?",
    a: "Anda hanya membutuhkan waktu kurang dari 15 menit. Pilih model, masukkan identitas, dan Modulin akan merancang komponen inti seperti Capaian Pembelajaran secara otomatis."
  },
  {
    q: "Format apa saja yang bisa diunduh?",
    a: "Anda dapat mengekspor Modul Ajar dalam bentuk Word (.docx) untuk disunting kembali, atau PDF (.pdf) untuk langsung dicetak dan diserahkan."
  },
  {
    q: "Apakah tersedia untuk semua mata pelajaran?",
    a: "Ya, Modulin mencakup seluruh rentang jenjang (Fase A hingga F) dan dapat disesuaikan untuk berbagai mata pelajaran di Kurikulum Merdeka."
  },
  {
    q: "Apakah saya bisa mengedit hasilnya?",
    a: "Tentu saja! Setelah AI selesai membuat draf modul, Anda akan masuk ke halaman Editor Modul Instan di mana Anda dapat merevisi teks, menambah tabel, atau menyesuaikan alur sebelum mengekspornya."
  }
];

const FITUR_UTAMA = [
  {
    icon: Sparkles,
    title: "Drafting Otomatis AI",
    desc: "Komponen utama seperti Capaian Pembelajaran, Tujuan Pembelajaran, hingga Kegiatan Inti dirancang cerdas oleh AI."
  },
  {
    icon: LayoutList,
    title: "Format Resmi BSKAP",
    desc: "Keluaran dokumen disusun persis mengikuti struktur panduan terbaru BSKAP Kemendikbudristek."
  },
  {
    icon: PenSquare,
    title: "Editor Modul Instan",
    desc: "Anda bisa langsung merevisi hasil, menambah baris tabel, atau mengubah gaya bahasa langsung dari editor."
  }
];

export default function FiturPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4]">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-12 pb-24 px-6 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-12">
          {/* Breadcrumb */}
          <div className="text-[13px] text-[#908c84] mb-6 font-inter inline-flex items-center">
            <Link href="/" className="hover:text-[#2a7d6e] transition-colors">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1a1917] font-medium">Fitur Unggulan</span>
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-5xl text-[#1a1917] tracking-tight mb-6">
            Fitur yang Dirancang untuk Guru
          </h1>
          <p className="text-[#6b6862] text-[16px] md:text-[18px] max-w-2xl leading-relaxed">
            Eksplorasi fungsionalitas yang ada di dalam Modulin. Semua fitur ini diciptakan agar Anda dapat 
            fokus pada pengajaran, bukan terjebak dalam administrasi.
          </p>
        </div>

        {/* Fitur Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {FITUR_UTAMA.map((fitur, i) => {
            const Icon = fitur.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#e2dbd0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#e6f3f0] text-[#2a7d6e] flex items-center justify-center mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#1a1917] mb-3">{fitur.title}</h3>
                <p className="text-[#6b6862] text-[14px] leading-relaxed">{fitur.desc}</p>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#e2dbd0] shadow-sm max-w-3xl mx-auto w-full">
          <h2 className="font-display font-semibold text-2xl text-[#1a1917] mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#facc15] text-[#1a1917] flex items-center justify-center text-sm font-bold">★</span>
            Pertanyaan Seputar Fitur
          </h2>
          
          <div className="border-t border-[#e2dbd0]">
            {FITUR_FAQS.map((faq, idx) => (
              <details key={idx} className="group border-b border-[#e2dbd0]">
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none font-inter font-semibold text-[#1a1917] text-[15px]">
                  {faq.q}
                  <span className="transition group-open:rotate-180 text-[#a09b93]">
                    <ChevronDown size={18} />
                  </span>
                </summary>
                <p className="text-[#6b6862] text-[14px] leading-relaxed pb-5 pt-1">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
