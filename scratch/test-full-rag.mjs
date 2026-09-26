import { querySAASAssistant } from "../src/lib/rag/generator.ts";
import fs from "fs";

// Ensure process.env.GEMINI_API_KEY is loaded
const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
if (match) process.env.GEMINI_API_KEY = match[1].trim();

async function run() {
  console.log("Testing querySAASAssistant with end-to-end RAG...");
  const res = await querySAASAssistant("Apa perbedaan antara Problem-Based Learning (PBL) dan Project-Based Learning (PjBL) di Modulin?");
  console.log("\n=== RAG RESULT ===");
  console.log("Sources:", res.sources);
  console.log("\nAnswer:\n", res.answer);
}

run().catch(console.error);
