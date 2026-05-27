import Link from "next/link";
import { notFound } from "next/navigation";
import { optionals } from "@/lib/sample-data";
import { ArrowLeft, CheckCircle, Book } from "lucide-react";

export function generateStaticParams() {
  return optionals.map((o) => ({ slug: o.slug }));
}

const syllabusContent: Record<string, any> = {
  sociology: {
    papers: [
      {
        name: "Paper-I: Foundations of Sociology",
        topics: [
          "Sociological perspectives and methods",
          "Social structure and stratification",
          "Family and kinship systems",
          "Religion and society",
          "Education and social change"
        ]
      },
      {
        name: "Paper-II: Indian Society",
        topics: [
          "Caste system in India",
          "Village and tribal communities",
          "Social movements",
          "Gender and development",
          "Urban society and urbanization"
        ]
      }
    ],
    booklist: [
      "Introduction to Sociology by Anthony Giddens",
      "Indian Society by Rajendra Singh",
      "Caste in Modern India by Surinder Jodhka",
      "The Social Life of Things by Arjun Appadurai",
      "Understanding Indian Society by Yogendra Singh"
    ]
  },
  history: {
    papers: [
      {
        name: "Paper-I: Ancient & Medieval India",
        topics: [
          "Early Vedic period",
          "Mauryan and Gupta empires",
          "Medieval sultanates",
          "Mughal empire",
          "Regional kingdoms and cultures"
        ]
      },
      {
        name: "Paper-II: Modern India & World",
        topics: [
          "British rule and policies",
          "Indian independence movement",
          "Constitutional framework",
          "Post-independence developments",
          "India in the global context"
        ]
      }
    ],
    booklist: [
      "Ancient India by RS Sharma",
      "Medieval India by Satish Chandra",
      "India Since Independence by Bipan Chandra",
      "Cambridge History of India",
      "Freedom Struggle by Ramesh Chandra"
    ]
  },
  geography: {
    papers: [
      {
        name: "Paper-I: Physical Geography",
        topics: [
          "Geomorphology and landforms",
          "Climate and weather systems",
          "Biogeography and ecosystems",
          "Soil and vegetation",
          "Marine and water resources"
        ]
      },
      {
        name: "Paper-II: Human & Economic Geography",
        topics: [
          "Population and settlement patterns",
          "Agriculture and industries",
          "Transportation and trade",
          "Cultural geography",
          "Geopolitics and development"
        ]
      }
    ],
    booklist: [
      "Physical Geography by David Waugh",
      "Human Geography by Peter Haggett",
      "Geography of India by Majid Husain",
      "Environmental Geography by Rob Saunders",
      "World Regional Geography by Lydia Mihelic Pulsipher"
    ]
  }
};

export default function SyllabusPage({ params }: { params: { slug: string } }) {
  const subject = optionals.find((o) => o.slug === params.slug);
  if (!subject) return notFound();

  const content = syllabusContent[subject.slug] || syllabusContent.sociology;

  return (
    <div className="container-page py-12">
      <Link href={`/optional/${subject.slug}`} className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className={`mt-6 rounded-2xl bg-gradient-to-br ${subject.color} p-10`}>
        <h1 className="text-4xl font-extrabold">{subject.title}</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">Syllabus & Strategy</h2>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6">Exam Structure & Papers</h3>
        <div className="grid gap-6">
          {content.papers?.map((paper: any, idx: number) => (
            <div key={idx} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Book className="h-6 w-6 text-brand" />
                <h4 className="text-xl font-bold">{paper.name}</h4>
              </div>
              <ul className="space-y-2">
                {paper.topics?.map((topic: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6">Recommended Booklist</h3>
        <div className="card p-6">
          <ul className="space-y-3">
            {content.booklist?.map((book: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{book}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Topper Strategy</h3>
        <p className="text-blue-800">
          Focus on understanding concepts deeply rather than memorizing. Create mind maps for complex topics, practice answer writing regularly, and reference standard textbooks. 
          Maintain a topical compilation from newspapers and journals throughout the year for current examples.
        </p>
      </div>
    </div>
  );
}
