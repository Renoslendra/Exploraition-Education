import fs from "fs";
import path from "path";
import { KnowledgeChunk } from "./types";

let cachedChunks: KnowledgeChunk[] | null = null;

const CATEGORY_MAP: Record<string, KnowledgeChunk["category"]> = {
  "AGENT.md": "agent",
  "ARSITEKTUR.md": "architecture",
  "DESIGN.md": "design",
  "PRD.md": "prd",
  "RULES.md": "rules",
  "SCHEMA.md": "schema",
  "SECURITY.md": "security",
  "USERFLOW.md": "userflow",
};

/**
 * Memecah konten markdown menjadi chunk-chunk logis berdasarkan heading (## dan ###)
 * Menangani baris CRLF Windows maupun LF Unix secara sempurna.
 */
function parseMarkdownToChunks(filename: string, content: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const category = CATEGORY_MAP[filename] || "general";
  const lines = content.split(/\r?\n/);

  let currentTitle = filename.replace(".md", "");
  let currentLevel = 1;
  let currentLines: string[] = [];
  let chunkIndex = 0;

  const flush = () => {
    const rawContent = currentLines.join("\n").trim();
    if (rawContent.length > 20) {
      // Ekstrak keywords dari title dan isi
      const words = (currentTitle + " " + rawContent)
        .toLowerCase()
        .replace(/[^a-z0-9\s_-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);

      const uniqueKeywords = Array.from(new Set(words)).slice(0, 50);

      chunks.push({
        id: `${filename}-${chunkIndex++}`,
        sourceDoc: filename,
        title: currentTitle,
        headingLevel: currentLevel,
        content: rawContent,
        category,
        keywords: uniqueKeywords,
      });
    }
    currentLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      flush();
      currentLevel = headerMatch[1].length;
      currentTitle = headerMatch[2].trim();
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return chunks;
}

/**
 * Mengambil path direktori markdown secara aman baik di local dev maupun serverless
 */
function getMarkdownDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), "markdown"),
    path.join(process.cwd(), "..", "markdown"),
    path.resolve(__dirname, "../../../markdown"),
    path.resolve(__dirname, "../../markdown"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return path.join(process.cwd(), "markdown");
}

/**
 * Memuat dan meng-index seluruh dokumen markdown SAAS Modulin
 */
export async function loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
  if (cachedChunks && cachedChunks.length > 0) {
    return cachedChunks;
  }

  const chunks: KnowledgeChunk[] = [];
  const markdownDir = getMarkdownDirectory();

  try {
    if (fs.existsSync(markdownDir)) {
      const files = fs.readdirSync(markdownDir).filter((f) => f.endsWith(".md"));

      for (const file of files) {
        const fullPath = path.join(markdownDir, file);
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const docChunks = parseMarkdownToChunks(file, fileContent);
        chunks.push(...docChunks);
      }
    }
  } catch (err) {
    console.error("Error reading markdown directory for RAG:", err);
  }

  cachedChunks = chunks;
  return chunks;
}

/**
 * Mendapatkan ringkasan metadata dokumen yang telah di-index
 */
export async function getKnowledgeStats() {
  const chunks = await loadKnowledgeBase();
  const docCounts: Record<string, number> = {};

  for (const chunk of chunks) {
    docCounts[chunk.sourceDoc] = (docCounts[chunk.sourceDoc] || 0) + 1;
  }

  return {
    totalChunks: chunks.length,
    documents: docCounts,
  };
}
