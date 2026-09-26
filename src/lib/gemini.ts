import { GoogleGenAI } from "@google/genai";

// Server-side only — GEMINI_API_KEY tidak punya prefix NEXT_PUBLIC_
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateModulAjar(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  return response.text ?? "";
}

export { ai };
