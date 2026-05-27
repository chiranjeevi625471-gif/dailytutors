import Link from "next/link";
import { notFound } from "next/navigation";
import { optionals } from "@/lib/sample-data";
import { ArrowLeft, BarChart3, Calendar, CheckCircle } from "lucide-react";

export function generateStaticParams() {
  return optionals.map((o) => ({ slug: o.slug }));
}

const answerWritingContent: Record<string, any> = {
  sociology: [
    { date: "May 9", question: "Define social structure and explain its role in shaping individual behaviour.", difficulty: "Medium", attempts: 2 },
    { date: "May 8", question: "Critically examine the caste system's impact on Indian social hierarchy.", difficulty: "Hard", attempts: 5 },
    { date: "May 7", question: "Discuss the changing role of family in modern Indian society.", difficulty: "Medium", attempts: 3 },
    { date: "May 6", question: "How does religion influence social norms? Provide examples from Indian context.", difficulty: "Easy", attempts: 1 }
  ],
  history: [
    { date: "May 9", question: "Analyze the administrative structure of the Mughal Empire.", difficulty: "Hard", attempts: 4 },
    { date: "May 8", question: "What were the main factors leading to the decline of the Mughal Empire?", difficulty: "Medium", attempts: 3 },
    { date: "May 7", question: "Discuss the role of regional kingdoms in Indian history (800-1500 CE).", difficulty: "Hard", attempts: 3 },
    { date: "May 6", question: "Explain the major policies of British rule in India.", difficulty: "Medium", attempts: 2 }
  ],
  geography: [
    { date: "May 9", question: "How does the monsoon system influence agriculture in India?", difficulty: "Medium", attempts: 2 },
    { date: "May 8", question: "Analyze the distribution and significance of mineral resources in India.", difficulty: "Hard", attempts: 4 },
    { date: "May 7", question: "Discuss the impact of industrialization on India's economic geography.", difficulty: "Medium", attempts: 3 },
    { date: "May 6", question: "Explain the geomorphological features of the Himalayas.", difficulty: "Hard", attempts: 5 }
  ]
};

export default function AnswerWritingPage({ params }: { params: { slug: string } }) {
  const subject = optionals.find((o) => o.slug === params.slug);
  if (!subject) return notFound();

  const content = answerWritingContent[subject.slug] || answerWritingContent.sociology;

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-amber-100 text-amber-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container-page py-12">
      <Link href={`/optional/${subject.slug}`} className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className={`mt-6 rounded-2xl bg-gradient-to-br ${subject.color} p-10`}>
        <h1 className="text-4xl font-extrabold">{subject.title}</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">Answer Writing Practice</h2>
      </div>

      <div className="mt-10">
        <p className="text-gray-600 mb-8">
          Daily structured questions to develop strong answer-writing skills. Practice consistently to improve clarity, organization, and conceptual depth.
        </p>

        <div className="grid gap-5">
          {content?.map((item: any, idx: number) => (
            <div key={idx} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">{item.date}, 2026</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-3">{item.question}</h3>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>{item.attempts} sample answers</span>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-red-700 transition">
                  Attempt Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Framework for Success
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Start with a clear introduction defining the key concepts</li>
            <li>• Organize your answer with logical subheadings</li>
            <li>• Support arguments with examples and evidence</li>
            <li>• Maintain academic tone and proper terminology</li>
            <li>• Write a concluding statement summarizing the answer</li>
          </ul>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Evaluation Criteria
          </h3>
          <ul className="space-y-2 text-purple-800 text-sm">
            <li>• Content Depth: Comprehensive understanding of topic</li>
            <li>• Structure: Clear organization with logical flow</li>
            <li>• Examples: Relevant and contemporary illustrations</li>
            <li>• Language: Clear, concise, and academically appropriate</li>
            <li>• Conclusion: Strong summary and closing argument</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
