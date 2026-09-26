import { loadKnowledgeBase } from "./knowledge-store";
import { CurriculumRAGContext, KnowledgeChunk, RetrievalQuery, ScoredChunk } from "./types";

// Sinonim dan ekspansi istilah umum dalam ekosistem Modulin & Kurikulum Merdeka
const SYNONYMS: Record<string, string[]> = {
  pbl: ["problem-based learning", "masalah", "solusi", "analisis", "kegiatan_inti"],
  pjbl: ["project-based learning", "proyek", "produk", "artefak", "jadwal"],
  paud: ["fase fondasi", "tk", "bermain", "capaian perkembangan", "fondasi"],
  fondasi: ["paud", "tk", "capaian perkembangan", "bermain-belajar"],
  cp: ["capaian pembelajaran", "capaian perkembangan", "tujuan pembelajaran", "tp", "atp"],
  atp: ["alur tujuan pembelajaran", "tujuan pembelajaran", "cp", "semester"],
  export: ["ekspor", "pdf", "docx", "word", "html2pdf", "unduh", "cetak"],
  warna: ["teal", "canvas", "krem", "primary", "surface-dark", "palette", "hex"],
  desain: ["design", "cormorant garamond", "inter", "typography", "canvas krem", "teal"],
  skema: ["schema", "database", "tabel", "modules", "module_sections", "rls", "supabase"],
  keamanan: ["security", "rls", "token", "google oauth", "uu pdp", "sanitasi", "xss"],
  guru: ["user", "persona", "pak andi", "bu sari", "identitas"],
};

/**
 * Tokenize teks menjadi array kata kunci bersih
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Melakukan ekspansi query dengan sinonim domain
 */
function expandQuery(queryTokens: string[]): string[] {
  const expanded = new Set<string>(queryTokens);

  for (const token of queryTokens) {
    if (SYNONYMS[token]) {
      for (const syn of SYNONYMS[token]) {
        for (const word of tokenize(syn)) {
          expanded.add(word);
        }
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Menghitung skor relevansi chunk terhadap query
 */
function scoreChunk(chunk: KnowledgeChunk, query: string, queryTokens: string[], expandedTokens: string[]): ScoredChunk {
  const contentLower = chunk.content.toLowerCase();
  const titleLower = chunk.title.toLowerCase();
  const queryLower = query.toLowerCase().trim();

  let score = 0;
  const matchReasons: string[] = [];

  // 1. Exact phrase match di title
  if (titleLower.includes(queryLower) && queryLower.length > 3) {
    score += 50;
    matchReasons.push(`Judul section cocok persis dengan query ("${chunk.title}")`);
  }

  // 2. Exact phrase match di content
  if (contentLower.includes(queryLower) && queryLower.length > 3) {
    score += 35;
    matchReasons.push("Frase query ditemukan persis di dalam konten");
  }

  // 3. Title token overlap
  let titleTokenMatches = 0;
  for (const token of queryTokens) {
    if (titleLower.includes(token)) {
      titleTokenMatches++;
    }
  }
  if (titleTokenMatches > 0) {
    const boost = (titleTokenMatches / queryTokens.length) * 30;
    score += boost;
    matchReasons.push(`${titleTokenMatches} kata kunci ditemukan pada judul`);
  }

  // 4. Content token matching (TF-IDF weighted approximation)
  let contentTokenMatches = 0;
  for (const token of queryTokens) {
    const count = (contentLower.match(new RegExp(`\\b${token}`, "g")) || []).length;
    if (count > 0) {
      contentTokenMatches++;
      score += Math.min(count * 2, 16); // Diminishing return
    }
  }

  // 5. Expanded synonym matches
  let synonymMatches = 0;
  for (const exp of expandedTokens) {
    if (!queryTokens.includes(exp) && contentLower.includes(exp)) {
      synonymMatches++;
      score += 3;
    }
  }
  if (synonymMatches > 0) {
    matchReasons.push(`${synonymMatches} istilah terkait/sinonim ditemukan`);
  }

  // Normalisasi panjang chunk (penalti untuk chunk yang terlalu panjang atau terlalu pendek)
  const lengthPenalty = chunk.content.length > 2500 ? 0.85 : chunk.content.length < 80 ? 0.7 : 1.0;
  score = score * lengthPenalty;

  return {
    chunk,
    score: Math.round(score * 10) / 10,
    matchReasons,
  };
}

/**
 * Mencari chunk pengetahuan paling relevan dari markdown docs Modulin
 */
export async function retrieveContext(options: RetrievalQuery): Promise<ScoredChunk[]> {
  const { query, topK = 5, category, threshold = 8 } = options;
  const chunks = await loadKnowledgeBase();

  const queryTokens = tokenize(query);
  const expandedTokens = expandQuery(queryTokens);

  let candidateChunks = chunks;
  if (category) {
    candidateChunks = chunks.filter((c) => c.category === category);
  }

  const scored: ScoredChunk[] = [];

  for (const chunk of candidateChunks) {
    const evaluated = scoreChunk(chunk, query, queryTokens, expandedTokens);
    if (evaluated.score >= threshold) {
      scored.push(evaluated);
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * RAG Context builder khusus untuk pembuatan / modulasi Modul Ajar
 */
export async function getCurriculumRAGContext(
  fase: string,
  _mataPelajaran: string,
  modelKode: string
): Promise<CurriculumRAGContext> {
  const isFondasi = fase.toLowerCase().includes("fondasi") || fase.toLowerCase().includes("paud");

  // Query retrieval untuk model pembelajaran
  const modelChunks = await retrieveContext({
    query: `${modelKode} sintak tahapan model pembelajaran`,
    topK: 2,
    category: "agent",
  });

  // Query retrieval untuk guardrail kurikulum & format resmi
  const guardrailChunks = await retrieveContext({
    query: "guardrail konten ketentuan kepatuhan kurikulum merdeka",
    topK: 2,
    category: "rules",
  });

  const structureChunks = await retrieveContext({
    query: "skema output terstruktur 3 komponen informasi umum komponen inti lampiran",
    topK: 2,
    category: "agent",
  });

  // Format context prompts
  const officialStructurePrompt = structureChunks
    .map((c) => `### Referensi Struktur [${c.chunk.sourceDoc}]:\n${c.chunk.content}`)
    .join("\n\n");

  const guardrailsPrompt = guardrailChunks
    .map((c) => `### Referensi Guardrail [${c.chunk.sourceDoc}]:\n${c.chunk.content}`)
    .join("\n\n");

  return {
    phaseInfo: {
      kode: fase,
      nama: isFondasi ? "Fase Fondasi (PAUD/TK)" : `Fase ${fase}`,
      jenjang: isFondasi ? "PAUD/TK" : "SD/SMP/SMA",
      isFondasi,
      terminology: {
        capaian: isFondasi ? "Capaian Perkembangan" : "Capaian Pembelajaran (CP)",
        pendekatan: isFondasi ? "Bermain-Belajar Konkret" : "Instruksional Pedagogis Kontekstual",
      },
    },
    officialStructurePrompt: officialStructurePrompt || "Gunakan struktur 3 komponen: Informasi Umum, Komponen Inti, Lampiran.",
    guardrailsPrompt: guardrailsPrompt || "Jangan mengarang CP. Ikuti alur CP -> TP -> ATP -> Modul Ajar.",
    modelSyntax: {
      kode: modelKode,
      nama: modelKode.toUpperCase(),
      fokus: modelChunks[0]?.chunk.title || "Pembelajaran berbasis Kurikulum Merdeka",
      tahapan: [],
    },
  };
}
