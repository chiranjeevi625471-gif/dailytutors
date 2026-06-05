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
          if (newsArticle.content) {
            aiData = await processArticleWithAI(newsArticle.content);
          }
        } catch (aiError) {
          console.error(`⚠️  AI processing failed for: ${newsArticle.title}`, aiError);
          // Continue with partial data
        }

        // Create article
        const article = await Article.create({
          title: newsArticle.title,
          slug,
          source: newsArticle.source || 'other',
          originalUrl: newsArticle.url,
          content: newsArticle.content || newsArticle.description,
          summary: aiData.summary,
          image: newsArticle.image,
          category: aiData.gsPaperMapping[0] || 'Prelims',
          subcategories: [],
          keyPoints: aiData.prelimsFacts,
          prelimsFacts: aiData.prelimsFacts,
          mainsAnalysis: aiData.mainsAnalysis,
          constitutionalLinks: aiData.constitutionalLinks,
          keywords: aiData.keywords,
          wayForward: aiData.wayForward,
          relatedTopics: aiData.relatedTopics,
          mcqs: aiData.mcqs,
          aiGenerated: true,
          aiModel: 'groq',
          status: 'pending-review', // Requires admin approval
          publishedAt: newsArticle.publishedAt,
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
