import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Calendar, Tag, BookOpen, Lightbulb, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

// Glossary of important terms with explanations
const TERM_GLOSSARY: Record<string, { explanation: string; category: string }> = {
  "Budget": { explanation: "Annual financial plan prepared by the government detailing estimated revenues and expenditures for the fiscal year.", category: "Finance" },
  "Policy": { explanation: "Official government decision or course of action designed to address specific issues and guide public administration.", category: "Government" },
  "Regulation": { explanation: "Official rules or directives issued by regulatory bodies to control how something operates or is managed.", category: "Legal" },
  "Reform": { explanation: "Significant changes made to improve or modernize existing systems, laws, institutions, or social structures.", category: "Social" },
  "Inflation": { explanation: "Sustained increase in general price level of goods and services in an economy over time, reducing purchasing power.", category: "Economics" },
  "GDP": { explanation: "Gross Domestic Product - total monetary value of all goods and services produced within a nation's borders annually.", category: "Economics" },
  "Fiscal": { explanation: "Related to government financial matters, including taxation, public spending, and overall financial management.", category: "Finance" },
  "Amendment": { explanation: "Formal change, addition, or modification to a constitution, law, bill, or official document.", category: "Legal" },
  "Infrastructure": { explanation: "Basic physical systems and facilities required for a nation's functioning - roads, railways, bridges, utilities, telecommunications.", category: "Development" },
  "Welfare": { explanation: "Government programs and initiatives designed to ensure well-being and fulfill basic needs of citizens.", category: "Social" },
  "Sustainable": { explanation: "Able to be maintained or continued without depleting resources or causing harm to environment for future generations.", category: "Environment" },
  "Development": { explanation: "Process of improving quality of life, economic growth, and social progress in a region or nation.", category: "Development" },
  "Implementation": { explanation: "Actual process of executing or putting into action a plan, policy, or project.", category: "Administration" },
  "Compliance": { explanation: "Act of adhering to and following required rules, standards, regulations, or legal requirements.", category: "Legal" },
  "Framework": { explanation: "Underlying structure, system, or set of principles that provides foundation for policies or programs.", category: "General" },
};

function extractHighlightedTerms(text: string): Array<{ word: string; explanation: string; category: string }> {
  const foundTerms: Array<{ word: string; explanation: string; category: string }> = [];
  
  for (const [word, data] of Object.entries(TERM_GLOSSARY)) {
    if (text.toLowerCase().includes(word.toLowerCase())) {
      foundTerms.push({ word, ...data });
    }
  }
  
  return foundTerms.slice(0, 8);
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const allPosts = await db.posts.list();
  
  // Find the article across all posts
  let article: any = null;
  let postDate: string = "";
  
  for (const post of allPosts) {
    if (post.articles) {
      const found = post.articles.find((a: any) => a.id === params.id);
      if (found) {
        article = found;
        postDate = post.date;
        break;
      }
    }
  }

  if (!article) return notFound();

  const highlightedTerms = extractHighlightedTerms((article.title || "") + " " + (article.description || ""));
  const fullText = (article.title || "") + " " + (article.description || "") + " " + (article.explanation || "");

  return (
    <div className="container-page py-12">
      <Link href="/current-affairs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <ArrowLeft className="h-4 w-4" />
        Back to Current Affairs
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.channel && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                📺 {article.channel}
              </span>
            )}
            {article.gsCategory && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                <Tag className="h-3 w-3" />
                {article.gsCategory}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-300">
              <Calendar className="h-3 w-3" />
              {new Date(postDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {article.source && (
              <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                {article.source}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              {article.description}
            </p>
          )}
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-green-900">Key Insight</h3>
            </div>
            <p className="text-sm text-green-800">{highlightedTerms.length} important terms identified for exam preparation.</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">Source Channel</h3>
            </div>
            <p className="text-sm text-blue-800">Published by {article.source || article.channel || "News Source"}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Published</h3>
            </div>
            <p className="text-sm text-amber-800">
              {article.publishedAt 
                ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Recently'
              }
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📰 Full Article Overview</h2>
          
          {/* Article Description - Main Content */}
          <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Article Summary</h3>
            <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">
              {article.description || article.content || "Content not available"}
            </p>
            
            {article.author && (
              <p className="text-sm text-gray-600 italic mt-4">
                <span className="font-semibold">Source:</span> {article.author}
              </p>
            )}
            
            {article.source && (
              <p className="text-sm text-gray-600 italic">
                <span className="font-semibold">Publication:</span> {article.source}
              </p>
            )}
          </div>

          {/* Additional Details */}
          {article.content && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Analysis</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
          )}

          {/* Read Original Button */}
          {article.url && (
            <div className="flex gap-3">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                📖 Read Full Article on Original Source
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Highlighted Key Terms Section */}
        {highlightedTerms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Important Terms & Concepts Highlighted</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlightedTerms.map((term, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg hover:shadow-md transition"
                >
                  <div className="mb-3">
                    <span className="inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded text-lg">
                      {term.word}
                    </span>
                    <span className="ml-2 inline-block text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {term.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        <div className="mb-8 bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">✅ Key Takeaways & Quick Summary</h2>
          <ul className="space-y-3">
            {(article.description || article.content || "").split(/[.!?]+/).filter((s: string) => s.trim().length > 20).slice(0, 4).map((point: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-green-800">
                <span className="text-green-600 font-bold text-xl flex-shrink-0">•</span>
                <span className="text-base leading-relaxed">{point.trim()}</span>
              </li>
            ))}
            <li className="flex gap-3 text-green-800">
              <span className="text-green-600 font-bold text-xl flex-shrink-0">•</span>
              <span>Focus on the highlighted key terms above for better understanding and exam preparation.</span>
            </li>
          </ul>
        </div>

        {/* UPSC Connection Card */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-purple-900 mb-2">🎓 UPSC Relevance & Exam Preparation</h3>
              <div className="text-sm text-purple-800 space-y-2">
                <p>
                  This article is highly relevant for UPSC Civil Services examination. Topics covered include:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>✓ Current affairs and policy developments</li>
                  <li>✓ Governance and administration issues</li>
                  <li>✓ Socio-economic updates</li>
                  <li>✓ National and international developments</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Relevant for: General Studies Papers 1, 2, 3 & 4
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">📖 Related Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-blue-600">→</span>
              <span>Previous articles on similar topics</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-blue-600">→</span>
              <span>UPSC question bank on this topic</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-blue-600">→</span>
              <span>Current affairs summary sheets</span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 pt-8 border-t border-gray-300">
          <Link href="/current-affairs" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            ← View All Current Affairs
          </Link>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium inline-flex items-center gap-2"
            >
              Read Original Source
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
