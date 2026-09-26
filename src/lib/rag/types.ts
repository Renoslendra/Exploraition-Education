export interface KnowledgeChunk {
  id: string;
  sourceDoc: string; // e.g. "AGENT.md", "PRD.md"
  title: string;
  headingLevel: number;
  content: string;
  category: "agent" | "architecture" | "design" | "prd" | "rules" | "schema" | "security" | "userflow" | "general";
  keywords: string[];
}

export interface RetrievalQuery {
  query: string;
  topK?: number;
  category?: KnowledgeChunk["category"];
  threshold?: number;
}

export interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchReasons: string[];
}

export interface RAGAnswer {
  query: string;
  answer: string;
  sources: {
    doc: string;
    section: string;
    relevanceScore: number;
  }[];
  tokensUsed?: number;
  model: string;
}

export interface CurriculumRAGContext {
  modelSyntax?: {
    kode: string;
    nama: string;
    fokus: string;
    tahapan: { fase: number; nama: string; deskripsi: string }[];
  };
  phaseInfo?: {
    kode: string;
    nama: string;
    jenjang: string;
    isFondasi: boolean;
    terminology: {
      capaian: string; // "Capaian Perkembangan" vs "Capaian Pembelajaran"
      pendekatan: string;
    };
  };
  officialStructurePrompt: string;
  guardrailsPrompt: string;
}
