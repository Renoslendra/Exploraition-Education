"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MODELS = [
  {
    id: "pbl",
    name: "Problem-Based Learning (PBL)",
    focus: "Berhenti di solusi/ide",
    desc: "Pembelajaran dimulai dari masalah nyata; peserta didik merumuskan solusi tanpa harus membuat produk fisik.",
  },
  {
    id: "pjbl",
    name: "Project-Based Learning (PjBL)",
    focus: "Menghasilkan produk nyata",
    desc: "Peserta didik merancang, membuat, dan mempresentasikan produk nyata (artefak, prototipe).",
  },
  {
    id: "discovery",
    name: "Discovery Learning",
    focus: "Penemuan terbimbing",
    desc: "Guru membimbing peserta didik menemukan konsep melalui eksplorasi terarah.",
  },
  {
    id: "inquiry",
    name: "Inquiry Learning",
    focus: "Investigasi",
    desc: "Peserta didik merumuskan pertanyaan, merancang investigasi, dan menyimpulkan.",
  },
  {
    id: "cooperative",
    name: "Cooperative Learning",
    focus: "Kerja kelompok",
    desc: "Pembelajaran dalam kelompok kecil dengan peran dan tanggung jawab individual.",
  },
  {
    id: "circ",
    name: "CIRC",
    focus: "Literasi",
    desc: "Kooperatif berbasis membaca-menulis; umum untuk mata pelajaran bahasa.",
  },
];

export default function CreateModulePage() {
  const router = useRouter();
  
  // State: Model Pembelajaran
  const [selectedModel, setSelectedModel] = useState<string>("");

  // State: Form Identitas
  const [namaGuru, setNamaGuru] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [mapel, setMapel] = useState("");
  const [jenjang, setJenjang] = useState("SD");
  const [kelas, setKelas] = useState("1");
  const [bab, setBab] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");

  // State: Auto-fill Fase & Label
  const [fase, setFase] = useState("Fase A");
  const [isGenerating, setIsGenerating] = useState(false);

  // Logic: Dependent Dropdown (Jenjang -> Kelas -> Fase)
  useEffect(() => {
    if (jenjang === "PAUD/TK") {
      setKelas("");
      setFase("Fase Fondasi");
    } else {
      // Default fallback when switching jenjang
      if (jenjang === "SD" && (!kelas || parseInt(kelas) > 6)) setKelas("1");
      if (jenjang === "SMP" && (!kelas || parseInt(kelas) < 7 || parseInt(kelas) > 9)) setKelas("7");
      if (jenjang === "SMA/SMK" && (!kelas || parseInt(kelas) < 10)) setKelas("10");

      const k = parseInt(kelas);
      if (k === 1 || k === 2) setFase("Fase A");
      else if (k === 3 || k === 4) setFase("Fase B");
      else if (k === 5 || k === 6) setFase("Fase C");
      else if (k >= 7 && k <= 9) setFase("Fase D");
      else if (k === 10) setFase("Fase E");
      else if (k === 11 || k === 12) setFase("Fase F");
    }
  }, [jenjang, kelas]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert("Silakan pilih Model Pembelajaran terlebih dahulu!");
      return;
    }
    
    // Simulasi progress AI loading
    setIsGenerating(true);
    setTimeout(() => {
      // Pindah ke halaman editor setelah "selesai"
      router.push("/editor");
    }, 3000);
  };

  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-[120px] flex flex-col items-center justify-center text-center">
        <div className="bg-surface-card rounded-xl p-12 border border-hairline w-full max-w-xl shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
          <h2 className="font-display text-[28px] font-semibold text-ink mb-2">
            AI sedang meriset materi...
          </h2>
          <p className="text-muted text-[15px]">
            Menyusun modul {mapel} untuk {fase} berdasarkan model {selectedModel.toUpperCase()}.<br/>
            Proses ini memakan waktu beberapa detik.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[64px]">
      <h1 className="font-display text-[48px] font-semibold text-ink mb-2 tracking-[-1px]">
        Buat Modul Ajar
      </h1>
      <p className="text-muted text-[15px] mb-12">
        Pilih model pembelajaran dan lengkapi identitas untuk memulai riset AI.
      </p>
      
      <form onSubmit={handleGenerate} className="space-y-[64px]">
        
        {/* SECTION 1: Model Pembelajaran */}
        <section>
          <h2 className="text-[20px] font-medium text-ink mb-6">1. Pilih Model Pembelajaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="radiogroup" aria-label="Model Pembelajaran">
            {MODELS.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <div 
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedModel(m.id);
                  }}
                  className={`rounded-[12px] p-6 cursor-pointer transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isSelected 
                      ? "bg-primary-light border-primary shadow-sm ring-1 ring-primary" 
                      : "bg-surface-card border-hairline hover:border-muted hover:-translate-y-1 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-[22px] font-semibold text-ink leading-tight">
                      {m.name}
                    </h3>
                    <span className="bg-surface-cream-strong text-ink text-[11px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ml-2">
                      {m.focus}
                    </span>
                  </div>
                  <p className="text-[14px] text-body">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-t border-hairline" />

        {/* SECTION 2: Form Identitas */}
        <section className="flex justify-center">
          <div className="w-full max-w-[640px]">
            <h2 className="text-[20px] font-medium text-ink mb-6">2. Identitas Modul</h2>
            
            <div className="bg-surface-card rounded-[16px] p-8 border border-hairline space-y-6 shadow-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="namaGuru" className="block text-[14px] font-medium text-body-strong mb-2">Nama Guru</label>
                  <input 
                    id="namaGuru"
                    type="text" 
                    required
                    value={namaGuru}
                    onChange={(e) => setNamaGuru(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="sekolah" className="block text-[14px] font-medium text-body-strong mb-2">Instansi / Sekolah</label>
                  <input 
                    id="sekolah"
                    type="text" 
                    required
                    value={sekolah}
                    onChange={(e) => setSekolah(e.target.value)}
                    placeholder="Masukkan nama sekolah"
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mapel" className="block text-[14px] font-medium text-body-strong mb-2">Mata Pelajaran</label>
                <input 
                  id="mapel"
                  type="text" 
                  required
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  placeholder="Ketik mata pelajaran..."
                  className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="jenjang" className="block text-[14px] font-medium text-body-strong mb-2">Jenjang</label>
                  <select 
                    id="jenjang"
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value)}
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink cursor-pointer"
                  >
                    <option value="PAUD/TK">PAUD / TK</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA/SMK">SMA / SMK</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="kelas" className="block text-[14px] font-medium text-body-strong mb-2">Kelas</label>
                  <select 
                    id="kelas"
                    disabled={jenjang === "PAUD/TK"}
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink disabled:opacity-50 disabled:bg-surface-soft cursor-pointer"
                  >
                    {jenjang === "PAUD/TK" && <option value="">-</option>}
                    {jenjang === "SD" && [1,2,3,4,5,6].map(k => <option key={k} value={k}>Kelas {k}</option>)}
                    {jenjang === "SMP" && [7,8,9].map(k => <option key={k} value={k}>Kelas {k}</option>)}
                    {jenjang === "SMA/SMK" && [10,11,12].map(k => <option key={k} value={k}>Kelas {k}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-body-strong mb-2">Fase</label>
                  <div className="w-full bg-surface-soft border border-hairline-soft rounded-md px-[14px] py-[10px] h-[40px] text-[15px] text-muted-soft select-none flex items-center justify-between" aria-readonly="true">
                    <span>{fase}</span>
                    <span className="text-[10px] uppercase bg-canvas px-1.5 py-0.5 rounded text-muted border border-hairline tracking-wide">Otomatis</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bab" className="block text-[14px] font-medium text-body-strong mb-2">Bab / Topik Materi</label>
                  <textarea 
                    id="bab"
                    required
                    value={bab}
                    onChange={(e) => setBab(e.target.value)}
                    placeholder="Sebutkan topik spesifik..."
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink min-h-[120px] resize-y transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="tahunAjaran" className="block text-[14px] font-medium text-body-strong mb-2">Tahun Ajaran</label>
                  <select 
                    id="tahunAjaran"
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink cursor-pointer"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                    <option value="2027/2028">2027/2028</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                className="bg-primary text-on-primary font-medium text-[14px] px-5 py-2.5 h-[40px] rounded-md hover:bg-primary-active transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary flex items-center justify-center gap-2"
              >
                Generate Modul
              </button>
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
