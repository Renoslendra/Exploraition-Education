import { NextRequest, NextResponse } from "next/server";
import { generateDocxModulAjar } from "@/lib/export/docx-generator";
import type { StructuredModulAjarData } from "@/types/modul";

export async function POST(req: NextRequest) {
  try {
    const data: StructuredModulAjarData = await req.json();

    if (!data || !data.informasiUmum) {
      return NextResponse.json(
        { success: false, error: "Data modul tidak valid atau informasi umum kosong." },
        { status: 400 }
      );
    }

    const docxBuffer = await generateDocxModulAjar(data);

    const safeTitle = (data.informasiUmum.mataPelajaran || "Modul")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 30);
    const filename = `Modul_Ajar_${safeTitle}_Kelas_${data.informasiUmum.kelas || "X"}.docx`;

    return new NextResponse(docxBuffer as any, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating DOCX export:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal meng-generate dokumen DOCX." },
      { status: 500 }
    );
  }
}
