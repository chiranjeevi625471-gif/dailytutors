import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface AIResponse {
  summary: string;
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
  "keywords": ["keyword1", "keyword2", ...],
  "prelimsFacts": ["fact1", "fact2", ...],
  "mainsAnalysis": "Detailed analysis for mains exam",
  "gsPaperMapping": ["GS1", "GS2", ...],
  "mcqs": [
    {
      "question": "Multiple choice question",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "Explanation of the correct answer",
      "difficulty": "easy"
    }
  ],
  "wayForward": "Way forward or implications",
  "relatedTopics": ["topic1", "topic2", ...],
  "constitutionalLinks": ["Article XXX", ...]
}

Only return valid JSON without any additional text.`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
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
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
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
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
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
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 200,
    });

    const keywords = response.choices[0]?.message?.content || '';
    return keywords.split(',').map((k) => k.trim());
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return [];
  }
}
