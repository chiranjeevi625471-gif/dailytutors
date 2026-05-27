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

const CHANNEL_CONFIG = {
  "The Hindu": { color: "blue", icon: "📰", displayName: "The Hindu" },
  "PIB": { color: "purple", icon: "🏛️", displayName: "PIB - Government" },
  "Economy Times": { color: "green", icon: "📊", displayName: "Economy Times" },
  "The Guardian": { color: "amber", icon: "🌍", displayName: "The Guardian" },
  "UPSC/Admin": { color: "rose", icon: "🎓", displayName: "UPSC/Admin" },
  "NewsData": { color: "teal", icon: "📡", displayName: "NewsData" },
};

const colorMap = {
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
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    header: "bg-gray-100 text-gray-900",
    button: "bg-gray-600 hover:bg-gray-700 text-white",
    buttonActive: "bg-gray-600 text-white",
    badge: "bg-gray-100 text-gray-800"
  }
};

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

export default function CurrentAffairsViewer({
  todayPost,
  articles,
  articlesByChannel,
}: CurrentAffairsViewerProps) {
  const channelOrder = ["The Hindu", "PIB", "Economy Times", "The Guardian", "UPSC/Admin", "NewsData"];
  const sortedChannels = Object.keys(articlesByChannel).sort((a, b) => {
    const indexA = channelOrder.indexOf(a);
    const indexB = channelOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const [selectedChannel, setSelectedChannel] = useState<string>(sortedChannels[0] || "");

  const selectedChannelArticles = articlesByChannel[selectedChannel] || [];

  const config = CHANNEL_CONFIG[selectedChannel as keyof typeof CHANNEL_CONFIG];
  const colorKey = (config?.color || "gray") as keyof typeof colorMap;
  const colors = colorMap[colorKey];

  return (
    <>
      {/* Header Stats */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900">{todayPost.title}</h2>
        <p className="text-sm text-blue-700 mt-1">
          📰 {articles.length} news items from {sortedChannels.length} channels • Last updated: {new Date(todayPost.lastFetched || todayPost.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>

      {/* Channel Tabs */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {sortedChannels.map((channel) => {
            const chConfig = CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG];
            const chColorKey = (chConfig?.color || "gray") as keyof typeof colorMap;
            const chColors = colorMap[chColorKey];
            const isSelected = selectedChannel === channel;

            return (
              <button
                key={channel}
                onClick={() => {
                  setSelectedChannel(channel);
                  setSelectedArticleId(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  isSelected
                    ? chColors.buttonActive
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <span>{chConfig?.icon}</span>
                <span>{channel}</span>
                <span className="text-xs ml-1 bg-white bg-opacity-30 px-2 py-0.5 rounded">
                  {articlesByChannel[channel].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Channel Section */}
        {selectedChannel && (
          <div className={`border rounded-lg p-6 ${colors.bg} ${colors.border}`}>
            <div className={`${colors.header} p-4 rounded-lg mb-6`}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>{config?.icon}</span>
                <span>{config?.displayName}</span>
              </h2>
              <p className="text-sm mt-2 opacity-85">
                {selectedChannelArticles.length} articles available
              </p>
            </div>

            <div className="space-y-3">
              {selectedChannelArticles.map((article, idx) => {
                const articleId = article.id || `${selectedChannel}-${idx}`;
                return (
                  <Link
                    key={idx}
                    href={`/current-affairs/article/${articleId}`}
                    className="w-full block p-4 bg-white border-2 border-gray-200 rounded-lg transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${colors.badge}`}>
                        {selectedChannel}
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
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
