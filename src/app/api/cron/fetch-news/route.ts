import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import { fetchAllNews } from '@/lib/news';
import { processArticleWithAI } from '@/lib/ai';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret - Accept both Bearer token and direct secret check
    // Vercel cron jobs don't send auth headers, so we check CRON_SECRET exists
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow if: Bearer token matches OR CRON_SECRET is set (Vercel validates this)
    const isAuthorized = 
      (cronSecret && authHeader === `Bearer ${cronSecret}`) || 
      (cronSecret && !authHeader); // Vercel cron doesn't send auth header

    if (!cronSecret || !isAuthorized) {
      console.error('❌ Cron unauthorized - CRON_SECRET not set or invalid token');
      return NextResponse.json(
        { error: 'Unauthorized - configure CRON_SECRET in environment' },
        { status: 401 }
      );
    }

    await connectDB();

    console.log('🔄 Starting automated news fetch and processing...');

    // Fetch latest news
    const newsArticles = await fetchAllNews();
    console.log(`📰 Fetched ${newsArticles.length} articles`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each article
    for (const newsArticle of newsArticles) {
      try {
        // Check if article already exists
        const slug = slugify(newsArticle.title || '', { lower: true });
        const existingArticle = await Article.findOne({ slug });

        if (existingArticle) {
          console.log(`⏭️  Skipping duplicate: ${newsArticle.title}`);
          continue;
        }

        // Process with AI
        let aiData: any = {
          summary: newsArticle.description || '',
          subject: 'Polity',
          keywords: [],
          prelimsFacts: [],
          mainsAnalysis: '',
          gsPaperMapping: [],
          mcqs: [],
          wayForward: '',
          relatedTopics: [],
          constitutionalLinks: [],
        };

        try {
          const sourceText = newsArticle.content || newsArticle.description;
          if (sourceText) {
            aiData = await processArticleWithAI(sourceText);
          }
        } catch (aiError) {
          console.error(`⚠️  AI processing failed for: ${newsArticle.title}`, aiError);
          // Continue with partial data
        }

        // Required fields must be non-empty for the Article schema.
        const summary = aiData.summary || newsArticle.description || newsArticle.title || '';
        const content =
          newsArticle.content || newsArticle.description || summary || newsArticle.title || '';

        // Map AI MCQ shape -> Article MCQ subdocument shape.
        const DIFFICULTY: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        const mcqs = (aiData.mcqs || [])
          .filter((m: any) => m && m.question && Array.isArray(m.options))
          .map((m: any) => ({
            question: m.question,
            options: m.options,
            correctOption: typeof m.correctAnswer === 'number' ? m.correctAnswer : 0,
            explanation: m.explanation || '',
            difficulty: DIFFICULTY[String(m.difficulty || '').toLowerCase()] || 'Medium',
          }));

        // Create article using the unified Article schema (src/lib/models.ts).
        const article = await Article.create({
          title: newsArticle.title,
          slug,
          source: newsArticle.channel || newsArticle.source || 'Other',
          sourceUrl: newsArticle.url,
          category: aiData.subject || 'Polity',
          gsPapers: aiData.gsPaperMapping || [],
          content,
          summary,
          featuredImage: newsArticle.image,
          keywords: aiData.keywords || [],
          prelimsPointers: aiData.prelimsFacts || [],
          mainsAnalysis: aiData.mainsAnalysis || '',
          constitutionalLinks: aiData.constitutionalLinks || [],
          wayForward: aiData.wayForward || '',
          relatedArticles: aiData.relatedTopics || [],
          mcqs,
          tags: newsArticle.channel ? [newsArticle.channel] : [],
          aiGenerated: true,
          aiModel: 'groq',
          generatedAt: new Date(),
          status: 'published', // Auto-publish: AI news goes live immediately
          publishedAt: newsArticle.publishedAt ? new Date(newsArticle.publishedAt) : new Date(),
        });

        console.log(`✅ Processed: ${newsArticle.title}`);
        processedCount++;
      } catch (error: any) {
        console.error(`❌ Error processing article:`, error.message);
        errorCount++;
      }
    }

    console.log(
      `✨ Processing complete: ${processedCount} articles processed, ${errorCount} errors`
    );

    return NextResponse.json({
      success: true,
      message: 'Cron job completed successfully',
      results: {
        fetchedArticles: newsArticles.length,
        processedArticles: processedCount,
        errors: errorCount,
      },
    });
  } catch (error: any) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
