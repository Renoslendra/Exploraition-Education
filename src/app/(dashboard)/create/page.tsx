"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MODELS = [
  {
    id: "pbl",
    name: "Problem-Based Learning (PBL)",
    focus: "Pemecahan Masalah",
    desc: "Peserta didik menganalisis dan merumuskan solusi atas masalah nyata.",
  },
  {
    id: "pjbl",
    name: "Project-Based Learning (PjBL)",
    focus: "Produk Nyata",
    desc: "Peserta didik merancang dan menghasilkan produk atau artefak nyata.",
  },
  {
    id: "discovery",
    name: "Discovery Learning",
    focus: "Penemuan Terbimbing",
    desc: "Peserta didik menemukan konsep melalui eksplorasi dan pembuktian mandiri.",
  },
  {
    id: "inquiry",
    name: "Inquiry Learning",
    focus: "Investigasi Ilmiah",
    desc: "Peserta didik merumuskan hipotesis, mengumpulkan data, dan menarik simpulan.",
  },
  {
    id: "cooperative",
    name: "Cooperative Learning",
    focus: "Kerja Kelompok",
    desc: "Kerja kelompok terstruktur dengan tanggung jawab peran individu.",
  },
  {
    id: "circ",
    name: "CIRC",
    focus: "Literasi Terpadu",
    desc: "Pembelajaran kooperatif terpadu untuk membaca, menulis, dan membedah wacana.",
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
  const [alokasiWaktu, setAlokasiWaktu] = useState("2 x 45 menit (1 Pertemuan)");

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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("Menghubungkan layanan modul...");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert("Pilih model pembelajaran terlebih dahulu.");
      return;
    }
    
    setErrorMsg(null);
    setIsGenerating(true);
    setLoadingStep("Menyelaraskan Capaian Pembelajaran resmi...");

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep("Menyusun 10 komponen perangkat ajar...");
      }, 2500);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep("Menyusun rubrik asesmen dan langkah pembelajaran...");
      }, 5500);

      const res = await fetch("/api/modules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identitas: {
            namaGuru,
            instansi: sekolah,
            mataPelajaran: mapel,
            jenjang,
            kelas,
            fase: fase.replace("Fase ", ""),
            tahunAjaran,
            bab,
            alokasiWaktu,
          },
          modelPembelajaran: MODELS.find((m) => m.id === selectedModel),
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const result = await res.json();

      if (!result.success || !result.structuredData) {
        throw new Error(result.error || "Gagal menyusun modul ajar.");
      }

      // Simpan structured data dan html ke localStorage untuk dimuat di /editor
      localStorage.setItem("modulin_active_structured", JSON.stringify(result.structuredData));
      
      const fullHtml = (result.sections || [])
        .map((s: any) => `<h2>${s.judul}</h2>${s.konten}<br/>`)
        .join("\n<hr/>\n");

      localStorage.setItem("modulin_active_html", fullHtml);
      localStorage.setItem("modulin_active_title", `Modul Ajar ${mapel} Kelas ${kelas}`);

      router.push("/editor");
    } catch (err: any) {
      console.error("Generate error:", err);
      setIsGenerating(false);
      setErrorMsg(err?.message || "Layanan pembuatan modul sedang tidak dapat diakses.");
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-[120px] flex flex-col items-center justify-center text-center">
        <div className="bg-surface-card rounded-xl p-12 border border-hairline w-full max-w-xl shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-3.5 h-3.5 bg-primary rounded-full animate-bounce delay-200"></div>
              <div className="w-3.5 h-3.5 bg-primary rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
          <h2 className="font-display text-[26px] font-semibold text-ink mb-2">
            Menyusun Modul Ajar
          </h2>
          <p className="text-primary font-medium text-[15px] mb-2">
            {loadingStep}
          </p>
          <p className="text-muted text-[13px]">
            {mapel || "Mata Pelajaran"} • {fase} • Model {selectedModel.toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[56px]">
      <h1 className="font-display text-[40px] font-semibold text-ink mb-2 tracking-[-0.8px]">
        Buat Modul Ajar
      </h1>
      <p className="text-muted text-[15px] mb-10">
        Pilih model pembelajaran dan lengkapi identitas perangkat ajar.
      </p>
      
      <form onSubmit={handleGenerate} className="space-y-[48px]">
        
        {/* SECTION 1: Model Pembelajaran */}
        <section>
          <h2 className="text-[18px] font-semibold text-ink mb-5">1. Model Pembelajaran</h2>
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
            <h2 className="text-[18px] font-semibold text-ink mb-5">2. Identitas Perangkat Ajar</h2>
            
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
                    placeholder="Contoh: Ahmad Faozan, S.Pd"
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
                    placeholder="Contoh: SMK Mabdaul Falah"
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
                  placeholder="Contoh: Bahasa Inggris"
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
                  <label htmlFor="bab" className="block text-[14px] font-medium text-body-strong mb-2">Materi Pokok / Bab</label>
                  <textarea 
                    id="bab"
                    required
                    value={bab}
                    onChange={(e) => setBab(e.target.value)}
                    placeholder="Contoh: Teks Deskriptif tentang Tokoh Inspiratif Dunia"
                    className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink min-h-[120px] resize-y transition-shadow"
                  />
                </div>
                <div className="space-y-4">
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
                  <div>
                    <label htmlFor="alokasiWaktu" className="block text-[14px] font-medium text-body-strong mb-2">Alokasi Waktu</label>
                    <input 
                      id="alokasiWaktu"
                      type="text"
                      value={alokasiWaktu}
                      onChange={(e) => setAlokasiWaktu(e.target.value)}
                      placeholder="Contoh: 2 x 45 menit (1 Pertemuan)"
                      className="w-full bg-canvas border border-hairline rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-ink transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {errorMsg && (
              <div className="mt-4 p-4 rounded-md bg-red-50 border-l-4 border-error text-error text-[14px]">
                <p className="font-semibold">Gagal Menyusun Modul</p>
                <p>{errorMsg}</p>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                className="bg-primary text-on-primary font-medium text-[14px] px-7 py-2.5 h-[44px] rounded-md hover:bg-primary-active transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                Buat Modul Ajar
              </button>
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
