'use client';

import { useState } from 'react';
import Link from 'next/link';

// Defined Terms Dictionary for highlighting and explanation
const DEFINED_TERMS: Record<string, string> = {
  "budget": "Annual financial plan detailing government revenue and expenditure for fiscal year.",
  "policy": "Official government decision or course of action for addressing specific issues.",
  "regulation": "Rules or directives that control how something operates or is managed.",
  "reform": "Changes made to improve or modernize systems, laws, or institutions.",
  "inflation": "Sustained increase in general price level of goods and services in economy.",
  "gdp": "Gross Domestic Product - total monetary value of goods and services produced.",
  "fiscal": "Related to government revenue, taxation, and public finances.",
  "amendment": "Formal change or addition to a constitution, law, or official document.",
  "infrastructure": "Basic facilities and systems needed for functioning - roads, bridges, utilities.",
  "welfare": "Government programs designed to ensure well-being and basic needs of citizens.",
  "development": "Process of improving quality of life, economic growth, and social progress.",
  "scheme": "Government program or initiative designed to achieve specific objectives.",
  "ministry": "Government department responsible for specific functions and services.",
  "parliament": "Legislative body responsible for making laws and government oversight.",
  "bill": "Proposed law presented for consideration and passage.",
  "implementation": "Actual process of executing or putting into action a plan or policy.",
  "initiative": "New program or process designed to achieve specific goals.",
  "sustainable": "Able to be maintained without depleting resources or harming environment.",
  "climate": "Long-term weather patterns and atmospheric conditions affecting regions.",
  "trade": "Exchange of goods and services between countries or regions.",
  "accord": "A formal agreement or treaty between countries or parties.",
  "bilateral": "Involving two countries, parties, or sides in agreement.",
  "agreement": "A mutual understanding or arrangement between parties.",
  "announcement": "Public statement or official declaration of information.",
  "committee": "Group of people appointed for specific tasks or responsibilities.",
  "conference": "A formal meeting of people with a shared interest.",
  "cooperation": "Joint effort and working together towards common goals.",
  "crisis": "A time of intense difficulty or danger requiring urgent action.",
  "declaration": "Formal announcement or statement of principles or actions.",
  "dispute": "A disagreement or argument between parties.",
  "economy": "The system of production, distribution, and consumption of goods.",
  "federation": "Union of states or regions under a central authority.",
  "government": "System of ruling authority and administration of a state.",
  "institution": "Established organization or system for specific purposes.",
  "investment": "Allocation of resources with expectation of future benefits.",
  "legislation": "Laws and regulations established by legislative authority.",
  "mechanism": "System or process through which something operates.",
  "negotiation": "Discussion aimed at reaching agreement between parties.",
  "protocol": "Official procedure or system of rules and courtesies.",
  "provision": "Clause or condition in an agreement or law.",
  "resolution": "Formal decision or determination of a course of action.",
  "sector": "Distinct part of economy or society.",
  "summit": "High-level meeting between leaders or officials.",
  "treaty": "Formal agreement between countries or international parties.",
  "union": "Joining together of groups, states, or organizations.",
};

// Function to convert article text into bullet points
function formatAsBulletPoints(text?: string | null): string[] {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const bulletPoints: string[] = [];
  
  for (const line of lines) {
    const cleanLine = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
    
    // Skip very short lines or headings
    if (cleanLine.length > 15 && cleanLine.length < 300) {
      bulletPoints.push(cleanLine);
    }
  }
  
  // If no bullet points found, split by sentences
  if (bulletPoints.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 15);
  }
  
  return bulletPoints.slice(0, 15);
}

// Function to extract key points from article text
function extractKeyPoints(text?: string | null): string[] {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const keyPoints: string[] = [];
  
  for (const line of lines) {
    // Look for bullet points or numbered lists
    if (/^[-•*]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())) {
      let point = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
      if (point.length > 20 && point.length < 200) {
        keyPoints.push(point);
      }
    } else if (keyPoints.length < 5 && line.length > 30 && line.length < 150) {
      // Extract important sentences
      if (line.match(/\b(major|key|important|significant|crucial|notably|first|introduce|launch|approve|announce|passed|passed|accord|agreement)\b/i)) {
        keyPoints.push(line.trim());
      }
    }
  }
  
  return keyPoints.slice(0, 8);
}

// Function to extract important topics from article text
function extractImportantTopics(text?: string | null): string[] {
  if (!text) return [];
  
  const topics: string[] = [];
  const sortedTerms = Object.keys(DEFINED_TERMS).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const regex = new RegExp(`\\b${term}s?\\b`, 'gi');
    if (regex.test(text)) {
      topics.push(term.charAt(0).toUpperCase() + term.slice(1));
      if (topics.length >= 8) break;
    }
  }
  
  return topics;
}

// Component to render content with highlighted terms and interactive tooltips
function HighlightedContent({ text }: { text: string }) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  
  // Sort terms by length (longest first) to match longer terms first
  const sortedTerms = Object.keys(DEFINED_TERMS).sort((a, b) => b.length - a.length);
  
  // Create regex pattern for all terms
  const pattern = sortedTerms
    .map(term => `\\b${term}s?\\b`)
    .join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  // Split text and create elements
  const parts = text.split(regex);
  
  return (
    <div>
      {parts.map((part, idx) => {
        if (!part) return null;
        
        const lowerPart = part.toLowerCase();
        const matchedTerm = sortedTerms.find(term => 
          lowerPart === term || lowerPart === term + 's'
        );
        
        if (matchedTerm && DEFINED_TERMS[matchedTerm]) {
          const tooltipId = `tooltip-${idx}`;
          const isOpen = openTooltip === tooltipId;
          
          return (
            <span
              key={idx}
              className="relative inline-block"
              onMouseEnter={() => setOpenTooltip(tooltipId)}
              onMouseLeave={() => setOpenTooltip(null)}
            >
              <button
                className="relative inline bg-yellow-300 text-gray-900 font-semibold px-2 py-1 rounded hover:bg-yellow-400 transition cursor-help border-b-2 border-yellow-500"
                onClick={() => setOpenTooltip(isOpen ? null : tooltipId)}
                title="Click or hover for explanation"
              >
                {part}
              </button>
              
              {/* Tooltip */}
              {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-72 bg-gray-900 text-white text-sm p-4 rounded-lg shadow-2xl border border-yellow-400">
                  <div className="font-bold text-yellow-300 mb-2 text-base">{part}</div>
                  <div className="text-gray-100 leading-relaxed text-xs">
                    {DEFINED_TERMS[matchedTerm]}
                  </div>
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              )}
            </span>
          );
        }
        
        return <span key={idx}>{part}</span>;
      })}
    </div>
  );
}

interface Article {
  id?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  source?: string;
  channel?: string;
  author?: string | null;
  image?: string | null;
}

interface CurrentAffairsViewerProps {
  todayPost: any;
  articles: Article[];
  articlesByChannel: Record<string, Article[]>;
}

// Channel configuration with all 9 sources
const CHANNEL_CONFIG_FULL = {
  "The Hindu": { color: "blue", icon: "📰", displayName: "The Hindu" },
  "Indian Express": { color: "blue", icon: "📰", displayName: "Indian Express" },
  "Times of India": { color: "blue", icon: "📰", displayName: "Times of India" },
  "PIB": { color: "purple", icon: "🏛️", displayName: "PIB - Government" },
  "Economy Times": { color: "green", icon: "📊", displayName: "Economy Times" },
  "UPSC/Admin": { color: "rose", icon: "🎓", displayName: "UPSC/Admin" },
  "Current Affairs": { color: "orange", icon: "📋", displayName: "Current Affairs" },
  "The Guardian": { color: "amber", icon: "🌍", displayName: "The Guardian" },
  "Inshorts": { color: "yellow", icon: "⚡", displayName: "Inshorts" },
  "NewsData": { color: "teal", icon: "📡", displayName: "NewsData" },
};

const colorMapFull = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    header: "bg-blue-100 text-blue-900",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    buttonActive: "bg-blue-600 text-white",
    badge: "bg-blue-100 text-blue-800"
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    header: "bg-purple-100 text-purple-900",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
    buttonActive: "bg-purple-600 text-white",
    badge: "bg-purple-100 text-purple-800"
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    header: "bg-green-100 text-green-900",
    button: "bg-green-600 hover:bg-green-700 text-white",
    buttonActive: "bg-green-600 text-white",
    badge: "bg-green-100 text-green-800"
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    header: "bg-amber-100 text-amber-900",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
    buttonActive: "bg-amber-600 text-white",
    badge: "bg-amber-100 text-amber-800"
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    header: "bg-rose-100 text-rose-900",
    button: "bg-rose-600 hover:bg-rose-700 text-white",
    buttonActive: "bg-rose-600 text-white",
    badge: "bg-rose-100 text-rose-800"
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    header: "bg-teal-100 text-teal-900",
    button: "bg-teal-600 hover:bg-teal-700 text-white",
    buttonActive: "bg-teal-600 text-white",
    badge: "bg-teal-100 text-teal-800"
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    header: "bg-orange-100 text-orange-900",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
    buttonActive: "bg-orange-600 text-white",
    badge: "bg-orange-100 text-orange-800"
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    header: "bg-yellow-100 text-yellow-900",
    button: "bg-yellow-600 hover:bg-yellow-700 text-white",
    buttonActive: "bg-yellow-600 text-white",
    badge: "bg-yellow-100 text-yellow-800"
  },
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    header: "bg-gray-100 text-gray-900",
    button: "bg-gray-600 hover:bg-gray-700 text-white",
    buttonActive: "bg-gray-600 text-white",
    badge: "bg-gray-100 text-gray-800"
  }
};

export default function CurrentAffairsViewer({
  todayPost,
  articles,
  articlesByChannel,
}: CurrentAffairsViewerProps) {
  const channelOrder = ["The Hindu", "Indian Express", "Times of India", "PIB", "Economy Times", "UPSC/Admin", "Current Affairs", "The Guardian", "Inshorts", "NewsData"];
  const sortedChannels = Object.keys(articlesByChannel).sort((a, b) => {
    const indexA = channelOrder.indexOf(a);
    const indexB = channelOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const [selectedChannel, setSelectedChannel] = useState<string>(sortedChannels[0] || "");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showResources, setShowResources] = useState<boolean>(false);

  const selectedChannelArticles = articlesByChannel[selectedChannel] || [];

  const config = CHANNEL_CONFIG_FULL[selectedChannel as keyof typeof CHANNEL_CONFIG_FULL];
  const colorKey = (config?.color || "gray") as keyof typeof colorMapFull;
  const colors = colorMapFull[colorKey];

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      {/* Header with Resources Button */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900">{todayPost.title}</h2>
              <p className="text-sm text-blue-700 mt-1">
                📰 {articles.length} news items from {sortedChannels.length} resources • Last updated: {new Date(todayPost.lastFetched || todayPost.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
          
          {/* Resources Button */}
          <button
            onClick={() => setShowResources(!showResources)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <span className="text-xl">📚</span>
            <span>Resources</span>
            <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full font-bold">{sortedChannels.length}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[600px]">
          {/* Resources Sidebar */}
          <div className={`transition-all duration-300 overflow-hidden ${showResources ? 'col-span-1 lg:col-span-2' : 'hidden lg:hidden'}`}>
            <div className="bg-white border-2 border-indigo-200 rounded-lg h-full overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span>📚</span>
                  All Resources
                </h3>
              </div>
              
              <div className="p-3 space-y-2">
                {sortedChannels.map((channel) => {
                  const chConfig = CHANNEL_CONFIG_FULL[channel as keyof typeof CHANNEL_CONFIG_FULL];
                  const chColorKey = (chConfig?.color || "gray") as keyof typeof colorMapFull;
                  const chColors = colorMapFull[chColorKey];
                  const isSelected = selectedChannel === channel;
                  const articleCount = articlesByChannel[channel].length;

                  return (
                    <button
                      key={channel}
                      onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedArticle(null);
                        if (window.innerWidth < 1024) setShowResources(false);
                      }}
                      className={`w-full p-3 rounded-lg transition text-left border-2 ${
                        isSelected
                          ? `${chColors.buttonActive} border-opacity-100`
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{chConfig?.icon}</span>
                          <div>
                            <div className="font-semibold text-sm text-gray-900">{channel}</div>
                            <div className={`text-xs ${isSelected ? 'text-opacity-70' : 'text-gray-500'}`}>
                              {articleCount} article{articleCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${chColors.badge} flex-shrink-0`}>
                          {articleCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className={`transition-all duration-300 ${showResources ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-5'}`}>
            <div className="bg-white border-2 border-gray-200 rounded-lg h-full flex flex-col">
              {/* Channel Header */}
              {selectedChannel && (
                <div>
                  <div className={`${colors.header} p-5 rounded-t-lg`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{config?.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold">{config?.displayName}</h2>
                        <p className="text-sm opacity-85">{selectedChannelArticles.length} headlines available</p>
                      </div>
                    </div>
                  </div>

                  {/* Articles Scrollable List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {selectedChannelArticles.map((article, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => handleArticleClick(article)}
                          className="w-full p-3 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg transition hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 hover:shadow-md text-left group"
                        >
                          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 text-sm leading-snug">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>
                              {config?.displayName}
                            </span>
                            {article.publishedAt && (
                              <span className="text-xs text-gray-500">
                                {new Date(article.publishedAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Highlights Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header - Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{config?.icon}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-white bg-opacity-20 border border-white border-opacity-40 font-semibold backdrop-blur-sm">
                      {selectedArticle.channel || selectedChannel}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">{selectedArticle.title}</h2>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition ml-4 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-white to-gray-50">
              {/* Source Information */}
              <div className="bg-white border-l-4 border-indigo-500 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📰</span> Source Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700 block">Publication</span>
                    <span className="text-gray-600">{selectedArticle.source || selectedArticle.channel || "Unknown"}</span>
                  </div>
                  {selectedArticle.author && (
                    <div>
                      <span className="font-semibold text-gray-700 block">Author</span>
                      <span className="text-gray-600">{selectedArticle.author}</span>
                    </div>
                  )}
                  {selectedArticle.publishedAt && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700 block">Published</span>
                      <span className="text-gray-600">{new Date(selectedArticle.publishedAt).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {selectedArticle.description && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                    <span>📌</span> Key Summary
                  </h3>
                  <p className="text-blue-900 leading-relaxed font-medium text-sm">
                    {selectedArticle.description}
                  </p>
                </div>
              )}

              {/* Key Highlights */}
              {extractKeyPoints(selectedArticle.content || selectedArticle.description).length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 text-lg">
                    <span>✨</span> Key Highlights
                  </h3>
                  <ul className="space-y-3">
                    {extractKeyPoints(selectedArticle.content || selectedArticle.description).map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-emerald-900 items-start">
                        <span className="flex-shrink-0 text-emerald-600 font-bold text-lg leading-none mt-1">●</span>
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Concepts */}
              {extractImportantTopics(selectedArticle.content || selectedArticle.description).length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2 text-lg">
                    <span>🎯</span> Important Concepts to Know
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {extractImportantTopics(selectedArticle.content || selectedArticle.description).map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold hover:shadow-md transition cursor-help border-2 border-amber-400 hover:from-amber-300 hover:to-yellow-300"
                        title={DEFINED_TERMS[topic.toLowerCase()] || "Important concept in this article"}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Content */}
              {selectedArticle.content && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-lg">
                    <span>📋</span> Detailed Information
                  </h3>
                  <ul className="space-y-3">
                    {formatAsBulletPoints(selectedArticle.content).map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-purple-900 items-start">
                        <span className="flex-shrink-0 text-purple-600 font-bold text-lg leading-none mt-1">→</span>
                        <span className="text-sm leading-relaxed">
                          <HighlightedContent text={point} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Image */}
              {selectedArticle.image && (
                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 p-4 bg-gray-100 flex items-center gap-2">
                    <span>🖼️</span> Featured Image
                  </h3>
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full max-h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 border-t border-gray-300 p-4 flex gap-3 flex-shrink-0">
              {selectedArticle.url && (
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center shadow-md hover:shadow-lg"
                >
                  Read Full Article on Source →
                </a>
              )}
              <button
                onClick={handleCloseDetail}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
