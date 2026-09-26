import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, getAuthUserId } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/modules/[id]
 * Mengambil detail satu modul ajar beserta komponen sections-nya.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const userId = await getAuthUserId(authHeader);

    const supabase = getSupabaseServerClient(authHeader);

    // Ambil data modul
    let query = supabase
      .from("modules")
      .select("*, learning_models(id, nama, singkatan, kode)")
      .eq("id", id)
      .is("deleted_at", null);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: moduleData, error: moduleError } = await query.single();

    if (moduleError || !moduleData) {
      return NextResponse.json(
        { success: false, error: "Modul ajar tidak ditemukan atau telah dihapus." },
        { status: 404 }
      );
    }

    // Ambil sections terurut
    const { data: sections } = await supabase
      .from("module_sections")
      .select("*")
      .eq("module_id", id)
      .order("urutan", { ascending: true });

    return NextResponse.json({
      success: true,
      data: {
        ...moduleData,
        sections: sections || [],
      },
    });
  } catch (error: any) {
    console.error("[GET /api/modules/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/modules/[id]
 * Memperbarui status, structured_data, atau html_content dari modul ajar.
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const userId = await getAuthUserId(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Harap login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, structuredData, htmlContent } = body;

    const supabase = getSupabaseServerClient(authHeader);

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (structuredData) {
      updatePayload.structured_data = structuredData;
      if (structuredData.informasiUmum?.mataPelajaran) {
        updatePayload.mata_pelajaran = structuredData.informasiUmum.mataPelajaran;
      }
      if (structuredData.informasiUmum?.kelas) {
        updatePayload.kelas = structuredData.informasiUmum.kelas;
      }
    }
    if (htmlContent !== undefined) updatePayload.html_content = htmlContent;

    const { data: updated, error: updateError } = await supabase
      .from("modules")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, error: updateError?.message || "Gagal memperbarui modul ajar." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Modul ajar berhasil diperbarui.",
    });
  } catch (error: any) {
    console.error("[PUT /api/modules/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/modules/[id]
 * Soft delete modul ajar (menandai deleted_at = now()).
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const userId = await getAuthUserId(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Harap login terlebih dahulu." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServerClient(authHeader);

    const { error } = await supabase
      .from("modules")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Modul ajar berhasil dihapus.",
    });
  } catch (error: any) {
    console.error("[DELETE /api/modules/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
