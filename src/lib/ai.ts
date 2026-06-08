import { chatCompletion } from './groq';

// Subject taxonomy must match the Article model's `category` enum.
export const SUBJECT_CATEGORIES = [
  'Polity',
  'Economy',
  'Environment',
  'Science_Technology',
  'Geography',
  'Ethics',
  'International_Relations',
] as const;

interface AIResponse {
  summary: string;
  subject: string; // one of SUBJECT_CATEGORIES
  keywords: string[];
  prelimsFacts: string[];
  mainsAnalysis: string;
  gsPaperMapping: string[];
  mcqs: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  wayForward: string;
  relatedTopics: string[];
  constitutionalLinks: string[];
}

export async function processArticleWithAI(content: string): Promise<AIResponse> {
  const prompt = `You are an expert UPSC preparation assistant. Analyze the following news article and provide comprehensive information for UPSC aspirants.

Article:
${content}

Provide the response in the following JSON format (ensure valid JSON):
{
  "summary": "2-3 line summary of the article",
  "subject": "ONE of: Polity, Economy, Environment, Science_Technology, Geography, Ethics, International_Relations",
  "keywords": ["keyword1", "keyword2"],
  "prelimsFacts": ["crisp factual pointer 1", "crisp factual pointer 2"],
  "mainsAnalysis": "Detailed analytical answer-style content for the Mains exam (issues, significance, challenges)",
  "gsPaperMapping": ["GS2", "GS3"],
  "mcqs": [
    {
      "question": "Prelims-style multiple choice question",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "Explanation of the correct answer",
      "difficulty": "medium"
    }
  ],
  "wayForward": "Way forward or implications",
  "relatedTopics": ["topic1", "topic2"],
  "constitutionalLinks": ["Article XXX"]
}

"gsPaperMapping" values must be from: GS1, GS2, GS3, GS4, Essay, Prelims.
Write ALL text fields in English only, regardless of the article's original language.
Only return valid JSON without any additional text.`;

  try {
    const response = await chatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw) as Partial<AIResponse>;

    // Normalize so the cron always gets a complete, safe shape.
    return {
      summary: parsed.summary || '',
      subject: (SUBJECT_CATEGORIES as readonly string[]).includes(parsed.subject || '')
        ? (parsed.subject as string)
        : 'Polity',
      keywords: parsed.keywords || [],
      prelimsFacts: parsed.prelimsFacts || [],
      mainsAnalysis: parsed.mainsAnalysis || '',
      gsPaperMapping: parsed.gsPaperMapping || [],
      mcqs: parsed.mcqs || [],
      wayForward: parsed.wayForward || '',
      relatedTopics: parsed.relatedTopics || [],
      constitutionalLinks: parsed.constitutionalLinks || [],
    };
  } catch (error) {
    console.error('AI Processing error:', error);
    throw error;
  }
}

export async function generateMCQs(topic: string, count = 5): Promise<any[]> {
  const prompt = `Generate ${count} multiple choice questions for UPSC Prelims on the topic: ${topic}

Return a valid JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": 0,
    "explanation": "Explanation of correct answer",
    "difficulty": "medium"
  }
]

Only return the JSON array without any additional text.`;

  try {
    const response = await chatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '[]';
    return JSON.parse(content);
  } catch (error) {
    console.error('MCQ Generation error:', error);
    return [];
  }
}

export async function generateSummary(text: string): Promise<string> {
  const prompt = `Summarize the following text in 2-3 lines for UPSC aspirants:\n\n${text}`;

  try {
    const response = await chatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Summary generation error:', error);
    return '';
  }
}

export async function extractKeywords(text: string): Promise<string[]> {
  const prompt = `Extract the top 10 important keywords from this text for UPSC preparation:\n\n${text}\n\nReturn only keywords separated by commas, no explanations.`;

  try {
    const response = await chatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const keywords: string = response.choices[0]?.message?.content || '';
    return keywords.split(',').map((k: string) => k.trim());
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return [];
  }
}
