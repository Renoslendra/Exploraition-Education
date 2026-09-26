import { NextRequest, NextResponse } from "next/server";
import { querySAASAssistant } from "@/lib/rag/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, category } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Query parameter wajib diisi." },
        { status: 400 }
      );
    }

    const result = await querySAASAssistant(query, category);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("API /api/rag/query error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
