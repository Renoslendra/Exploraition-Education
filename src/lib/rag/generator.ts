import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { retrieveContext } from "./retriever";
import { RAGAnswer } from "./types";

const MODELS_TO_TRY = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];

function getApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
    return process.env.GEMINI_API_KEY.trim();
  }

  // Fallback membaca .env.local jika di-run dari background/standalone script
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match && match[1]) {
      process.env.GEMINI_API_KEY = match[1].trim();
      return match[1].trim();
    }
  }

  return "";
}

function getAIClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak ditemukan di environment maupun .env.local!");
  }
  return new GoogleGenAI({ apiKey });
}

async function generateWithRetry(options: any, maxRetries = 3) {
  const ai = getAIClient();

  for (const model of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...options,
          model,
        });
        return { response, modelUsed: model };
      } catch (error: any) {
        const isTransient = error?.status === 503 || error?.status === 429 || error?.code === 503;
        if (isTransient && attempt < maxRetries) {
          const delay = attempt * 1000;
          console.warn(`[RAG Gemini] Model ${model} returned ${error.status || error.code}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        // If not transient or last attempt for this model, try fallback model
        console.warn(`[RAG Gemini] Model ${model} failed, switching to next candidate...`);
        break;
      }
    }
  }
  throw new Error("Semua model AI sedang mengalami lonjakan trafik. Silakan coba kembali sesaat lagi.");
}

/**
 * Tanya jawab AI RAG berbasis seluruh dokumen spesifikasi SAAS Modulin (markdown/*.md)
 */
export async function querySAASAssistant(query: string, category?: string): Promise<RAGAnswer> {
  const scoredChunks = await retrieveContext({
    query,
    topK: 4,
    category: category as any,
    threshold: 8,
  });

  if (scoredChunks.length === 0) {
    return {
      query,
      answer:
        "Maaf, konteks mengenai pertanyaan tersebut tidak ditemukan di dalam dokumentasi spesifikasi SAAS Modulin. Silakan coba gunakan kata kunci yang lebih spesifik seperti nama model (PBL, PjBL, Discovery, CIRC), alur kurikulum (CP, TP, ATP, Fase Fondasi), desain (canvas krem, teal), atau arsitektur/keamanan (RLS, Supabase).",
      sources: [],
      model: MODELS_TO_TRY[0],
    };
  }

  // Format context dari chunk yang relevan
  const contextBlock = scoredChunks
    .map((sc, index) => {
      return `--- DOKUMEN [${index + 1}]: ${sc.chunk.sourceDoc} (Section: ${sc.chunk.title}) ---
${sc.chunk.content}`;
    })
    .join("\n\n");

  const systemInstruction = `Kamu adalah "Modulin Assistant" — asisten AI ahli untuk platform SaaS Modulin (web app pembuat Modul Ajar Kurikulum Merdeka bagi guru Indonesia).
Tugasmu adalah menjawab pertanyaan pengguna atau tim pengembang DENGAN TEPAT dan HANYA BERDASARKAN DOKUMENTASI RESMI MODULIN yang disediakan di bagian Konteks Dokumentasi.

ATURAN WAJIB:
1. Jawab dalam Bahasa Indonesia yang profesional, ramah, dan terstruktur (gunakan bullet point atau tabel jika membantu).
2. Grounding ketat: Jawab berdasarkan konteks dokumen yang diberikan. JANGAN mengarang fitur atau informasi yang bertentangan dengan dokumen.
3. Sebutkan nama dokumen sumber (misalnya AGENT.md, PRD.md, RULES.md, DESIGN.md, ARSITEKTUR.md, SCHEMA.md, SECURITY.md, atau USERFLOW.md) di dalam jawaban sebagai rujukan.
4. Jika konteks tidak cukup menjawab seluruh pertanyaan, nyatakan keterbatasan tersebut dengan jujur (sesuai prinsip guardrail Modulin).`;

  const userPrompt = `KONTEKS DOKUMENTASI SAAS MODULIN:
${contextBlock}

PERTANYAAN PENGGUNA:
${query}

Silakan berikan jawaban komprehensif, faktual, dan sertakan rujukan dokumen yang relevan.`;

  try {
    const { response, modelUsed } = await generateWithRetry({
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Rendah untuk faktualitas tinggi
        maxOutputTokens: 2048,
      },
    });

    const answerText = response.text ?? "Gagal mendapatkan respon dari AI.";

    const sources = scoredChunks.map((sc) => ({
      doc: sc.chunk.sourceDoc,
      section: sc.chunk.title,
      relevanceScore: sc.score,
    }));

    return {
      query,
      answer: answerText,
      sources,
      tokensUsed: response.usageMetadata?.totalTokenCount,
      model: modelUsed,
    };
  } catch (error: any) {
    console.error("Error in querySAASAssistant:", error);
    return {
      query,
      answer: `Terjadi kendala saat menghubungi AI service: ${error?.message || "Unknown error"}`,
      sources: scoredChunks.map((sc) => ({
        doc: sc.chunk.sourceDoc,
        section: sc.chunk.title,
        relevanceScore: sc.score,
      })),
      model: MODELS_TO_TRY[0],
    };
  }
}
