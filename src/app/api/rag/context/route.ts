import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeStats } from "@/lib/rag/knowledge-store";
import { retrieveContext } from "@/lib/rag/retriever";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category") as any;
    const statsOnly = searchParams.get("stats") === "true";

    const stats = await getKnowledgeStats();

    if (statsOnly || !query) {
      return NextResponse.json({
        success: true,
        stats,
      });
    }

    const chunks = await retrieveContext({
      query,
      topK: 5,
      category,
    });

    return NextResponse.json({
      success: true,
      stats,
      query,
      resultsCount: chunks.length,
      chunks: chunks.map((sc) => ({
        id: sc.chunk.id,
        source: sc.chunk.sourceDoc,
        title: sc.chunk.title,
        score: sc.score,
        reasons: sc.matchReasons,
        snippet: sc.chunk.content.substring(0, 300) + (sc.chunk.content.length > 300 ? "..." : ""),
      })),
    });
  } catch (error: any) {
    console.error("API /api/rag/context error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
