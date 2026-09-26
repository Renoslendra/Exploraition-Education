import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export default function KebijakanPrivasiPage() {
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
            <span className="text-[#1a1917] font-medium">Kebijakan Privasi</span>
          </div>

          <div className="bg-[#e6f3f0] p-4 rounded-full mb-6 text-[#2a7d6e]">
            <ShieldCheck size={36} />
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-5xl text-[#1a1917] tracking-tight mb-6">
            Kebijakan Privasi
          </h1>
          <p className="text-[#6b6862] text-[16px] md:text-[18px] max-w-2xl leading-relaxed">
            Komitmen kami untuk melindungi data Anda. Pelajari bagaimana Modulin mengumpulkan, menggunakan, dan menjaga keamanan informasi pribadi Anda.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#e2dbd0] shadow-sm mb-12 prose prose-p:text-[#444340] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[#1a1917] prose-a:text-[#2a7d6e] max-w-none">
          <p className="text-sm text-[#908c84] mb-8">Diperbarui pada: 15 Agustus 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Pendahuluan</h2>
          <p>
            Selamat datang di Modulin! Privasi dan keamanan data Anda adalah prioritas utama kami. Kebijakan Privasi ini disusun secara transparan untuk menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Informasi yang Kami Simpan</h2>
          <p>
            Untuk memberikan pengalaman terbaik, kami hanya menyimpan informasi yang benar-benar kami butuhkan:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-[#444340]">
            <li><strong>Data Akun:</strong> Nama, alamat surel (email), dan kata sandi Anda saat mendaftar.</li>
            <li><strong>Profil Guru:</strong> Nama sekolah, mata pelajaran, serta jenjang/fase kelas yang Anda ampu agar modul yang dihasilkan selalu relevan.</li>
            <li><strong>Aktivitas Pembuatan Modul:</strong> Preferensi model pembelajaran (seperti PBL/PjBL) dan hasil draf Modul Ajar yang Anda buat agar Anda bisa mengaksesnya kembali di dasbor.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Bagaimana Kami Menggunakan Data Anda</h2>
          <p>
            Kami berkomitmen untuk menggunakan data Anda secara bertanggung jawab, secara khusus untuk:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-[#444340]">
            <li>Menyediakan dan memastikan aplikasi Modulin berjalan lancar setiap saat.</li>
            <li>Menyesuaikan hasil tulisan AI (*Artificial Intelligence*) agar lebih pas dengan konteks dan gaya mengajar Anda di kelas.</li>
            <li>Melindungi akun Anda dari akses yang tidak sah atau penyalahgunaan.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Privasi Berlapis pada Penggunaan AI</h2>
          <div className="bg-[#faf8f4] border-l-4 border-[#d4940a] p-4 my-6 rounded-r-md">
            <p className="m-0 text-[#444340] font-medium flex items-start gap-3">
              <Lock className="text-[#d4940a] shrink-0 mt-0.5" size={20} />
              <span>
                <strong>Perlindungan Data AI:</strong> Semua instruksi (*prompt*) dan materi yang Anda masukkan <strong>tidak akan pernah digunakan</strong> untuk melatih model AI publik secara massal. Data Anda aman dan hanya diakses oleh Anda dalam sesi kerja Anda sendiri.
              </span>
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Keamanan dan Kerahasiaan Pihak Ketiga</h2>
          <p>
            Modulin <strong>tidak akan pernah menjual atau menyewakan</strong> data pribadi Anda kepada pihak mana pun. Kami hanya membagikan data teknis dengan penyedia infrastruktur tepercaya (seperti layanan peladen *cloud* dan API pemrosesan bahasa) semata-mata agar aplikasi dapat beroperasi, dan mereka terikat oleh perjanjian kerahasiaan data yang sangat ketat.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
