import fs from "fs";
import path from "path";

const markdownDir = path.resolve("./markdown");
console.log("Checking markdown directory:", markdownDir);

if (fs.existsSync(markdownDir)) {
  const files = fs.readdirSync(markdownDir).filter(f => f.endsWith(".md"));
  console.log("Found markdown files:", files);
  
  let totalLength = 0;
  for (const f of files) {
    const content = fs.readFileSync(path.join(markdownDir, f), "utf-8");
    totalLength += content.length;
    const headings = content.match(/^#{1,3}\s+.+$/gm) || [];
    console.log(`- ${f}: ${content.length} chars, ${headings.length} sections`);
  }
  console.log("Total docs length:", totalLength, "chars");
} else {
  console.error("Markdown directory not found!");
}
