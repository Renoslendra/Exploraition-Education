import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MODEL_PEMBELAJARAN } from "@/constants/models";

/**
 * GET /api/curriculum
 * Mengambil data referensi kurikulum: learning_models, curriculum_phases, dan subjects.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    const [modelsRes, phasesRes, subjectsRes] = await Promise.all([
      supabase.from("learning_models").select("*").order("singkatan"),
      supabase.from("curriculum_phases").select("*").order("kode"),
      supabase.from("subjects").select("*").order("jenjang, nama"),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        models: (modelsRes.data && modelsRes.data.length > 0) ? modelsRes.data : MODEL_PEMBELAJARAN,
        phases: phasesRes.data || [],
        subjects: subjectsRes.data || [],
      },
    });
  } catch (error: any) {
    console.error("[GET /api/curriculum] Error:", error);
    return NextResponse.json({
      success: true,
      fallback: true,
      data: {
        models: MODEL_PEMBELAJARAN,
        phases: [],
        subjects: [],
      },
    });
  }
}
