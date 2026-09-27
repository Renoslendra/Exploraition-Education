"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, GitCompareArrows, Info } from "lucide-react";

/* =========================================
 * 1. CONSTANTS & TYPES
 * ========================================= */
const MODELS = [
  {
    id: "pbl",
    abbr: "PBL",
    name: "Problem-Based Learning",
    desc: "Pembelajaran dimulai dari masalah autentik. Peserta didik menganalisis, meneliti, dan merumuskan solusi secara kritis.",
    outcome: "Berhenti di solusi atau ide, tidak menghasilkan produk fisik.",
    bestFor: "Materi yang kaya isu kontekstual: lingkungan, sosial, studi kasus.",
    syntax: ["Orientasi masalah", "Organisasi belajar", "Investigasi", "Mengembangkan solusi", "Analisis & evaluasi"],
  },
  {
    id: "pjbl",
    abbr: "PjBL",
    name: "Project-Based Learning",
    desc: "Peserta didik merancang, membuat, dan mempresentasikan produk nyata sebagai bukti pembelajaran.",
    outcome: "Menghasilkan produk nyata: artefak, presentasi, atau prototipe.",
    bestFor: "Materi yang bisa diwujudkan menjadi karya: prakarya, poster, purwarupa.",
    syntax: ["Pertanyaan mendasar", "Desain proyek", "Menyusun jadwal", "Monitoring", "Menguji hasil", "Evaluasi & refleksi"],
  },
  {
    id: "discovery",
    abbr: "DL",
    name: "Discovery Learning",
    desc: "Guru membimbing peserta didik menemukan konsep sendiri melalui eksplorasi terarah dan pertanyaan pemantik.",
    outcome: "Pemahaman konsep lewat penemuan terbimbing.",
    bestFor: "Konsep abstrak yang lebih bermakna bila ditemukan sendiri.",
    syntax: ["Stimulation", "Problem statement", "Data collection", "Data processing", "Verification", "Generalization"],
  },
  {
    id: "inquiry",
    abbr: "IL",
    name: "Inquiry Learning",
    desc: "Peserta didik merumuskan pertanyaan sendiri, merancang investigasi, mengumpulkan data, lalu menyimpulkan.",
    outcome: "Jawaban atas pertanyaan penelitian melalui investigasi.",
    bestFor: "Materi sains dan sosial yang mendorong rasa ingin tahu.",
    syntax: ["Merumuskan pertanyaan", "Merancang investigasi", "Mengumpulkan data", "Menganalisis", "Menyimpulkan"],
  },
  {
    id: "cooperative",
    abbr: "CL",
    name: "Cooperative Learning",
    desc: "Pembelajaran dalam kelompok kecil dengan peran dan tanggung jawab individual yang jelas.",
    outcome: "Hasil kerja kelompok dengan akuntabilitas tiap individu.",
    bestFor: "Materi yang menuntut kolaborasi dan saling ketergantungan positif.",
    syntax: ["Penyajian materi", "Pembentukan tim", "Kerja tim", "Kuis individual", "Rekognisi tim"],
  },
  {
    id: "circ",
    abbr: "CIRC",
    name: "Cooperative Integrated Reading & Composition",
    desc: "Model kooperatif yang mengintegrasikan membaca dan menulis, umum untuk mata pelajaran bahasa.",
    outcome: "Produk literasi: ringkasan, karangan, atau analisis teks.",
    bestFor: "Bahasa Indonesia, Bahasa Inggris, dan materi berbasis teks.",
    syntax: ["Membaca teks", "Diskusi tim", "Menulis bersama", "Presentasi", "Refleksi literasi"],
  },
];

type IdentityData = {
  namaGuru: string;
  sekolah: string;
  mapel: string;
  jenjang: string;
  kelas: string;
  bab: string;
  tahunAjaran: string;
  alokasiWaktu: string;
  fase: string;
};

const INITIAL_IDENTITY: IdentityData = {
  namaGuru: "",
  sekolah: "",
  mapel: "",
  jenjang: "SD",
  kelas: "1",
  bab: "",
  tahunAjaran: "2026/2027",
  alokasiWaktu: "2 x 45 menit (1 Pertemuan)",
  fase: "Fase A",
};

/* =========================================
 * 2. STEP DOTS COMPONENT
 * ========================================= */
function StepDots({ step }: { step: number }) {
  const labels = ["Model", "Identitas", "Generate"];
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <div key={l} className="flex items-center gap-2">
            <span
              className={`h-6 w-6 rounded-full grid place-items-center text-[11px] font-semibold transition-colors ${current
                ? "bg-[#2a7d6e] text-white"
                : done
                  ? "bg-[#e6f3f0] text-[#2a7d6e]"
                  : "bg-[#e8e1d3] text-[#908c84]"
                }`}
            >
              {done ? <Check size={13} /> : n}
            </span>
            <span
              className={`text-[13px] transition-colors ${current ? "text-[#1a1917] font-medium" : "text-[#908c84]"
                }`}
            >
              {l}
            </span>
            {i < labels.length - 1 && (
              <span className="w-8 h-px bg-[#e2dbd0] mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================
 * 3. STEP 1: MODEL SELECT
 * ========================================= */
function ModelSelect({
  selectedModel,
  setSelectedModel,
  onNext,
}: {
  selectedModel: string | null;
  setSelectedModel: (val: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[56px]">
      {/* Step dots */}
      <StepDots step={1} />

      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-[40px] font-bold text-[#1a1917] mb-3 tracking-[-0.8px]">
          Pilih Model Pembelajaran
        </h1>
        <p className="text-[#444340] text-[16px] font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
          Model menentukan alur kegiatan pembelajaran yang akan disusun AI. Baca karakteristik
          tiap model, lalu pilih yang paling sesuai dengan materi bab Anda.
        </p>

        {/* PBL vs PjBL callout */}
        <div className="mb-8 rounded-md bg-[#e6f3f0] border-l-[3px] border-[#2a7d6e] p-4 flex gap-3 text-[14px] font-medium text-[#1a1917] max-w-2xl mx-auto text-left leading-relaxed">
          <GitCompareArrows size={20} className="text-[#2a7d6e] shrink-0 mt-0.5" />
          <p>
            <strong className="font-bold text-[#1a1917]">PBL vs PjBL:</strong> keduanya berbasis
            masalah, tetapi{" "}
            <strong className="font-bold">PBL berhenti di solusi/ide</strong>, sedangkan{" "}
            <strong className="font-bold">
              PjBL berlanjut hingga menghasilkan produk nyata
            </strong>{" "}
            (artefak, presentasi, prototipe).
          </p>
        </div>
      </div>

      {/* Model cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        role="radiogroup"
        aria-label="Model Pembelajaran"
      >
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
              className={`rounded-[12px] p-6 cursor-pointer transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7d6e] focus-visible:ring-offset-2 ${isSelected
                ? "bg-[#e6f3f0] border-[#2a7d6e] ring-1 ring-[#2a7d6e]"
                : "bg-[#f0ebe0] border-transparent hover:border-[#b8c9c5] hover:-translate-y-1 hover:shadow-sm"
                }`}
            >
              {/* Header: abbr + radio */}
              <div className="flex items-start justify-between mb-1">
                <span className="font-display text-[40px] font-bold text-[#1a1917] leading-none tracking-tight">
                  {m.abbr}
                </span>
                <span
                  className={`mt-1 h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 transition-all ${isSelected
                    ? "bg-[#2a7d6e] border-[#2a7d6e]"
                    : "border-[#b8c9c5] bg-transparent"
                    }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white block" />
                  )}
                </span>
              </div>

              {/* Nama model teal */}
              <div className="text-[14px] font-bold text-[#2a7d6e] mb-3">
                {m.name}
              </div>

              {/* Deskripsi */}
              <p className="text-[15px] font-medium text-[#2a2926] leading-relaxed mb-4">
                {m.desc}
              </p>

              {/* Hasil akhir + Cocok untuk */}
              <div className="space-y-3 mb-5">
                <div className="flex gap-3 text-[13px]">
                  <span className="font-bold text-[#1a1917] shrink-0 w-[74px] leading-relaxed">
                    Hasil akhir
                  </span>
                  <span className="font-medium text-[#444340] leading-relaxed">{m.outcome}</span>
                </div>
                <div className="flex gap-3 text-[13px]">
                  <span className="font-bold text-[#1a1917] shrink-0 w-[74px] leading-relaxed">
                    Cocok untuk
                  </span>
                  <span className="font-medium text-[#444340] leading-relaxed">{m.bestFor}</span>
                </div>
              </div>

              {/* Sintak chips */}
              <div className="flex flex-wrap gap-1.5">
                {m.syntax.map((s, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-[#6b6862] bg-[#faf8f4] border border-[#e2dbd0] rounded-full px-2.5 py-0.5"
                  >
                    {i + 1}. {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedModel}
          className="bg-[#2a7d6e] text-white font-medium text-[14px] px-7 py-2.5 h-[44px] rounded-md hover:bg-[#1f6358] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2a7d6e] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Lanjut Isi Identitas</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================
 * 4. STEP 2: IDENTITY FORM
 * ========================================= */
function IdentityForm({
  identityData,
  setIdentityData,
  selectedModel,
  onBack,
  onGenerate,
}: {
  identityData: IdentityData;
  setIdentityData: (data: IdentityData) => void;
  selectedModel: string | null;
  onBack: () => void;
  onGenerate: (data: IdentityData) => void;
}) {
  const modelName = MODELS.find((m) => m.id === selectedModel)?.name || "Model";
  const isPaud = identityData.jenjang === "PAUD/TK";

  const getFase = (kls: string): string => {
    if (!kls) return "Fase Fondasi";
    const k = parseInt(kls);
    if (k === 1 || k === 2) return "Fase A";
    if (k === 3 || k === 4) return "Fase B";
    if (k === 5 || k === 6) return "Fase C";
    if (k >= 7 && k <= 9) return "Fase D";
    if (k === 10) return "Fase E";
    if (k === 11 || k === 12) return "Fase F";
    return "Fase A";
  };

  const handleChange = (field: keyof IdentityData, value: string) => {
    let newData = { ...identityData, [field]: value };
    if (field === "jenjang") {
      if (value === "PAUD/TK") {
        newData.kelas = "";
        newData.fase = "Fase Fondasi";
      } else {
        if (value === "SD") newData.kelas = "1";
        if (value === "SMP") newData.kelas = "7";
        if (value === "SMA/SMK") newData.kelas = "10";
        newData.fase = getFase(newData.kelas);
      }
    } else if (field === "kelas") {
      newData.fase = getFase(value);
    }
    setIdentityData(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(identityData);
  };

  const inputClass =
    "w-full bg-white border border-[#e2dbd0] rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-[#2a7d6e] focus-visible:ring-2 focus-visible:ring-[#2a7d6e]/20 text-[#1a1917] transition-shadow";
  const selectClass =
    "w-full bg-white border border-[#e2dbd0] rounded-md px-[14px] py-[10px] h-[40px] text-[15px] focus-visible:outline-none focus-visible:border-[#2a7d6e] focus-visible:ring-2 focus-visible:ring-[#2a7d6e]/20 text-[#1a1917] cursor-pointer";
  const labelClass = "block text-[14px] font-medium text-[#1a1917] mb-2";

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[56px]">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-[#6b6862] hover:text-[#1a1917] transition-colors text-[14px] font-medium"
      >
        <ArrowLeft size={16} />
        Kembali ke Model
      </button>

      {/* Step dots */}
      <StepDots step={2} />

      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-[40px] font-bold text-[#1a1917] mb-3 tracking-[-0.8px]">
          Identitas Perangkat Ajar
        </h1>
        <p className="text-[#444340] text-[16px] font-medium mb-8 leading-relaxed max-w-2xl mx-auto">
          Data ini menjadi konteks bagi AI. Fase terisi otomatis dari jenjang dan kelas.{" "}
          <span className="text-[#2a7d6e] font-bold">Model: {modelName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex justify-center w-full">
        <div className="w-full max-w-[640px] bg-[#f0ebe0] rounded-[16px] p-8 border border-[#e2dbd0] space-y-6 shadow-sm">

          {/* Nama Guru + Instansi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="namaGuru" className={labelClass}>Nama Guru</label>
              <input
                id="namaGuru"
                type="text"
                required
                value={identityData.namaGuru}
                onChange={(e) => handleChange("namaGuru", e.target.value)}
                placeholder="Contoh: Nama Lengkap & Gelar (e.g. S.Pd)"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="sekolah" className={labelClass}>Nama Instansi</label>
              <input
                id="sekolah"
                type="text"
                required
                value={identityData.sekolah}
                onChange={(e) => handleChange("sekolah", e.target.value)}
                placeholder="Contoh: SMK Mabdaul Falah"
                className={inputClass}
              />
            </div>
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label htmlFor="mapel" className={labelClass}>Mata Pelajaran</label>
            <input
              id="mapel"
              type="text"
              required
              value={identityData.mapel}
              onChange={(e) => handleChange("mapel", e.target.value)}
              placeholder="Contoh: Bahasa Inggris"
              className={inputClass}
            />
          </div>

          {/* Jenjang + Kelas + Fase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="jenjang" className={labelClass}>Jenjang</label>
              <select
                id="jenjang"
                value={identityData.jenjang}
                onChange={(e) => handleChange("jenjang", e.target.value)}
                className={selectClass}
              >
                <option value="PAUD/TK">PAUD / TK</option>
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA/SMK">SMA / SMK / MA</option>
              </select>
            </div>
            <div>
              <label htmlFor="kelas" className={labelClass}>Kelas</label>
              <select
                id="kelas"
                disabled={isPaud}
                value={identityData.kelas}
                onChange={(e) => handleChange("kelas", e.target.value)}
                className={`${selectClass} disabled:opacity-50 disabled:bg-[#e8e1d3] disabled:cursor-not-allowed`}
              >
                {isPaud && <option value="">-</option>}
                {identityData.jenjang === "SD" &&
                  [1, 2, 3, 4, 5, 6].map((k) => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                {identityData.jenjang === "SMP" &&
                  [7, 8, 9].map((k) => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
                {identityData.jenjang === "SMA/SMK" &&
                  [10, 11, 12].map((k) => (
                    <option key={k} value={k}>Kelas {k}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fase</label>
              <div className="w-full bg-[#e8e1d3] border border-transparent rounded-md px-3 py-[10px] h-[40px] text-[14px] font-semibold text-[#1a1917] flex items-center justify-between">
                <span>{identityData.fase}</span>
                <span className="text-[10px] font-normal text-[#908c84] bg-[#faf8f4] border border-[#e2dbd0] px-1.5 py-0.5 rounded tracking-wide">
                  Otomatis
                </span>
              </div>
            </div>
          </div>

          {/* Bab + Tahun Ajaran + Alokasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="bab" className={labelClass}>
                {isPaud ? "Topik / Tema Bermain" : "Materi Pokok / Bab"}
              </label>
              <textarea
                id="bab"
                required
                value={identityData.bab}
                onChange={(e) => handleChange("bab", e.target.value)}
                placeholder={
                  isPaud
                    ? "Contoh: Mengenal tanaman di sekitarku"
                    : "Contoh: Teks Deskriptif tentang Tokoh Inspiratif Dunia"
                }
                className="w-full bg-white border border-[#e2dbd0] rounded-md px-[14px] py-[10px] text-[15px] focus-visible:outline-none focus-visible:border-[#2a7d6e] focus-visible:ring-2 focus-visible:ring-[#2a7d6e]/20 text-[#1a1917] min-h-[120px] resize-y transition-shadow"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="tahunAjaran" className={labelClass}>Tahun Ajaran</label>
                <select
                  id="tahunAjaran"
                  value={identityData.tahunAjaran}
                  onChange={(e) => handleChange("tahunAjaran", e.target.value)}
                  className={selectClass}
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>
              </div>
              <div>
                <label htmlFor="alokasiWaktu" className={labelClass}>Alokasi Waktu</label>
                <input
                  id="alokasiWaktu"
                  type="text"
                  value={identityData.alokasiWaktu}
                  onChange={(e) => handleChange("alokasiWaktu", e.target.value)}
                  placeholder="Contoh: 2 x 45 menit (1 Pertemuan)"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* PAUD notice */}
          {isPaud && (
            <div className="rounded-md bg-[#fef8e8] border-l-[3px] border-[#d4940a] p-4 flex gap-3 text-[13px] text-[#444340]">
              <Info size={17} className="text-[#d4940a] shrink-0 mt-0.5" />
              <p>
                Jenjang PAUD/TK terdeteksi. Modul akan menggunakan terminologi{" "}
                <strong className="font-medium text-[#1a1917]">Capaian Perkembangan</strong> dan
                pendekatan bermain-belajar sesuai Fase Fondasi.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#2a7d6e] text-white font-medium text-[14px] px-7 py-2.5 h-[44px] rounded-md hover:bg-[#1f6358] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2a7d6e] flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen size={16} />
              <span>Generate Modul Ajar</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================
 * 5. STEP 3: GENERATE
 * ========================================= */
function Generate({
  selectedModel,
  identityData,
  onDone,
}: {
  selectedModel: string | null;
  identityData: IdentityData;
  onDone: () => void;
}) {
  const [loadingStep, setLoadingStep] = useState<string>(
    "Menyelaraskan Capaian Pembelajaran resmi..."
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const modelAbbr =
    MODELS.find((m) => m.id === selectedModel)?.abbr || selectedModel?.toUpperCase();

  useEffect(() => {
    let active = true;

    const runGeneration = async () => {
      try {
        const t1 = setTimeout(() => {
          if (active) setLoadingStep("Menyusun komponen perangkat ajar...");
        }, 2500);
        const t2 = setTimeout(() => {
          if (active) setLoadingStep("Menyusun rubrik asesmen dan langkah pembelajaran...");
        }, 5500);

        const res = await fetch("/api/modules/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identitas: {
              namaGuru: identityData.namaGuru,
              instansi: identityData.sekolah,
              mataPelajaran: identityData.mapel,
              jenjang: identityData.jenjang,
              kelas: identityData.kelas,
              fase: identityData.fase.replace("Fase ", ""),
              tahunAjaran: identityData.tahunAjaran,
              bab: identityData.bab,
              alokasiWaktu: identityData.alokasiWaktu,
            },
            modelPembelajaran: MODELS.find((m) => m.id === selectedModel),
          }),
        });

        clearTimeout(t1);
        clearTimeout(t2);
        if (!active) return;

        const result = await res.json();
        if (!result.success || !result.structuredData) {
          throw new Error(result.error || "Gagal menyusun modul ajar.");
        }

        if (!result.structuredData.informasiUmum) {
          result.structuredData.informasiUmum = {} as any;
        }
        if (!result.structuredData.informasiUmum.mataPelajaran) {
          result.structuredData.informasiUmum.mataPelajaran = identityData.mapel;
        }

        localStorage.setItem(
          "modulin_active_structured",
          JSON.stringify(result.structuredData)
        );

        const fullHtml = (result.sections || [])
          .map((s: any) => `<h2>${s.judul}</h2>${s.konten}<br/>`)
          .join("\n<hr/>\n");

        localStorage.setItem("modulin_active_html", fullHtml);
        localStorage.setItem(
          "modulin_active_title",
          `Modul Ajar ${identityData.mapel} Kelas ${identityData.kelas}`
        );
        localStorage.setItem("modulin_exported", "false");
        localStorage.setItem("modulin_edited", "false");

        // Sinkronisasi ke riwayat modul lokal
        try {
          const historyRaw = localStorage.getItem("modulin_history");
          const currentHistory = historyRaw ? JSON.parse(historyRaw) : [];
          const titleKey = `${result.structuredData?.informasiUmum?.mataPelajaran || ""}_${result.structuredData?.informasiUmum?.kelas || ""}`;
          const filtered = currentHistory.filter(
            (item: any) =>
              `${item?.informasiUmum?.mataPelajaran || ""}_${item?.informasiUmum?.kelas || ""}` !== titleKey
          );
          const updatedHistory = [result.structuredData, ...filtered].slice(0, 30);
          localStorage.setItem("modulin_history", JSON.stringify(updatedHistory));
        } catch (e) {
          console.warn("Failed to update history in localStorage:", e);
        }

        // Sinkronisasi ke Supabase jika login (non-blocking)
        fetch("/api/modules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            structuredData: result.structuredData,
            htmlContent: fullHtml,
            status: "generated",
          }),
        })
          .then((res) => res.json())
          .then((saveRes) => {
            if (saveRes?.module?.id) {
              localStorage.setItem("modulin_active_id", saveRes.module.id);
            }
          })
          .catch(() => {});

        onDone();
      } catch (err: any) {
        if (!active) return;
        console.error("Generate error:", err);
        setErrorMsg(
          err?.message || "Layanan pembuatan modul sedang tidak dapat diakses."
        );
      }
    };

    runGeneration();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-[120px] flex flex-col items-center justify-center text-center">
      <StepDots step={3} />

      {errorMsg ? (
        <div className="bg-[#faf8f4] rounded-xl p-12 border border-[#e2dbd0] w-full max-w-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#fef2f0] border border-[#c4503d]/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#c4503d] text-xl">!</span>
          </div>
          <h2 className="font-display text-[26px] font-semibold text-[#c4503d] mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-[#444340] mb-6 text-[14px]">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2a7d6e] text-white px-5 py-2.5 rounded-md hover:bg-[#1f6358] transition-colors text-[14px] font-medium"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="bg-[#f0ebe0] rounded-xl p-12 border border-[#e2dbd0] w-full max-w-xl shadow-sm">
          {/* Animated dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#2a7d6e] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <h2 className="font-display text-[28px] font-semibold text-[#1a1917] mb-3 tracking-[-0.5px]">
            AI sedang menyusun modul Anda
          </h2>
          <p className="text-[#2a7d6e] font-medium text-[15px] mb-2">{loadingStep}</p>
          <p className="text-[#6b6862] text-[13px]">
            {identityData.mapel || "Mata Pelajaran"} &middot; {identityData.fase} &middot; Model{" "}
            {modelAbbr}
          </p>

          <div className="mt-8 pt-6 border-t border-[#e2dbd0]">
            <p className="text-[12px] text-[#908c84]">
              Jangan tutup halaman ini. Proses biasanya selesai dalam 15-30 detik.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
 * 6. MAIN PAGE (ORCHESTRATOR)
 * ========================================= */
function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [identityData, setIdentityData] = useState<IdentityData>(INITIAL_IDENTITY);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const qModel = searchParams.get("model");
    if (qModel && MODELS.some((m) => m.id === qModel)) {
      setSelectedModel(qModel);
    }
    const savedName = typeof window !== "undefined" ? localStorage.getItem("modulin_user_name") : null;
    if (savedName) {
      setIdentityData((prev) => ({
        ...prev,
        namaGuru: prev.namaGuru || savedName,
      }));
    }
  }, [searchParams]);

  const goTo = (nextStep: 1 | 2 | 3, dir: "forward" | "backward") => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 320);
  };

  const animClass = animating
    ? direction === "forward"
      ? "animate-slide-out-left"
      : "animate-slide-out-right"
    : direction === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#faf8f4] overflow-x-hidden relative">
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(48px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-48px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-48px); opacity: 0; }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(48px); opacity: 0; }
        }

        .animate-slide-in-right  { animation: slideInFromRight  320ms cubic-bezier(0.4,0,0.2,1) both; }
        .animate-slide-in-left   { animation: slideInFromLeft   320ms cubic-bezier(0.4,0,0.2,1) both; }
        .animate-slide-out-left  { animation: slideOutToLeft    320ms cubic-bezier(0.4,0,0.2,1) both; }
        .animate-slide-out-right { animation: slideOutToRight   320ms cubic-bezier(0.4,0,0.2,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in-right,
          .animate-slide-in-left {
            animation: fadeIn 150ms ease-out both;
          }
          .animate-slide-out-left,
          .animate-slide-out-right {
            animation: fadeOut 150ms ease-out both;
          }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>

      {/* Global Progress Bar */}
      <div className="fixed top-[56px] left-0 right-0 z-40 h-[3px] bg-[#e2dbd0]">
        <div
          className="h-full bg-[#2a7d6e] transition-all duration-500 ease-out"
          style={{
            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
          }}
        />
      </div>

      {/* Step content with slide animation */}
      <div className="pt-4 relative w-full">
        <div key={step} className={animClass}>
          {step === 1 && (
            <ModelSelect
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              onNext={() => {
                if (selectedModel) goTo(2, "forward");
              }}
            />
          )}
          {step === 2 && (
            <IdentityForm
              identityData={identityData}
              setIdentityData={setIdentityData}
              selectedModel={selectedModel}
              onBack={() => goTo(1, "backward")}
              onGenerate={(data) => {
                setIdentityData(data);
                goTo(3, "forward");
              }}
            />
          )}
          {step === 3 && (
            <Generate
              selectedModel={selectedModel}
              identityData={identityData}
              onDone={() => {
                router.push("/editor");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreatePageContent />
    </Suspense>
  );
}