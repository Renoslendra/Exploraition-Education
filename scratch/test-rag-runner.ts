import fs from "fs";
import { loadKnowledgeBase, getKnowledgeStats } from "../src/lib/rag/knowledge-store";
import { retrieveContext } from "../src/lib/rag/retriever";
import { querySAASAssistant } from "../src/lib/rag/generator";

// Load .env.local manually for standalone execution
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("🚀 MODULIN SAAS RAG SYSTEM — INTEGRATION TEST");
  console.log("=================================================\n");

  // TEST 1: Knowledge Store Loading & Indexing
  console.log("--- [TEST 1] Ingesting & Chunking Markdown Docs ---");
  const stats = await getKnowledgeStats();
  console.log(`✅ Berhasil mengindeks total ${stats.totalChunks} chunks dari ${Object.keys(stats.documents).length} dokumen:`);
  for (const [doc, count] of Object.entries(stats.documents)) {
    console.log(`   📄 ${doc.padEnd(16)} : ${count} sections`);
  }
  console.log("");

  // TEST 2: Context Retrieval Scoring
  console.log("--- [TEST 2] Context Retrieval & Scoring ---");
  const sampleQueries = [
    "Apa perbedaan PBL dan PjBL?",
    "Bagaimana aturan untuk Fase Fondasi PAUD?",
    "Apa warna primer dan filosofi desain Modulin?",
  ];

  for (const q of sampleQueries) {
    console.log(`🔍 Query: "${q}"`);
    const results = await retrieveContext({ query: q, topK: 2 });
    for (const r of results) {
      console.log(`   ⭐ [Score: ${r.score}] Doc: ${r.chunk.sourceDoc} -> Section: "${r.chunk.title}"`);
      console.log(`      Snippet: ${r.chunk.content.substring(0, 110).replace(/\n/g, " ")}...`);
    }
    console.log("");
  }

  // TEST 3: Full RAG Answer Generation (with Gemini 3.8 Flash)
  console.log("--- [TEST 3] End-to-End RAG AI Query ---");
  const testQuestion = "Berdasarkan dokumen PRD dan AGENT, jelaskan secara spesifik apa perbedaan utama antara Problem-Based Learning (PBL) dan Project-Based Learning (PjBL) di Modulin?";
  console.log(`❓ Pertanyaan Uji: "${testQuestion}"\n`);
  console.log("⏳ Mengirim ke Gemini 3.8 Flash dengan context injection...");

  const ragResult = await querySAASAssistant(testQuestion);

  console.log("\n=================== HASIL JAWABAN AI ===================");
  console.log(ragResult.answer);
  console.log("========================================================\n");

  console.log("📚 Sumber Dokumen Rujukan:");
  for (const s of ragResult.sources) {
    console.log(`   - [${s.doc}] Section: "${s.section}" (Skor Relevansi: ${s.relevanceScore})`);
  }
  console.log(`\n🤖 Model: ${ragResult.model}`);
  console.log(`📊 Token Terpakai: ${ragResult.tokensUsed ?? "N/A"}`);
  console.log("\n✅ SEMUA TEST BERHASIL DIJALANKAN!");
}

runTests().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
