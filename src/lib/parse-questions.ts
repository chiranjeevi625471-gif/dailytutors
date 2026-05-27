import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { extractQuestionsFromText } from "./groq";
import type { QuestionItem } from "./types";

export type ParsedFile = {
  text: string;
  source: "pdf" | "docx";
};

export async function fileToText(buffer: Buffer, filename: string): Promise<ParsedFile> {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const out = await parser.getText();
      return { text: out.text || "", source: "pdf" };
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }
  if (lower.endsWith(".docx") || lower.endsWith(".doc")) {
    const out = await mammoth.extractRawText({ buffer });
    return { text: out.value || "", source: "docx" };
  }
  throw new Error("Unsupported file type. Upload a .pdf or .docx file.");
}

// Best-effort regex parse for cleanly-formatted question banks.
// Only used as a fast first pass; the LLM is the source of truth.
export function regexParseQuestions(text: string): QuestionItem[] {
  const blocks = text.split(/\n\s*(?=Q\s*[\.\)\:]?\s*\d+|^\d+\s*[\.\)])/gim);
  const out: QuestionItem[] = [];
  for (const blk of blocks) {
    const optMatches = [...blk.matchAll(/^\s*[A-Da-d][\.\)]\s*(.+)$/gm)];
    if (optMatches.length !== 4) continue;
    const qLine = blk.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "";
    const ansMatch = blk.match(/Answer\s*[:\-]\s*([A-Da-d])/i);
    const explainMatch = blk.match(/Explanation\s*[:\-]\s*([\s\S]+)$/i);
    if (!ansMatch) continue;
    out.push({
      q: qLine,
      options: optMatches.map((m) => m[1].trim()),
      correct: ansMatch[1].toLowerCase().charCodeAt(0) - "a".charCodeAt(0),
      explain: explainMatch ? explainMatch[1].trim().slice(0, 400) : ""
    });
  }
  return out;
}

export async function parseFileToQuestions(buffer: Buffer, filename: string, questionType: "mcq" | "mains" | "both" = "mcq"): Promise<{ items: QuestionItem[]; source: "pdf" | "docx"; usedAI: boolean }> {
  const { text, source } = await fileToText(buffer, filename);
  if (!text.trim()) throw new Error("Could not extract any text from the file.");

  const regex = regexParseQuestions(text);
  if (regex.length >= 5 && questionType !== "mains") {
    return { items: regex, source, usedAI: false };
  }

  // Fall back to Groq — handles unstructured magazines, notes, mixed layouts
  const items = await extractQuestionsFromText(text, 30, questionType);
  return { items, source, usedAI: true };
}
