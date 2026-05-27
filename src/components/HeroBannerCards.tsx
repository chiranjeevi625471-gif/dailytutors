import Link from "next/link";
import { Newspaper, FileText, PenLine, Brain, Trophy, ArrowRight } from "lucide-react";

const CARDS = [
  { icon: Newspaper, label: "Current Affairs", href: "/current-affairs" },
  { icon: FileText, label: "Today's Articles", href: "/current-affairs" },
  { icon: PenLine, label: "Mains Writing", href: "/mains/answer-writing" },
  { icon: Brain, label: "CA Quiz", href: "/prelims/daily-quiz" },
  { icon: Trophy, label: "OGP 2027", href: "/courses/upsc-foundation-2027" }
];

export default function HeroBannerCards() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 mt-0">
      <div className="container-page px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-5 sm:py-7 md:py-8 overflow-x-auto">
          {CARDS.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0"
            >
              <Icon className="h-5 w-5 sm:h-4 sm:w-4 flex-none opacity-60" />
              <span className="hidden sm:inline text-sm font-medium">{label}</span>
            </Link>
          ))}
          
          <Link
            href="/courses"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Explore Courses</span>
            <span className="sm:hidden">Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
