import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
const apiKey = match ? match[1].trim() : process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

const candidates = ["gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-3.8-flash"];

for (const model of candidates) {
  try {
    process.stdout.write(`Testing ${model}... `);
    const res = await ai.models.generateContent({
      model,
      contents: "Halo!",
    });
    console.log(`SUCCESS: "${res.text?.trim()}"`);
    break;
  } catch (err) {
    console.log(`FAILED: ${err.message || err.status}`);
  }
}
