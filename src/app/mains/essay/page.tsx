import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export const metadata = {
  title: "Essay Challenge — Mains Answer Writing | DailyTutors",
  description: "Daily essay writing practice with expert evaluation for UPSC Mains. Improve your essay writing skills with structured frameworks.",
};

export default function EssayPage() {
  return (
    <div className="container-page py-12 max-w-4xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="mt-6">
        <h1 className="text-4xl font-extrabold">Essay Challenge</h1>
        <p className="mt-3 text-lg text-gray-600">
          Weekly essay prompts with expert feedback. Practice diverse essay types with structured frameworks.
        </p>
      </div>

      <div className="mt-12 grid gap-6">
        <div className="rounded-lg border border-gray-200 p-6 hover:border-brand hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand">
                Weekly
              </span>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Society &amp; Culture: The Rise of Digital Activism
              </h3>
              <p className="mt-3 text-gray-600">
                Digital platforms have democratized activism. Discuss how this impacts social movements, accountability, and democratic participation in India.
              </p>
            </div>
            <div className="ml-4 flex items-center gap-1 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              45 mins
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary text-sm">Attempt Essay</button>
            <button className="btn-outline text-sm">View Rubric</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 hover:border-brand hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Closed
              </span>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Economy: Re-imagining India's Growth Model
              </h3>
              <p className="mt-3 text-gray-600">
                GDP growth alone is insufficient. Discuss what metrics India should prioritize for inclusive and sustainable development.
              </p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm text-gray-500">Ended 2 days ago</p>
              <p className="mt-2 text-sm font-medium text-gray-900">34 submissions</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-outline text-sm">View Submissions</button>
            <button className="btn-outline text-sm">View Sample Essays</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 hover:border-brand hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Closed
              </span>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Governance: Decentralization and Panchayati Raj
              </h3>
              <p className="mt-3 text-gray-600">
                Despite three decades of constitutional empowerment, panchayats struggle with fiscal autonomy. Analyze and suggest reforms.
              </p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm text-gray-500">Ended 1 week ago</p>
              <p className="mt-2 text-sm font-medium text-gray-900">28 submissions</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-outline text-sm">View Submissions</button>
            <button className="btn-outline text-sm">View Sample Essays</button>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-lg bg-blue-50 p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900">About This Challenge</h2>
        <p className="mt-3 text-gray-600">
          Our Essay Challenge provides structured practice for UPSC Mains Paper IV and GS papers. Each week, we release a new prompt on contemporary themes — society, governance, economy, and more.
        </p>
        <p className="mt-3 text-gray-600">
          Submit your essay for evaluation by experienced faculty. Receive detailed feedback on structure, content, and articulation. Compare your work against sample essays from toppers.
        </p>
        <Link href="/mains/answer-writing" className="btn-primary mt-4 inline-block">
          Join Answer Writing Programme
        </Link>
      </div>
    </div>
  );
}
