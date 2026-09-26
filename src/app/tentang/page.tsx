import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const TENTANG_FAQS = [
  {
    q: "Apa itu Modulin?",
    a: "Modulin adalah platform cerdas berbasis AI yang dirancang khusus untuk membantu Guru Indonesia menyusun Modul Ajar dan RPP berstandar Kurikulum Merdeka secara otomatis, cepat, dan presisi."
  },
  {
    q: "Siapa yang membuat Modulin?",
    a: "Modulin dikembangkan oleh tim Exploraition untuk memberikan solusi praktis dalam mengurangi beban administrasi guru, khususnya dalam penyusunan format BSKAP resmi yang siap supervisi."
  },
  {
    q: "Apakah modul yang dihasilkan sesuai standar?",
    a: "Tentu saja. Format akhir yang dihasilkan oleh Modulin telah disesuaikan dengan standar regulasi BSKAP terbaru dari Kemendikbudristek untuk memastikan kelengkapan komponen."
  }
];

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4]">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-12 pb-24 px-6 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-12">
          {/* Breadcrumb */}
          <div className="text-[13px] text-[#908c84] mb-6 font-inter inline-flex items-center">
            <Link href="/" className="hover:text-[#2a7d6e] transition-colors">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1a1917] font-medium">Tentang Kami</span>
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-5xl text-[#1a1917] tracking-tight mb-6">
            Mengenal Modulin Lebih Dekat
          </h1>
          <p className="text-[#6b6862] text-[16px] md:text-[18px] max-w-2xl leading-relaxed">
            Modulin bukan sekadar generator teks biasa. Kami hadir sebagai asisten pedagogik virtual yang didesain khusus 
            untuk mengerti kebutuhan administratif Guru Indonesia di era Kurikulum Merdeka.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#e2dbd0] shadow-sm mb-12">
          <h2 className="font-display font-semibold text-2xl text-[#1a1917] mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1a5c50] text-white flex items-center justify-center text-sm font-bold">?</span>
            Pertanyaan Seputar Platform
          </h2>
          
          <div className="border-t border-[#e2dbd0]">
            {TENTANG_FAQS.map((faq, idx) => (
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
