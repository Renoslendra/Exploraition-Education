import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { FileText, AlertCircle } from "lucide-react";

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] font-sans selection:bg-[#e6f3f0] selection:text-[#1f6358]">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-12 pb-24 px-6 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-12">
          {/* Breadcrumb */}
          <div className="text-[13px] text-[#908c84] mb-6 font-inter inline-flex items-center">
            <Link href="/" className="hover:text-[#2a7d6e] transition-colors">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1a1917] font-medium">Syarat & Ketentuan</span>
          </div>

          <div className="bg-[#e6f3f0] p-4 rounded-full mb-6 text-[#2a7d6e]">
            <FileText size={36} />
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-5xl text-[#1a1917] tracking-tight mb-6">
            Syarat & Ketentuan
          </h1>
          <p className="text-[#6b6862] text-[16px] md:text-[18px] max-w-2xl leading-relaxed">
            Harap baca syarat dan ketentuan layanan ini dengan saksama sebelum menggunakan platform Modulin.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#e2dbd0] shadow-sm mb-12 prose prose-p:text-[#444340] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[#1a1917] prose-a:text-[#2a7d6e] max-w-none">
          <p className="text-sm text-[#908c84] mb-8">Diperbarui pada: 15 Agustus 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Selamat Datang di Modulin</h2>
          <p>
            Terima kasih telah memilih Modulin sebagai rekan mengajar Anda! Dengan mendaftar dan menggunakan Modulin, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini. Jika ada poin yang membuat Anda ragu, Anda berhak untuk tidak melanjutkan penggunaan layanan kami.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Layanan yang Kami Berikan</h2>
          <p>
            Modulin adalah asisten pintar berbasis kecerdasan buatan (*Artificial Intelligence* / AI) yang dirancang khusus untuk mempermudah Bapak/Ibu Guru di Indonesia. Kami membantu Anda menyusun dokumen administratif seperti Modul Ajar dan Rencana Pelaksanaan Pembelajaran (RPP) yang selaras dengan panduan resmi Kurikulum Merdeka (BSKAP).
          </p>
          
          <div className="bg-[#faf8f4] border-l-4 border-[#c4694e] p-4 my-6 rounded-r-md">
            <p className="m-0 text-[#444340] font-medium flex items-start gap-3">
              <AlertCircle className="text-[#c4694e] shrink-0 mt-0.5" size={20} />
              <span>
                <strong>Catatan Penting Penggunaan AI:</strong> Hasil tulisan yang dibuat oleh AI Modulin sebaiknya dianggap sebagai <strong>draf awal (rancangan dasar)</strong>. Anda sebagai Guru tetap memegang kendali penuh untuk meninjau, mengubah, dan memastikan bahwa isi modul sudah benar-benar cocok dengan karakteristik dan kebutuhan siswa di kelas Anda.
              </span>
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Tanggung Jawab Akun</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-[#444340]">
            <li>Anda bertanggung jawab menjaga kerahasiaan kata sandi dan keamanan akun Anda sendiri.</li>
            <li>Anda setuju untuk mendaftar dengan informasi identitas yang jujur, akurat, dan lengkap.</li>
            <li>Demi kenyamanan bersama, kami berhak menangguhkan akun yang terbukti digunakan untuk tindakan melanggar hukum, mengirimkan *spam*, atau membahayakan sistem kami.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Hak Cipta Karya Anda</h2>
          <p>
            Sistem, desain, dan kode di balik Modulin adalah milik tim pengembang kami. Namun, yang paling penting: <strong>seluruh dokumen Modul Ajar yang berhasil Anda buat melalui aplikasi kami adalah sepenuhnya milik Anda.</strong> Anda bebas mencetak, membagikan, atau menggunakan karya tersebut untuk keperluan mengajar di sekolah Anda.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Pembaruan Layanan dan Ketentuan</h2>
          <p>
            Karena Modulin terus berkembang, layanan disediakan "sebagaimana adanya". Sesekali, kami mungkin melakukan perbaikan atau menemukan kendala teknis dari sistem AI kami. Kami juga mungkin memperbarui Syarat & Ketentuan ini agar terus relevan. Setiap perubahan besar akan kami kabarkan langsung melalui surel atau papan pengumuman di dasbor Anda. Terus menggunakan Modulin setelah pembaruan berarti Anda menyetujui ketentuan baru tersebut.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
