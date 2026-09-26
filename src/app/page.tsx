import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileText,
  BadgeCheck,
  ShieldCheck,
  SlidersHorizontal,
  BookOpen,
  Brain,
  Printer,
  ChevronRight,
  Info,
  Target,
  Users,
  Check,
  BarChart,
  Clipboard,
  Download,
  Bot,
  PlusSquare,
  Send,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-canvas text-ink font-body antialiased selection:bg-primary-light selection:text-primary min-h-screen flex flex-col">
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="bg-canvas border-b border-hairline sticky top-0 z-50 h-14">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-6 h-full">
          {/* Brand Logo */}
          <Link
            href="/"
            className="font-display text-2xl font-semibold tracking-tight text-ink flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
            Modulin
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#beranda"
              className="text-primary font-medium border-b-2 border-primary pb-1 text-sm transition-colors duration-200"
            >
              Beranda
            </Link>
            <Link
              href="#fitur"
              className="text-muted font-medium hover:text-primary text-sm transition-colors duration-200"
            >
              Fitur
            </Link>
            <Link
              href="#model-pembelajaran"
              className="text-muted font-medium hover:text-primary text-sm transition-colors duration-200"
            >
              Model Pembelajaran
            </Link>
            <Link
              href="#harga"
              className="text-muted font-medium hover:text-primary text-sm transition-colors duration-200"
            >
              Harga
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm font-medium text-ink hover:text-primary transition-colors duration-200 px-3 py-1.5"
            >
              Masuk
            </Link>
            <Link
              href="/create"
              className="bg-primary text-on-primary text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-active transition-all duration-200 shadow-sm flex items-center gap-1.5"
            >
              <span>Mulai Buat Modul</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ==================== HERO SECTION ==================== */}
        <section
          id="beranda"
          className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-hairline"
        >
          <div className="max-w-5xl mx-auto px-6">
            {/* Curated Badge */}
            <div className="flex justify-center md:justify-start mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-soft border border-hairline text-body text-xs font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Kurikulum Merdeka • Standar BSKAP No. 032/H/KR/2024</span>
              </div>
            </div>

            {/* Editorial Hero Headline & Description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-center md:text-left">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.08] mb-6">
                  Susun Modul Ajar Resmi <span className="italic font-normal text-primary">dalam Hitungan Menit.</span>
                </h1>
                <p className="text-base sm:text-lg text-body leading-relaxed mb-8 max-w-xl">
                  Pilih model pembelajaran dan materi pokok. Dapatkan perangkat ajar lengkap dengan sintaks kegiatan, diferensiasi proses, dan rubrik asesmen siap cetak.
                </p>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Link
                    href="/create"
                    className="w-full sm:w-auto bg-primary text-on-primary text-sm font-medium px-6 py-3 rounded-md hover:bg-primary-active transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Buat Modul Ajar</span>
                  </Link>
                  <Link
                    href="/editor"
                    className="w-full sm:w-auto border border-hairline bg-surface-card text-ink text-sm font-medium px-6 py-3 rounded-md hover:bg-surface-soft transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-muted" />
                    <span>Lihat Contoh Format Resmi</span>
                  </Link>
                </div>

                {/* Mini Endorsement Note */}
                <div className="mt-8 pt-6 border-t border-hairline flex items-center gap-3 justify-center md:justify-start text-xs text-muted">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                  <span>Menyelaraskan Capaian Pembelajaran resmi Kemendikbudristek</span>
                </div>
              </div>

              {/* Hero UI Mockup Card (Official Document Canvas) */}
              <div className="lg:col-span-5 relative">
                {/* Background accent soft glow */}
                <div className="absolute -inset-4 bg-primary-light/50 rounded-2xl filter blur-xl -z-10"></div>
                <div className="bg-surface-card rounded-xl border border-hairline p-6 shadow-sm relative">
                  {/* Official Document Header */}
                  <div className="border-b border-hairline pb-4 mb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[11px] tracking-wider text-muted uppercase font-semibold">MODUL AJAR KURIKULUM MERDEKA</span>
                      <h3 className="font-display text-xl font-semibold text-ink mt-1">Ekosistem & Keanekaragaman Hayati</h3>
                      <p className="text-xs text-muted">Fase D • Kelas VII SMP • 3 Pertemuan (6 JP)</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-light text-primary">
                      Lengkap 100%
                    </span>
                  </div>

                  {/* Module Structural Snippet */}
                  <div className="space-y-3 text-xs text-body">
                    <div className="p-2.5 rounded bg-canvas border border-hairline-soft">
                      <span className="font-medium text-[11px] mb-1 text-primary block">Tujuan Pembelajaran (TP)</span>
                      <p className="leading-relaxed text-[11.5px]">Peserta didik mampu menganalisis interaksi antar komponen biotik dan abiotik melalui investigasi lingkungan sekolah secara kolaboratif.</p>
                    </div>
                    <div className="p-2.5 rounded bg-canvas border border-hairline-soft">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-[11px] text-primary">Model: Problem-Based Learning</span>
                        <span className="text-[10px] text-muted">Sintaks 5 Langkah</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>Orientasi Masalah → Investigasi Mandiri → Gelar Karya</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro Badge 1 */}
                  <div className="absolute -top-3 -right-3 bg-surface-card border border-hairline px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs">
                    <ShieldCheck className="text-accent-amber w-4 h-4" />
                    <span className="text-ink font-medium">BSKAP No. 032</span>
                  </div>

                  {/* Floating Micro Badge 2 */}
                  <div className="absolute -bottom-3 -left-3 bg-surface-card border border-hairline px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs">
                    <SlidersHorizontal className="text-primary w-4 h-4" />
                    <span className="text-ink font-medium">Diferensiasi Terbimbing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL PROOF & STATISTIK SECTION ==================== */}
        <section className="py-12 bg-surface-soft border-b border-hairline">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">12.000+</div>
                <p className="text-xs md:text-sm text-muted mt-1">Modul Ajar Tersusun</p>
              </div>
              <div className="p-4">
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">8 Jam</div>
                <p className="text-xs md:text-sm text-muted mt-1">Waktu Hemat per Pekan</p>
              </div>
              <div className="p-4">
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">100%</div>
                <p className="text-xs md:text-sm text-muted mt-1">Sesuai Format BSKAP</p>
              </div>
              <div className="p-4">
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">6 Model</div>
                <p className="text-xs md:text-sm text-muted mt-1">Pedagogik Tersedia</p>
              </div>
            </div>

            {/* Teacher Quote Banner */}
            <div className="mt-8 pt-8 border-t border-hairline-soft max-w-3xl mx-auto text-center">
              <p className="font-display text-lg sm:text-xl italic text-ink font-normal leading-relaxed">
                "Sintaks pembelajarannya runut dan rubrik asesmennya langsung terpetakan ke tujuan pembelajaran. Format tabelnya rapi sesuai standar supervisi sekolah."
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-ink">Dewi Ratnasari, S.Pd.</span>
                <span className="text-muted text-xs">•</span>
                <span className="text-xs text-muted">Guru Penggerak, Bandung</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== KEUNGGULAN SECTION (3 Kolom Elegan) ==================== */}
        <section id="fitur" className="py-20 md:py-28 bg-canvas">
          <div className="max-w-5xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">Standar Resmi</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mt-2 mb-4">
                Format Kedinasan dengan Struktur Baku.
              </h2>
              <p className="text-base text-body leading-relaxed">
                Disusun sesuai pedoman supervisi pengawas dan kepala sekolah, lengkap dengan rubrik penilaian dan lembar pengesahan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Kolom 1 */}
              <div className="bg-surface-card rounded-xl p-8 border border-hairline transition-shadow hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-surface-soft border border-hairline-soft flex items-center justify-center text-primary mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink mb-3 tracking-tight">Penyelarasan CP &amp; TP</h3>
                  <p className="text-sm text-body leading-relaxed">
                    Penjabaran Capaian Pembelajaran resmi ke Tujuan Pembelajaran (TP) berdasarkan fase dan kelas peserta didik.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-hairline flex items-center gap-2 text-xs text-primary font-medium">
                  <span>Pedoman BSKAP</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Kolom 2 */}
              <div className="bg-surface-card rounded-xl p-8 border border-hairline transition-shadow hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-surface-soft border border-hairline-soft flex items-center justify-center text-primary mb-6">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink mb-3 tracking-tight">6 Model Pembelajaran</h3>
                  <p className="text-sm text-body leading-relaxed">
                    Pilihan model PBL, PjBL, Discovery, Inquiry, Cooperative, hingga CIRC dengan sintaks kegiatan per tahap.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-hairline flex items-center gap-2 text-xs text-primary font-medium">
                  <span>Sintaks Terstruktur</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Kolom 3 */}
              <div className="bg-surface-card rounded-xl p-8 border border-hairline transition-shadow hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-surface-soft border border-hairline-soft flex items-center justify-center text-primary mb-6">
                    <Printer className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink mb-3 tracking-tight">Ekspor Word (.docx)</h3>
                  <p className="text-sm text-body leading-relaxed">
                    Unduh dokumen dalam format Word (.docx) dan PDF dengan margin dinas resmi (3-2.5-2.5-2.5 cm) dan lembar pengesahan.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-hairline flex items-center gap-2 text-xs text-primary font-medium">
                  <span>Siap Tanda Tangan</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION PREVIEW EDITOR (Dark Surface Gelap Hangat) ==================== */}
        <section id="editor-preview" className="py-20 md:py-28 bg-surface-dark text-on-dark">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">Lingkungan Kerja Guru</span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-on-dark mt-2 mb-4">
                Editor Terstruktur Modul Ajar
              </h2>
              <p className="text-base text-on-dark-soft leading-relaxed">
                Sesuaikan urutan kegiatan, lengkapi instruksi diferensiasi, dan sunting isi dokumen sebelum mengunduh berkas.
              </p>
            </div>

            {/* 3-Column Studio Interface Mockup */}
            <div className="bg-surface-dark-elevated rounded-xl border border-[#2b3532] shadow-2xl overflow-hidden">
              {/* Editor Title Bar */}
              <div className="bg-[#121514] px-4 py-3 border-b border-[#2b3532] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-neutral-700"></span>
                    <span className="w-3 h-3 rounded-full bg-neutral-700"></span>
                    <span className="w-3 h-3 rounded-full bg-neutral-700"></span>
                  </div>
                  <span className="text-on-dark-soft border-l border-[#2b3532] pl-3 font-mono">Modul_Ajar_IPA_FaseD_Mitigasi_Bencana.docx</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-primary bg-primary-light/10 px-2 py-0.5 rounded border border-primary/30">Tersimpan Otomatis</span>
                  <button className="bg-primary text-on-primary px-3 py-1.5 rounded-md text-xs hover:bg-primary-active flex items-center gap-1.5 font-medium">
                    <Download className="w-4 h-4" /> Ekspor Dokumen
                  </button>
                </div>
              </div>

              {/* 3-Column Content Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
                {/* Left: Module Section Navigator */}
                <div className="md:col-span-3 bg-surface-dark-soft p-4 border-r border-[#2b3532] text-xs space-y-1">
                  <div className="text-[11px] text-muted uppercase tracking-wider mb-2 font-semibold">Struktur Modul Ajar</div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md bg-surface-dark-elevated text-primary font-medium cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4" /> Identitas Umum
                    </span>
                    <Check className="w-3 h-3" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-surface-dark-elevated text-on-dark-soft cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4" /> Capaian & TP
                    </span>
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-surface-dark-elevated text-on-dark-soft cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Profil Pelajar Pancasila
                    </span>
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md bg-primary/20 text-on-dark border border-primary/40 font-medium cursor-pointer">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" /> Kegiatan Inti (Sintaks)
                    </span>
                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">Aktif</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-surface-dark-elevated text-on-dark-soft cursor-pointer">
                    <span className="flex items-center gap-2">
                      <BarChart className="w-4 h-4" /> Asesmen & Rubrik
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-surface-dark-elevated text-on-dark-soft cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Clipboard className="w-4 h-4" /> LKPD Siswa
                    </span>
                  </div>
                </div>

                {/* Center: Interactive Document Canvas (Crisp Formal Sheet) */}
                <div className="md:col-span-6 bg-[#0f1211] p-6 overflow-y-auto">
                  <div className="bg-white text-[#1a1917] p-8 rounded-lg shadow-md max-w-md mx-auto text-xs leading-relaxed">
                    {/* Formal Document Sheet */}
                    <div className="border-b border-gray-200 pb-3 mb-4 text-center">
                      <h4 className="font-display text-lg font-bold text-black uppercase">MODUL AJAR: KEGIATAN INTI</h4>
                      <p className="text-[10px] text-gray-500">Model: Problem-Based Learning (PBL) • 2 JP (80 Menit)</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-gray-800 text-[11px] mb-1">Tahap 1: Orientasi Siswa pada Masalah (15 Menit)</h5>
                        <p className="text-gray-700 text-[11px]">Guru menayangkan video dokumenter singkat fenomena abrasi pesisir utara Jawa. Peserta didik mencatat 2 pertanyaan pemantik mandiri.</p>
                      </div>
                      
                      <div className="bg-emerald-50 border-l-2 border-emerald-600 p-2.5 rounded text-[10.5px]">
                        <span className="font-bold text-emerald-800 block mb-0.5">Diferensiasi Proses:</span>
                        <p className="text-emerald-900 leading-tight">Murid dengan gaya belajar kinestetik mengamati replika sedimen; murid visual menganalisis peta foto satelit.</p>
                      </div>
                      
                      <div>
                        <h5 className="font-bold text-gray-800 text-[11px] mb-1">Tahap 2: Mengorganisasi Siswa untuk Belajar (20 Menit)</h5>
                        <p className="text-gray-700 text-[11px]">Peserta didik dibagi menjadi 5 kelompok heterogen untuk merumuskan hipotesis pencegahan abrasi dengan metode tanggul alami.</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-3 border-t border-gray-200 text-[10px] text-gray-400 flex justify-between">
                      <span>Modulin Academic Paper Engine</span>
                      <span>Halaman 3 dari 6</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pedagogic Copilot AI Assistant Panel */}
                <div className="md:col-span-3 bg-surface-dark-soft p-4 border-l border-[#2b3532] flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2b3532]">
                      <Bot className="text-primary w-5 h-5" />
                      <span className="font-medium text-primary">Asisten Pedagogik Modulin</span>
                    </div>
                    
                    <div className="bg-surface-dark-elevated p-3 rounded-lg border border-[#2d3a36] mb-3 text-xs leading-relaxed text-[#dae5e0]">
                      <p className="mb-2 text-primary font-medium">Saran Diferensiasi Konten:</p>
                      <p className="text-[11.5px] text-on-dark-soft">Untuk siswa yang belum mencapai target pemahaman prasyarat, sediakan infografis kosakata dasar sains tentang rantai makanan.</p>
                      <button className="mt-2.5 w-full bg-primary/20 hover:bg-primary/30 text-primary text-[11px] py-1.5 px-2 rounded border border-primary/40 flex items-center justify-center gap-1.5 transition-colors">
                        <PlusSquare className="w-3.5 h-3.5" /> Sisipkan ke Rencana
                      </button>
                    </div>
                    
                    <div className="bg-surface-dark-elevated p-3 rounded-lg border border-[#2d3a36] text-xs text-[#dae5e0]">
                      <p className="mb-1 text-accent-amber font-medium">Cek Keterpaduan HOTS:</p>
                      <p className="text-[11px] text-on-dark-soft">Pertanyaan nomor 4 pada rubrik sudah mencakup level C4 (Menganalisis) dan C5 (Mengevaluasi).</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#2b3532]">
                    <div className="relative">
                      <input 
                        className="w-full bg-[#121514] border border-[#2b3532] text-xs text-on-dark placeholder-muted rounded-md px-3 py-2.5 pr-8 focus:outline-none focus:border-primary transition-colors" 
                        placeholder="Tanyakan saran asesmen alternatif..." 
                        type="text"
                      />
                      <button className="absolute right-2 top-2.5 text-primary hover:text-white transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ALUR 3 LANGKAH MUDAH ==================== */}
        <section className="py-20 md:py-28 bg-surface-soft border-b border-hairline">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">Alur Kerja</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mt-2 mb-3">
                Tiga Langkah Pembuatan Modul
              </h2>
              <p className="text-sm sm:text-base text-body">
                Tahapan terarah dari penentuan materi hingga dokumen siap cetak.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-surface-card p-6 rounded-xl border border-hairline relative">
                <span className="font-display text-4xl font-semibold text-primary-disabled/50 block mb-2">01</span>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">Identitas &amp; Topik</h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  Pilih mata pelajaran, kelas, dan topik materi. Sistem menentukan fase kurikulum yang sesuai.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-surface-card p-6 rounded-xl border border-hairline relative">
                <span className="font-display text-4xl font-semibold text-primary-disabled/50 block mb-2">02</span>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">Model Pembelajaran</h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  Pilih model pembelajaran sesuai karakteristik materi dan target capaian siswa.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-surface-card p-6 rounded-xl border border-hairline relative">
                <span className="font-display text-4xl font-semibold text-primary-disabled/50 block mb-2">03</span>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">Pratinjau &amp; Unduh</h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  Periksa format tabel resmi, lengkapi lembar pengesahan, lalu unduh berkas Word (.docx).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== MODEL PEMBELAJARAN SHOWCASE ==================== */}
        <section id="model-pembelajaran" className="py-20 md:py-28 bg-canvas">
          <div className="max-w-5xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">Fondasi Didaktik</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mt-2 mb-4">
                Pilihan Model Pembelajaran Resmi
              </h2>
              <p className="text-base text-body leading-relaxed">
                Setiap modul menyajikan sintaks pembelajaran bertahap sesuai panduan Kurikulum Merdeka.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 01</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Problem-Based Learning</h4>
                <p className="text-xs text-body leading-relaxed">
                  Lima tahap kegiatan untuk melatih nalar kritis peserta didik memecahkan masalah kontekstual.
                </p>
              </div>
              
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 02</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Project-Based Learning</h4>
                <p className="text-xs text-body leading-relaxed">
                  Penyusunan proyek nyata dari perencanaan, pembuatan prototipe, hingga pameran karya.
                </p>
              </div>
              
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 03</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Discovery Learning</h4>
                <p className="text-xs text-body leading-relaxed">
                  Eksplorasi terarah bagi peserta didik untuk membuktikan konsep secara langsung.
                </p>
              </div>
              
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 04</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Inquiry Terbimbing</h4>
                <p className="text-xs text-body leading-relaxed">
                  Investigasi terpandu dari perumusan hipotesis, pengumpulan data, hingga penarikan simpulan.
                </p>
              </div>
              
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 05</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Pembelajaran Berdiferensiasi</h4>
                <p className="text-xs text-body leading-relaxed">
                  Penyesuaian kegiatan belajar berdasarkan kesiapan, minat, dan profil belajar peserta didik.
                </p>
              </div>
              
              <div className="p-6 bg-surface-soft rounded-xl border border-hairline-soft">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Model 06</span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1 mb-2">Cooperative Learning</h4>
                <p className="text-xs text-body leading-relaxed">
                  Kerja kelompok terstruktur dengan pembagian peran dan tanggung jawab individu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CALL TO ACTION PENUTUP ==================== */}
        <section id="harga" className="py-20 md:py-24 bg-surface-card border-t border-hairline">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Perangkat Pembelajaran</span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-ink mt-3 mb-6">
              Siapkan Modul Ajar Resmi Hari Ini
            </h2>
            <p className="text-base text-body max-w-2xl mx-auto leading-relaxed mb-8">
              Susun perangkat ajar berstandar Kurikulum Merdeka dengan format resmi yang siap digunakan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="w-full sm:w-auto bg-primary text-on-primary text-base font-medium px-8 py-3.5 rounded-md hover:bg-primary-active transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Mulai Buat Modul Ajar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-muted mt-6">
              Standar format BSKAP No. 032/H/KR/2024 • Siap ekspor Microsoft Word (.docx)
            </p>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-surface-dark border-t border-surface-dark-elevated py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="font-display text-2xl font-semibold text-on-dark mb-2">
              Modulin
            </Link>
            <p className="text-xs text-on-dark-soft max-w-sm leading-relaxed">
              © 2026 Modulin. Perangkat ajar berstandar Kurikulum Merdeka.
            </p>
          </div>
          
          {/* Footer Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-on-dark-soft">
            <Link href="#" className="hover:text-primary transition-colors duration-200">Tentang Kami</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-200">Panduan Kurikulum Merdeka</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-200">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-200">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-200">Bantuan Guru</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
