import Groq from "groq-sdk";
import type { QuestionItem } from "./types";

let _client: Groq | null = null;

export function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set. Add it to your .env.local.");
  }
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _client;
}

export const QUESTIONS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          q: { type: "string", description: "The question text. May include numbered statements." },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Exactly four answer options."
          },
          correct: {
            type: "integer",
            description: "Zero-based index of the correct option (0 to 3)."
          },
          explain: { type: "string", description: "Concise explanation grounded in facts." }
        },
        required: ["q", "options", "correct", "explain"],
        additionalProperties: false
      }
    }
  },
  required: ["items"],
  additionalProperties: false
} as const;

export const MAINS_QUESTIONS_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          q: { type: "string", description: "The essay/mains question text." },
          answer: { type: "string", description: "Model answer (100-150 words) covering key points." },
          keyPoints: {
            type: "array",
            items: { type: "string" },
            description: "2-3 key points that should be covered in a comprehensive answer."
          }
        },
        required: ["q", "answer", "keyPoints"],
        additionalProperties: false
      }
    }
  },
  required: ["items"],
  additionalProperties: false
} as const;

const QUIZ_FROM_NEWS_SYSTEM = `You are an expert UPSC Civil Services question setter for "Daily Tutors", an Indian exam-prep platform.

Generate high-quality multiple-choice questions (MCQs) suitable for the UPSC Prelims exam from the news article(s) provided.

Standards:
- Each question MUST have exactly 4 options (A/B/C/D).
- Mark the zero-based index of the correct option in "correct" (0-3).
- Include a 1-2 sentence "explain" with the factual reasoning, citing constitutional articles, schemes, or institutions where relevant.
- Mix question types: factual ("which of the following is true"), 2-statement ("Consider the following statements"), match-the-pair, and analytical.
- Keep options plausible and similar in length to avoid giveaways.
- Stay strictly factual — no opinion, no speculation. If the article doesn't support a verifiable MCQ, skip it.
- Use formal exam-style language; UK English where applicable to UPSC norms.

Output the result as JSON conforming to the provided schema.`;

const QUESTIONS_FROM_TEXT_SYSTEM = `You are extracting multiple-choice questions (MCQs) from a document (a question bank, magazine, or notes) for the "Daily Tutors" UPSC platform.

Carefully read the text and extract every well-formed MCQ you find. Reformat each into the strict schema:
- Exactly 4 options. If the source has 3 or 5, pick the closest 4 and discard or merge thoughtfully; if you cannot reduce to 4 reliably, skip the question.
- "correct" is the zero-based index (0-3).
- "explain" is a short factual rationale. If the source provides one, paraphrase concisely; otherwise write a brief one based on the question.
- Preserve numbered statements ("1. ... 2. ...") inside the question text.
- Skip headings, table-of-contents items, or partial fragments.

Output JSON conforming to the schema.`;

const MAINS_QUESTIONS_FROM_NEWS_SYSTEM = `You are an expert UPSC Civil Services question setter for "Daily Tutors", an Indian exam-prep platform.

Generate high-quality Mains/essay-type questions suitable for the UPSC Mains exam from the news article(s) provided.

Standards:
- Each question should be suitable for an essay-type or long-form answer (typically 7-10 minutes of writing).
- Include 2-3 key points that should be covered in a comprehensive answer.
- The question should test analytical and critical thinking, not just factual knowledge.
- Questions should relate to major themes like governance, economy, society, environment, or ethics.
- Each answer should be 300-500 words worth of content.
- Provide a brief model answer (100-150 words) that outlines the key points.
- Use formal exam-style language; UK English where applicable to UPSC norms.

Output the result as JSON conforming to the provided schema.`;

const MAINS_QUESTIONS_FROM_TEXT_SYSTEM = `You are extracting essay/mains-type questions from a document (notes, compilations, or study material) for the "Daily Tutors" UPSC platform.

Carefully read the text and create 2-3 essay-type questions that could be asked in UPSC Mains based on the content. For each question:
- Create a question that requires analytical thinking and comprehensive answers (300-500 words worth).
- Provide 2-3 key points that must be covered in a good answer.
- Write a brief model answer (100-150 words) covering the key points.
- Ensure the question is relevant to current affairs, governance, or policy issues.

Output JSON conforming to the schema.`;

async function callGroqJSON(system: string, userPrompt: string, maxQuestions: number, isMains = false): Promise<QuestionItem[]> {
  const client = getClient();
  const cappedHint = ` Generate up to ${maxQuestions} excellent questions; quality over quantity.`;
  
  try {
    console.log(`📝 Calling Groq API with model: llama-3.3-70b-versatile (${isMains ? "Mains" : "MCQ"})...`);
    
    let jsonFormat: string;
    if (isMains) {
      jsonFormat = `\n\nRespond ONLY with valid JSON matching this format:\n{\n  "items": [\n    {"q": "essay question", "answer": "model answer 100-150 words", "keyPoints": ["point 1", "point 2", "point 3"]}\n  ]\n}`;
    } else {
      jsonFormat = `\n\nRespond ONLY with valid JSON matching this format:\n{\n  "items": [\n    {"q": "question text", "options": ["A", "B", "C", "D"], "correct": 0, "explain": "explanation"}\n  ]\n}`;
    }
    
    const resp = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `${system}${cappedHint}`
        },
        { 
          role: "user", 
          content: userPrompt + jsonFormat
        }
      ]
    });

    const message = resp.choices?.[0]?.message;
    if (!message || !message.content) {
      console.error("❌ Invalid Groq response:", JSON.stringify(resp));
      throw new Error("Empty model response");
    }
    
    // Extract JSON from response
    const text = message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No JSON in Groq response:", text);
      throw new Error("No JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    let items: QuestionItem[] = [];
    
    if (isMains) {
      items = (parsed.items ?? []).filter(
        (it: any) =>
          typeof it.q === "string" &&
          typeof it.answer === "string" &&
          Array.isArray(it.keyPoints) &&
          it.keyPoints.length >= 2
      ).map((it: any) => ({
        type: "mains" as const,
        q: it.q,
        answer: it.answer,
        keyPoints: it.keyPoints,
        explain: it.explain || ""
      }));
    } else {
      items = (parsed.items ?? []).filter(
        (it: any) =>
          typeof it.q === "string" &&
          Array.isArray(it.options) &&
          it.options.length === 4 &&
          typeof it.correct === "number" &&
          it.correct >= 0 &&
          it.correct <= 3
      ).map((it: any) => ({
        type: "mcq" as const,
        q: it.q,
        options: it.options,
        correct: it.correct,
        explain: it.explain || ""
      }));
    }
    
    console.log(`✅ Generated ${items.length} ${isMains ? "Mains" : "MCQ"} questions from Groq`);
    return items;
  } catch (error) {
    console.error("❌ Groq API error:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

export async function generateQuestionsFromArticle(article: { title: string; description?: string | null; content?: string | null; url?: string | null }, count = 8, type: "mcq" | "mains" | "both" = "mcq"): Promise<QuestionItem[]> {
  const userPrompt = [
    `# Source Article`,
    `Title: ${article.title}`,
    article.url ? `URL: ${article.url}` : "",
    article.description ? `\nLede: ${article.description}` : "",
    article.content ? `\nBody:\n${article.content}` : "",
    "",
    type === "mcq" ? "Generate UPSC-style MCQs grounded in the facts above." :
    type === "mains" ? "Generate UPSC Mains-style essay questions grounded in the facts above." :
    "Generate both UPSC-style MCQs and Mains essay questions grounded in the facts above."
  ].filter(Boolean).join("\n");
  
  if (type === "both") {
    const mcqCount = Math.ceil(count / 2);
    const mainsCount = count - mcqCount;
    const mcqs = await callGroqJSON(QUIZ_FROM_NEWS_SYSTEM, userPrompt, mcqCount, false);
    const mains = await callGroqJSON(MAINS_QUESTIONS_FROM_NEWS_SYSTEM, userPrompt, mainsCount, true);
    return [...mcqs, ...mains];
  } else if (type === "mains") {
    return callGroqJSON(MAINS_QUESTIONS_FROM_NEWS_SYSTEM, userPrompt, count, true);
  }
  
  return callGroqJSON(QUIZ_FROM_NEWS_SYSTEM, userPrompt, count, false);
}

export async function extractQuestionsFromText(text: string, max = 30, type: "mcq" | "mains" | "both" = "mcq"): Promise<QuestionItem[]> {
  const userPrompt = `# Document text\n\n${text.slice(0, 60000)}\n\n---\n` + 
    (type === "mcq" ? "Extract every well-formed MCQ. Reformat to the schema." :
     type === "mains" ? "Create essay/mains-type questions based on this content. Reformat to the schema." :
     "Extract MCQs and create essay/mains questions based on this content.");
  
  if (type === "both") {
    const mcqCount = Math.ceil(max / 2);
    const mainsCount = max - mcqCount;
    const mcqs = await callGroqJSON(QUESTIONS_FROM_TEXT_SYSTEM, userPrompt, mcqCount, false);
    const mains = await callGroqJSON(MAINS_QUESTIONS_FROM_TEXT_SYSTEM, userPrompt, mainsCount, true);
    return [...mcqs, ...mains];
  } else if (type === "mains") {
    return callGroqJSON(MAINS_QUESTIONS_FROM_TEXT_SYSTEM, userPrompt, max, true);
  }
  
  return callGroqJSON(QUESTIONS_FROM_TEXT_SYSTEM, userPrompt, max, false);
}
