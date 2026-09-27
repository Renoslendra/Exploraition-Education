import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCurriculumRAGContext } from "@/lib/rag/retriever";
import { buildTemplateAcuanAIPrompt } from "@/constants/template-acuan";
import { getAuthUserId, getSupabaseAdminClient } from "@/lib/supabase/server";
import type { StructuredModulAjarData, ModulSection } from "@/types/modul";
import crypto from "crypto";

function getApiKey(): string {
  return process.env.GEMINI_API_KEY?.trim() || "";
}

const MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];

/**
 * Mengubah StructuredModulAjarData menjadi array ModulSection untuk TipTap Editor
 */
function convertToSections(data: StructuredModulAjarData): ModulSection[] {
  return [
    {
      id: "informasi-umum",
      judul: "1. Informasi Umum Perangkat Ajar",
      urutan: 1,
      aktif: true,
      konten: `
        <div class="space-y-2">
          <p><strong>Nama Penyusun:</strong> ${data.informasiUmum.namaPenyusun}</p>
          <p><strong>Nama Institusi:</strong> ${data.informasiUmum.namaInstitusi}</p>
          <p><strong>Mata Pelajaran:</strong> ${data.informasiUmum.mataPelajaran || "-"}</p>
          <p><strong>Tahun Penyusunan:</strong> ${data.informasiUmum.tahunPenyusunan}</p>
          <p><strong>Jenjang Sekolah:</strong> ${data.informasiUmum.jenjangSekolah}</p>
          <p><strong>Fase / Kelas:</strong> Fase ${data.informasiUmum.fase} / Kelas ${data.informasiUmum.kelas}</p>
          <p><strong>Alokasi Waktu:</strong> ${data.informasiUmum.alokasiWaktu}</p>
        </div>
      `,
    },
    {
      id: "tujuan-pembelajaran",
      judul: "2. Tujuan Pembelajaran",
      urutan: 2,
      aktif: true,
      konten: `
        <div class="space-y-3">
          <p><strong>Fase Capaian Pembelajaran (CP):</strong></p>
          <p>${data.tujuanPembelajaran.faseCP}</p>
          <p><strong>Elemen / Domain CP:</strong></p>
          <ul>${(data.tujuanPembelajaran.elemenCP || []).map((e) => `<li>${e}</li>`).join("")}</ul>
          <p><strong>Tujuan Pembelajaran:</strong></p>
          <ul>${(data.tujuanPembelajaran.tujuan || []).map((t) => `<li>${t}</li>`).join("")}</ul>
          <p><strong>Pertanyaan Pemantik:</strong></p>
          <ul>${(data.tujuanPembelajaran.pertanyaanPemantik || []).map((q) => `<li>${q}</li>`).join("")}</ul>
          <p><strong>Lingkungan Belajar:</strong> ${data.tujuanPembelajaran.lingkunganBelajar}</p>
        </div>
      `,
    },
    {
      id: "profil-pelajar-pancasila",
      judul: "3. Profil Pelajar Pancasila",
      urutan: 3,
      aktif: true,
      konten: `
        <ul>${(data.profilPelajarPancasila || []).map((p) => `<li>${p}</li>`).join("")}</ul>
      `,
    },
    {
      id: "materi-alat-bahan",
      judul: "4. Materi Ajar, Alat, dan Bahan",
      urutan: 4,
      aktif: true,
      konten: `
        <div class="space-y-3">
          <p><strong>Materi Ajar Utama:</strong> ${data.materiAlatBahan.materiUtama}</p>
          <p><strong>Sumber Belajar:</strong></p>
          <ul>${(data.materiAlatBahan.sumberBelajar || []).map((s) => `<li>${s}</li>`).join("")}</ul>
          <p><strong>Fasilitas / Sarana & Prasarana:</strong></p>
          <ul>${(data.materiAlatBahan.fasilitas || []).map((f) => `<li>${f}</li>`).join("")}</ul>
        </div>
      `,
    },
    {
      id: "model-pembelajaran",
      judul: "5. Model Pembelajaran",
      urutan: 5,
      aktif: true,
      konten: `
        <div class="space-y-2">
          <p><strong>Model:</strong> ${data.modelPembelajaran.namaModel}</p>
          <p><strong>Fokus:</strong> ${data.modelPembelajaran.fokus}</p>
          <p><strong>Metode:</strong> ${(data.modelPembelajaran.metode || []).join(", ")}</p>
        </div>
      `,
    },
    {
      id: "kegiatan-pembelajaran",
      judul: "6. Urutan Kegiatan Pembelajaran",
      urutan: 6,
      aktif: true,
      konten: `
        <div class="space-y-4">
          <div>
            <h4 class="font-bold text-teal-800">A. Pendahuluan</h4>
            <ul>${(data.kegiatanPembelajaran.pendahuluan || []).map((k) => `<li>${k}</li>`).join("")}</ul>
          </div>
          <div>
            <h4 class="font-bold text-teal-800">B. Kegiatan Inti (${data.modelPembelajaran.namaModel})</h4>
            <div class="space-y-3 mt-2">
              ${(data.kegiatanPembelajaran.inti || []).map((t, i) => `
                <div class="p-3 bg-amber-50/50 rounded border border-amber-200">
                  <p class="font-semibold text-teal-900">${i + 1}. ${t.tahapSintaks}</p>
                  <p class="text-sm mt-1"><strong>Aktivitas Guru:</strong> ${t.aktivitasGuru}</p>
                  <p class="text-sm mt-1"><strong>Aktivitas Siswa:</strong> ${t.aktivitasSiswa}</p>
                </div>
              `).join("")}
            </div>
          </div>
          <div>
            <h4 class="font-bold text-teal-800">C. Penutup</h4>
            <ul>${(data.kegiatanPembelajaran.penutup || []).map((k) => `<li>${k}</li>`).join("")}</ul>
          </div>
        </div>
      `,
    },
    {
      id: "asesmen",
      judul: "7. Asesmen",
      urutan: 7,
      aktif: true,
      konten: `
        <div class="space-y-3">
          <p><strong>Target Penilaian:</strong> ${data.asesmen.targetPenilaian}</p>
          <p><strong>Jenis Asesmen:</strong> ${(data.asesmen.jenisAsesmen || []).join(", ")}</p>
          <p><strong>Kriteria Ketercapaian TP:</strong> ${data.asesmen.kriteriaKetercapaian}</p>
          <p><strong>Cara Penilaian:</strong> ${data.asesmen.caraPenilaian}</p>
          <p class="font-semibold mt-2">Rubrik Penilaian:</p>
          <table class="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 p-2 text-left">Aspek</th>
                <th class="border border-gray-300 p-2 text-center w-20">Skor</th>
                <th class="border border-gray-300 p-2 text-left">Kriteria</th>
              </tr>
            </thead>
            <tbody>
              ${(data.asesmen.rubrik || []).map((r) => `
                <tr>
                  <td class="border border-gray-300 p-2 font-medium">${r.aspek}</td>
                  <td class="border border-gray-300 p-2 text-center">${r.skorMaks}</td>
                  <td class="border border-gray-300 p-2">${r.kriteria}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `,
    },
    {
      id: "refleksi",
      judul: "8. Refleksi Guru dan Siswa",
      urutan: 8,
      aktif: true,
      konten: `
        <div class="space-y-3">
          <p><strong>Refleksi Guru:</strong></p>
          <ul>${(data.refleksi.refleksiGuru || []).map((rg) => `<li>${rg}</li>`).join("")}</ul>
          <p><strong>Refleksi Peserta Didik:</strong></p>
          <ul>${(data.refleksi.refleksiSiswa || []).map((rs) => `<li>${rs}</li>`).join("")}</ul>
        </div>
      `,
    },
    {
      id: "daftar-pustaka",
      judul: "9. Daftar Pustaka",
      urutan: 9,
      aktif: true,
      konten: `
        <ul>${(data.daftarPustaka || []).map((dp) => `<li>${dp}</li>`).join("")}</ul>
      `,
    },
    {
      id: "pengayaan-remedial",
      judul: "10. Pengayaan dan Remedial",
      urutan: 10,
      aktif: true,
      konten: `
        <div class="space-y-2">
          <p><strong>Pengayaan:</strong> ${data.pengayaanRemedial.pengayaan}</p>
          <p><strong>Remedial:</strong> ${data.pengayaanRemedial.remedial}</p>
        </div>
      `,
    },
  ];
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;
  try {
    userId = await getAuthUserId(authHeader);
  } catch {
    // Guest or unauthenticated
  }

  try {
    const body = await req.json();
    const { identitas, modelPembelajaran } = body;

    if (!identitas || !identitas.mataPelajaran || !identitas.bab) {
      return NextResponse.json(
        { success: false, error: "Identitas modul (mata pelajaran dan bab) wajib diisi." },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY tidak terkonfigurasi di server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. Ambil Grounded RAG Context kurikulum resmi
    const ragContext = await getCurriculumRAGContext(
      identitas.fase || "D",
      identitas.mataPelajaran,
      modelPembelajaran?.id || "pbl"
    );

    // 2. Buat Prompt Terstruktur sesuai Template Acuan 10 Bagian
    const basePrompt = buildTemplateAcuanAIPrompt({
      namaGuru: identitas.namaGuru || "Guru Pengajar",
      instansi: identitas.instansi || "Sekolah Indonesia",
      mataPelajaran: identitas.mataPelajaran,
      jenjang: identitas.jenjang || "SMP",
      kelas: identitas.kelas || "7",
      fase: identitas.fase || "D",
      bab: identitas.bab,
      topik: identitas.topik,
      modelPembelajaran: modelPembelajaran?.nama || "Problem-Based Learning",
      alokasiWaktu: identitas.alokasiWaktu || "2 x 45 menit",
    });

    const systemInstruction = `Kamu adalah pakar kurikulum Merdeka dan AI Generator Modul Ajar resmi untuk platform Modulin.
TUGAS: Buat Modul Ajar lengkap dalam format JSON MURNI yang mematuhi skema StructuredModulAjarData berikut.
JANGAN gunakan markdown code block (\`\`\`json). Kembalikan HANYA teks JSON valid.

SKEMA JSON WAJIB:
{
  "informasiUmum": { "namaPenyusun": "${identitas.namaGuru || "Guru Pengajar"}", "namaInstitusi": "${identitas.instansi || "Sekolah Indonesia"}", "mataPelajaran": "${identitas.mataPelajaran || ""}", "tahunPenyusunan": "2026", "jenjangSekolah": "${identitas.jenjang || "SMP"}", "fase": "${identitas.fase || "D"}", "kelas": "${identitas.kelas || "7"}", "alokasiWaktu": "${identitas.alokasiWaktu || "2 x 45 menit"}" },
  "tujuanPembelajaran": { "faseCP": "", "elemenCP": [], "tujuan": [], "pertanyaanPemantik": [], "lingkunganBelajar": "" },
  "profilPelajarPancasila": [],
  "materiAlatBahan": { "materiUtama": "", "sumberBelajar": [], "fasilitas": [] },
  "modelPembelajaran": { "namaModel": "", "kodeModel": "", "fokus": "", "metode": [] },
  "kegiatanPembelajaran": {
    "pendahuluan": [],
    "inti": [{ "tahapSintaks": "", "aktivitasGuru": "", "aktivitasSiswa": "" }],
    "penutup": []
  },
  "asesmen": {
    "targetPenilaian": "",
    "jenisAsesmen": [],
    "kriteriaKetercapaian": "",
    "caraPenilaian": "",
    "rubrik": [{ "aspek": "", "skorMaks": 25, "kriteria": "" }]
  },
  "refleksi": { "refleksiGuru": [], "refleksiSiswa": [] },
  "daftarPustaka": [],
  "pengayaanRemedial": { "pengayaan": "", "remedial": "" },
  "lembarPengesahan": {
    "kepalaSekolah": { "nama": "Kepala Sekolah, M.Pd", "nip": "19750101 200001 1 001" },
    "guruPengajar": { "nama": "${identitas.namaGuru || "Guru Mata Pelajaran"}", "nip": "-" }
  }
}`;

    const promptText = `KONTEKS ACUAN & GUARDRAIL:
${ragContext.guardrailsPrompt}

${basePrompt}

Buat modul ajar lengkap berkualitas tinggi, faktual, dan kontekstual untuk kelas tersebut.`;

    let generatedText = "";
    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        });
        generatedText = response.text || "";
        if (generatedText) break;
      } catch (err: any) {
        console.warn(`[Generate Modul] Model ${model} failed, trying next...`, err.message);
      }
    }

    if (!generatedText) {
      return NextResponse.json(
        { success: false, error: "Gagal men-generate modul dari AI service. Silakan coba kembali." },
        { status: 503 }
      );
    }

    // Bersihkan json fences jika ada
    const cleanJson = generatedText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let structuredData: StructuredModulAjarData;
    try {
      structuredData = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse JSON from AI, attempting recovery...");
      return NextResponse.json(
        { success: false, error: "Format AI JSON tidak valid. Silakan coba generate kembali." },
        { status: 500 }
      );
    }

    // Pastikan informasiUmum selalu memiliki data identitas input yang valid dan lengkap
    if (!structuredData.informasiUmum) {
      structuredData.informasiUmum = {} as any;
    }
    structuredData.informasiUmum.mataPelajaran =
      structuredData.informasiUmum.mataPelajaran || identitas.mataPelajaran || "Mata Pelajaran";
    structuredData.informasiUmum.namaPenyusun =
      structuredData.informasiUmum.namaPenyusun || identitas.namaGuru || "Guru Pengajar";
    structuredData.informasiUmum.namaInstitusi =
      structuredData.informasiUmum.namaInstitusi || identitas.instansi || "Sekolah Indonesia";
    structuredData.informasiUmum.tahunPenyusunan =
      structuredData.informasiUmum.tahunPenyusunan || identitas.tahunAjaran?.split("/")[0] || "2026";
    structuredData.informasiUmum.jenjangSekolah =
      structuredData.informasiUmum.jenjangSekolah || identitas.jenjang || "SMP";
    structuredData.informasiUmum.fase =
      structuredData.informasiUmum.fase || identitas.fase || "D";
    structuredData.informasiUmum.kelas =
      structuredData.informasiUmum.kelas || identitas.kelas || "7";
    structuredData.informasiUmum.alokasiWaktu =
      structuredData.informasiUmum.alokasiWaktu || identitas.alokasiWaktu || "2 x 45 menit";

    const sections = convertToSections(structuredData);
    const durasiMs = Date.now() - startTime;

    // Catat ke ai_generation_logs jika user login (background promise, non-blocking)
    if (userId) {
      (async () => {
        try {
          const adminClient = getSupabaseAdminClient();
          const promptHash = crypto.createHash("sha256").update(promptText).digest("hex");
          const { error } = await adminClient.from("ai_generation_logs").insert({
            user_id: userId,
            tipe: "full",
            model_name: "gemini-3.5-flash",
            prompt_hash: promptHash,
            durasi_ms: durasiMs,
            status: "success",
          });
          if (error) console.warn("[Generate Modul] Error logging to Supabase:", error.message);
        } catch (e) {
          console.warn("[Generate Modul] Failed logging:", e);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      structuredData,
      sections,
      durasiMs,
    });
  } catch (error: any) {
    console.error("API /api/modules/generate error:", error);
    const durasiMs = Date.now() - startTime;
    if (userId) {
      (async () => {
        try {
          const adminClient = getSupabaseAdminClient();
          await adminClient.from("ai_generation_logs").insert({
            user_id: userId,
            tipe: "full",
            model_name: "gemini-3.5-flash",
            durasi_ms: durasiMs,
            status: "error",
            error_message: error?.message || "Unknown error",
          });
        } catch {}
      })();
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
