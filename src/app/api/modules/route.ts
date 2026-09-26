import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, getAuthUserId, getSupabaseAdminClient } from "@/lib/supabase/server";
import type { StructuredModulAjarData } from "@/types/modul";

// 10 Komponen Resmi BSKAP untuk mapping module_sections
const SECTION_DEFS = [
  { jenis: "informasi_umum", label: "1. Informasi Umum Perangkat Ajar", urutan: 1 },
  { jenis: "tujuan_pembelajaran", label: "2. Tujuan Pembelajaran", urutan: 2 },
  { jenis: "profil_pelajar_pancasila", label: "3. Profil Pelajar Pancasila", urutan: 3 },
  { jenis: "materi_alat_bahan", label: "4. Materi Ajar, Alat, dan Bahan", urutan: 4 },
  { jenis: "model_pembelajaran", label: "5. Model Pembelajaran", urutan: 5 },
  { jenis: "kegiatan_pembelajaran", label: "6. Urutan Kegiatan Pembelajaran", urutan: 6 },
  { jenis: "asesmen", label: "7. Asesmen", urutan: 7 },
  { jenis: "refleksi", label: "8. Refleksi Guru dan Siswa", urutan: 8 },
  { jenis: "daftar_pustaka", label: "9. Daftar Pustaka", urutan: 9 },
  { jenis: "pengayaan_remedial", label: "10. Pengayaan dan Remedial", urutan: 10 },
  { jenis: "lembar_pengesahan", label: "Lembar Pengesahan", urutan: 11 },
];

/**
 * GET /api/modules
 * Mengambil daftar modul milik guru yang login (hanya yang aktif, soft-delete excluded).
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = await getAuthUserId(authHeader);

    if (!userId) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        data: [],
        message: "Pengguna belum login. Data diambil dari penyimpanan lokal.",
      });
    }

    const supabase = getSupabaseServerClient(authHeader);

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let query = supabase
      .from("modules")
      .select("id, mata_pelajaran, jenjang, fase, kelas, judul_bab, topik, tahun_ajaran, alokasi_waktu, status, created_at, updated_at, structured_data")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data: modules, error } = await query;

    if (error) {
      console.error("[GET /api/modules] Supabase query error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: modules || [],
    });
  } catch (error: any) {
    console.error("[GET /api/modules] Exception:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules
 * Menyimpan modul ajar baru ke PostgreSQL Supabase (tabel modules & module_sections).
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = await getAuthUserId(authHeader);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Harap login terlebih dahulu untuk menyimpan modul ke cloud database.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { structuredData, htmlContent, status = "draft", title } = body;

    if (!structuredData || !structuredData.informasiUmum) {
      return NextResponse.json(
        { success: false, error: "Payload structuredData tidak valid." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient(authHeader);
    const info = structuredData.informasiUmum;

    // 1. Dapatkan model_id jika ada di tabel learning_models
    let modelId: string | null = null;
    const kodeModel = structuredData.modelPembelajaran?.kodeModel?.toLowerCase();
    if (kodeModel) {
      const { data: modelRow } = await supabase
        .from("learning_models")
        .select("id")
        .eq("kode", kodeModel)
        .maybeSingle();
      if (modelRow) modelId = modelRow.id;
    }

    // 2. Dapatkan phase_id dari tabel curriculum_phases
    let phaseId: string | null = null;
    const kodeFase = (info.fase || "").replace(/^fase\s*/i, "").trim().toUpperCase();
    if (kodeFase) {
      const { data: phaseRow } = await supabase
        .from("curriculum_phases")
        .select("id")
        .eq("kode", kodeFase)
        .maybeSingle();
      if (phaseRow) phaseId = phaseRow.id;
    }

    // 3. Insert ke tabel modules
    const { data: newModule, error: insertModuleError } = await supabase
      .from("modules")
      .insert({
        user_id: userId,
        model_id: modelId,
        phase_id: phaseId,
        mata_pelajaran: info.mataPelajaran || "Mata Pelajaran",
        jenjang: info.jenjangSekolah || "SMP",
        fase: info.fase || "D",
        kelas: info.kelas || "7",
        judul_bab: structuredData.materiAlatBahan?.materiUtama || title || `Bab ${info.kelas}`,
        topik: structuredData.tujuanPembelajaran?.tujuan?.[0] || null,
        tahun_ajaran: info.tahunPenyusunan || "2026/2027",
        alokasi_waktu: info.alokasiWaktu || "2 x 45 menit",
        status: status,
        structured_data: structuredData,
        html_content: htmlContent || null,
      })
      .select()
      .single();

    if (insertModuleError || !newModule) {
      console.error("[POST /api/modules] Insert error:", insertModuleError);
      return NextResponse.json(
        { success: false, error: insertModuleError?.message || "Gagal menyimpan modul ajar." },
        { status: 500 }
      );
    }

    // 4. Insert 11 sections ke module_sections
    const sectionsToInsert = SECTION_DEFS.map((sec) => {
      let secContent: any = null;
      if (sec.jenis === "informasi_umum") secContent = structuredData.informasiUmum;
      else if (sec.jenis === "tujuan_pembelajaran") secContent = structuredData.tujuanPembelajaran;
      else if (sec.jenis === "profil_pelajar_pancasila") secContent = structuredData.profilPelajarPancasila;
      else if (sec.jenis === "materi_alat_bahan") secContent = structuredData.materiAlatBahan;
      else if (sec.jenis === "model_pembelajaran") secContent = structuredData.modelPembelajaran;
      else if (sec.jenis === "kegiatan_pembelajaran") secContent = structuredData.kegiatanPembelajaran;
      else if (sec.jenis === "asesmen") secContent = structuredData.asesmen;
      else if (sec.jenis === "refleksi") secContent = structuredData.refleksi;
      else if (sec.jenis === "daftar_pustaka") secContent = structuredData.daftarPustaka;
      else if (sec.jenis === "pengayaan_remedial") secContent = structuredData.pengayaanRemedial;
      else if (sec.jenis === "lembar_pengesahan") secContent = structuredData.lembarPengesahan;

      return {
        module_id: newModule.id,
        jenis_section: sec.jenis,
        label: sec.label,
        urutan: sec.urutan,
        konten: secContent,
        aktif: true,
      };
    });

    const { error: insertSectionsError } = await supabase
      .from("module_sections")
      .insert(sectionsToInsert);

    if (insertSectionsError) {
      console.warn("[POST /api/modules] Warning inserting module_sections:", insertSectionsError);
    }

    return NextResponse.json({
      success: true,
      module: newModule,
      message: "Modul ajar berhasil disimpan ke cloud database.",
    });
  } catch (error: any) {
    console.error("[POST /api/modules] Exception:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
