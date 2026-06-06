import Link from "next/link";
import { Home, BookOpen, Newspaper, GraduationCap } from "lucide-react";

export const metadata = { title: "Page not found" };

const SUGGESTIONS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/current-affairs", label: "Current Affairs", icon: Newspaper },
  { href: "/exams", label: "Exams", icon: GraduationCap },
  { href: "/courses", label: "Courses", icon: BookOpen },
];

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-7xl sm:text-8xl font-extrabold tracking-tight text-brand">404</p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of these instead:
      </p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-gray-100 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-lg"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-brand">{label}</div>
          </Link>
        ))}
      </div>

      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
