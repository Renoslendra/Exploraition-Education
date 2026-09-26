"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText, Download, ArrowRight, BookOpen, Clock, Calendar, CheckCircle2 } from "lucide-react";
import type { StructuredModulAjarData } from "@/types/modul";

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState<StructuredModulAjarData | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("Modul Ajar");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedStructured = localStorage.getItem("modulin_active_structured");
      const savedTitle = localStorage.getItem("modulin_active_title");
      if (savedStructured) {
        setActiveModule(JSON.parse(savedStructured));
      }
      if (savedTitle) {
        setModuleTitle(savedTitle);
      }
    } catch (err) {
      console.error("Error reading from localStorage:", err);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadDocx = async (data: StructuredModulAjarData) => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/modules/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Gagal mengunduh file DOCX.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeMapel = (data.informasiUmum.mataPelajaran || "Modul")
        .replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `Modul_Ajar_${safeMapel}_Kelas_${data.informasiUmum.kelas}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast("File Word (.docx) berhasil diunduh.");
    } catch (err: any) {
      console.error(err);
      alert("Gagal mengunduh file: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-[56px]">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in text-[14px]">
          <CheckCircle2 size={18} className="text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-[32px] font-semibold text-ink tracking-[-0.5px]">
            Modul Ajar Saya
          </h1>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-md px-5 py-2.5 text-[14px] font-medium hover:bg-primary-active transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Buat Modul Baru</span>
        </Link>
      </div>

      {activeModule ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-card rounded-xl border border-hairline p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-primary-light text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeModule.modelPembelajaran?.namaModel || "Kurikulum Merdeka"}
                </span>
                <span className="text-[12px] text-muted flex items-center gap-1">
                  <Calendar size={13} />
                  <span>TA {activeModule.informasiUmum.tahunPenyusunan || "2026/2027"}</span>
                </span>
              </div>

              <h2 className="font-display text-[22px] font-semibold text-ink leading-tight mb-2">
                {activeModule.informasiUmum.mataPelajaran
                  ? `Modul Ajar: ${activeModule.informasiUmum.mataPelajaran}`
                  : moduleTitle}
              </h2>

              <p className="text-[13px] text-body mb-4">
                <strong>{activeModule.informasiUmum.namaInstitusi}</strong> • Kelas {activeModule.informasiUmum.kelas} ({activeModule.informasiUmum.jenjangSekolah}) • Fase {activeModule.informasiUmum.fase}
              </p>

              <div className="bg-canvas p-3 rounded-lg border border-hairline-soft mb-6 text-[12px] space-y-1.5 text-body">
                <p>
                  <strong>Materi:</strong> {activeModule.materiAlatBahan?.materiUtama || "-"}
                </p>
                <p>
                  <strong>Penyusun:</strong> {activeModule.informasiUmum.namaPenyusun}
                </p>
                <p>
                  <strong>Alokasi Waktu:</strong> {activeModule.informasiUmum.alokasiWaktu}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-hairline">
              <Link
                href="/editor"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary rounded-md py-2 text-[13px] font-medium hover:bg-primary-active transition-colors shadow-sm"
              >
                <BookOpen size={14} />
                <span>Buka di Editor</span>
              </Link>

              <button
                onClick={() => handleDownloadDocx(activeModule)}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-1.5 border border-hairline rounded-md px-3.5 py-2 text-[13px] font-medium bg-canvas hover:bg-surface-soft text-ink transition-colors disabled:opacity-50 cursor-pointer"
                title="Unduh berkas Word (.docx)"
              >
                <Download size={14} />
                <span>{isExporting ? "..." : "Unduh Word"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-card rounded-lg border border-hairline p-12 text-center">
          <FileText size={40} className="text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted mb-6 text-[15px]">
            Belum ada modul ajar tersimpan.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-md px-5 py-2.5 text-[14px] font-medium hover:bg-primary-active transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Buat Modul Ajar</span>
          </Link>
        </div>
      )}
    </div>
  );
}
