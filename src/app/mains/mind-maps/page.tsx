import Link from "next/link";
import { ArrowLeft, MapPin, BookOpen, Zap, Download, Eye, Search, Filter } from "lucide-react";

export const metadata = {
  title: "Mind Maps & Notes — Visual Revision for Static Subjects | DailyTutors",
  description: "Comprehensive mind maps and visual notes for UPSC static subjects including Polity, Geography, History, and Economics.",
};

export default function MindMapsPage() {
  const mindMaps = [
    {
      id: "polity",
      title: "Indian Polity",
      icon: "📋",
      description: "Constitution, Parliamentary system, Fundamental Rights, Directive Principles, Amendment procedures.",
      concepts: 280,
      maps: 42,
      topics: [
        "Constitution Overview & Structure",
        "Fundamental Rights & Duties",
        "Directive Principles of State Policy",
        "Parliamentary System",
        "State Structure & Federalism",
        "Local Government & Panchayati Raj",
        "Amendment Procedures",
        "Judicial System & SC/HC"
      ],
      features: [
        "42 detailed mind maps",
        "Interactive flowcharts for complex concepts",
        "Amendment procedure visualizations",
        "Parliamentary process diagrams"
      ],
      downloads: ["PDF (High-Res)", "Images (ZIP)", "Notes (DOCX)"]
    },
    {
      id: "geography",
      title: "Geography of India",
      icon: "🗺️",
      description: "Physical geography, Climate zones, Soils, Natural resources, Regional geography, and Map-based topics.",
      concepts: 250,
      maps: 35,
      topics: [
        "Physical Features & Landforms",
        "Climate & Monsoon System",
        "Soil Types & Distribution",
        "Rivers & Water Resources",
        "Forests & Biodiversity",
        "Natural Resources",
        "Regional Geography",
        "Disaster Management"
      ],
      features: [
        "35 thematic maps with detailed annotations",
        "Climate classification charts",
        "Soil distribution diagrams",
        "Printable map outlines for practice"
      ],
      downloads: ["PDF with Maps", "Map Outlines (Blank)", "Notes + Diagrams"]
    },
    {
      id: "history",
      title: "Indian History",
      icon: "📚",
      description: "Ancient, Medieval, Modern history. Independence movement, Constitutional history, and key personalities.",
      concepts: 320,
      maps: 50,
      topics: [
        "Ancient India (Vedic to Maurya)",
        "Medieval India & Sultanates",
        "Mughal Empire",
        "Early European Contact",
        "Independence Movement",
        "Constitutional History",
        "Post-Independence India",
        "Important Personalities & Events"
      ],
      features: [
        "Timeline-based visual organization",
        "Dynasty trees and succession charts",
        "Independence struggle key events",
        "Personality profiles with connections"
      ],
      downloads: ["PDF Timeline", "Dynasty Charts", "Notes & Summaries"]
    },
    {
      id: "economics",
      title: "Economics & Statistics",
      icon: "💰",
      description: "Indian economy, GDP, Inflation, Budget, Monetary policy, Trade, and Development indicators.",
      concepts: 200,
      maps: 28,
      topics: [
        "Economic Structure & Sectors",
        "GDP & National Income",
        "Inflation & Price Stability",
        "Budget & Fiscal Policy",
        "Monetary Policy & RBI",
        "Banking System",
        "Trade & Tariffs",
        "Development Indicators"
      ],
      features: [
        "28 concept maps and diagrams",
        "Economic indicators visual comparisons",
        "Policy flowcharts and impacts",
        "Historical economic trends"
      ],
      downloads: ["PDF with Charts", "Data Visualizations", "Economic Notes"]
    }
  ];

  const stats = {
    totalConcepts: 1050,
    totalMaps: 155,
    subjects: 4,
    topics: 32
  };

  return (
    <div className="container-page py-12">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Hero Section */}
      <div className="mt-8 mb-12">
        <h1 className="text-4xl font-extrabold">Mind Maps & Notes</h1>
        <p className="mt-3 text-lg text-gray-600">
          Comprehensive visual revision for static subjects — Polity, Geography, History & Economics. Download, study, and connect concepts.
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-brand">{stats.totalConcepts}+</div>
            <div className="text-sm text-gray-600 mt-1">Concepts Covered</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-brand">{stats.totalMaps}</div>
            <div className="text-sm text-gray-600 mt-1">Mind Maps</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-brand">{stats.subjects}</div>
            <div className="text-sm text-gray-600 mt-1">Subjects</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-brand">{stats.topics}</div>
            <div className="text-sm text-gray-600 mt-1">Topics</div>
          </div>
        </div>
      </div>

      {/* Mind Maps Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {mindMaps.map((subject) => (
          <div key={subject.id} className="card overflow-hidden hover:shadow-lg transition-all">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-brand to-brand/80 p-6 text-white">
              <div className="text-4xl mb-2">{subject.icon}</div>
              <h2 className="text-2xl font-bold">{subject.title}</h2>
              <p className="text-sm text-white/90 mt-2">{subject.description}</p>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Quick Stats */}
              <div className="flex gap-4 text-sm border-b pb-4">
                <div>
                  <div className="font-semibold text-brand">{subject.concepts}</div>
                  <div className="text-gray-600">Concepts</div>
                </div>
                <div>
                  <div className="font-semibold text-brand">{subject.maps}</div>
                  <div className="text-gray-600">Mind Maps</div>
                </div>
                <div>
                  <div className="font-semibold text-brand">{subject.topics.length}</div>
                  <div className="text-gray-600">Topics</div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Topics Covered:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {subject.topics.map((topic, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2 text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0 mt-1.5"></span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
                <ul className="space-y-1">
                  {subject.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="text-brand">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Downloads */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Available Downloads:</h3>
                <div className="flex flex-wrap gap-2">
                  {subject.downloads.map((format, idx) => (
                    <button
                      key={idx}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" /> View Online
                </button>
                <button className="btn-outline flex-1 text-sm flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Use Section */}
      <div className="mt-12 card p-6 bg-blue-50 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 How to Use Mind Maps</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold text-blue-900 mb-2">1. Learn Concepts</div>
            <p className="text-gray-700">Start with the main topic and progressively understand connected concepts through visual flows.</p>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-2">2. Make Connections</div>
            <p className="text-gray-700">See how different topics relate to each other, helping you understand the bigger picture.</p>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-2">3. Quick Revision</div>
            <p className="text-gray-700">Use mind maps for rapid revision before exams by scanning key concepts and their relationships.</p>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/optional" className="card p-4 hover:shadow-md transition">
            <div className="text-2xl mb-2">📖</div>
            <h3 className="font-semibold">Optional Subjects</h3>
            <p className="text-sm text-gray-600 mt-1">Detailed notes and study materials for optional papers</p>
          </Link>
          <Link href="/prelims/daily-quiz" className="card p-4 hover:shadow-md transition">
            <div className="text-2xl mb-2">❓</div>
            <h3 className="font-semibold">Daily Quizzes</h3>
            <p className="text-sm text-gray-600 mt-1">Test your knowledge with daily quizzes on static subjects</p>
          </Link>
          <Link href="/mains/answer-writing" className="card p-4 hover:shadow-md transition">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-semibold">Answer Writing</h3>
            <p className="text-sm text-gray-600 mt-1">Learn how to structure and write quality answers</p>
          </Link>
        </div>
      </div>

      {/* Download Center */}
      <div className="mt-12 card p-6 border-2 border-brand">
        <h2 className="text-xl font-bold mb-4">📥 Download All Mind Maps (Bundle)</h2>
        <p className="text-gray-600 text-sm mb-4">Get all 155+ mind maps in one comprehensive download. Perfect for offline studying.</p>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" /> Download PDF Bundle (85 MB)
          </button>
          <button className="btn-outline flex items-center gap-2">
            <Download className="h-4 w-4" /> Download Images (95 MB)
          </button>
        </div>
      </div>

      {/* Study Tips */}
      <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <h2 className="text-xl font-bold mb-4">🎯 Study Tips for Using Mind Maps</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ <strong>Active Recall:</strong> First try to recall the mind map from memory, then check accuracy</li>
          <li>✓ <strong>Make Your Own:</strong> Create personalized mind maps after learning from these templates</li>
          <li>✓ <strong>Link Concepts:</strong> Try to connect topics from different subjects (e.g., History + Geography)</li>
          <li>✓ <strong>Timed Revision:</strong> Use mind maps for 5-10 minute quick revision sessions</li>
          <li>✓ <strong>Practice Questions:</strong> After studying a topic's mind map, test yourself with related quizzes</li>
        </ul>
      </div>
    </div>
  );
}
