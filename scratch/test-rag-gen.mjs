import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
const apiKey = match ? match[1].trim() : process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      });
      return response.text;
    } catch (err) {
      console.log(`Attempt ${i + 1} failed: ${err.message || err.status}. Retrying in ${2 * (i + 1)}s...`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function testRAG() {
  console.log("Testing RAG generation with retry...");
  const agentMd = fs.readFileSync("markdown/AGENT.md", "utf-8");
  const sampleContext = agentMd.substring(0, 3000);

  const text = await generateWithRetry(`KONTEKS DOKUMENTASI MODULIN:
${sampleContext}

PERTANYAAN:
Berdasarkan dokumen AGENT.md, apa perbedaan paling kritis antara Problem-Based Learning (PBL) dan Project-Based Learning (PjBL)?`);

  console.log("\n=== AI RESPONSE ===");
  console.log(text);
}

testRAG().catch(console.error);
