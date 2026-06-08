import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Send, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold">Daily<span className="text-brand">Tutors</span></span>
          </Link>
          <p className="mt-3 text-sm text-gray-600">
            India&rsquo;s trusted destination for UPSC Civil Services preparation — current affairs, mains practice, prelims quizzes, and structured courses.
          </p>
          <div className="mt-4 flex gap-3 text-gray-500">
            <a href="#" aria-label="Facebook" className="hover:text-brand"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-brand"><Twitter className="h-5 w-5" /></a>
            <a href="https://www.instagram.com/dailytutors_official" aria-label="Instagram" className="hover:text-brand"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-brand"><Youtube className="h-5 w-5" /></a>
            <a href="#" aria-label="Telegram" className="hover:text-brand"><Send className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900">Prepare</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/current-affairs" className="hover:text-brand">Current Affairs</Link></li>
            <li><Link href="/mains/answer-writing" className="hover:text-brand">Answer Writing</Link></li>
            <li><Link href="/prelims/daily-quiz" className="hover:text-brand">Daily Quiz</Link></li>
            <li><Link href="/mains/essay" className="hover:text-brand">Essay Challenge</Link></li>
            <li><Link href="/mains/mind-maps" className="hover:text-brand">Mind Maps</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900">Resources</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/downloads" className="hover:text-brand">PDF Downloads</Link></li>
            <li><Link href="/optional" className="hover:text-brand">Optional Subjects</Link></li>
            <li><Link href="/courses" className="hover:text-brand">Courses</Link></li>
            <li><Link href="/prelims/pyq" className="hover:text-brand">Previous Year Questions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-900">Get Daily Updates</h4>
          <p className="mt-3 text-sm text-gray-600">Subscribe to receive current affairs and answer writing prompts daily.</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button type="submit" className="btn-primary">Join</button>
          </form>
          <p className="mt-2 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container-page flex flex-col md:flex-row items-center justify-between py-5 text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} DailyTutors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-brand">About</Link>
            <Link href="/contact" className="hover:text-brand">Contact</Link>
            <Link href="/privacy" className="hover:text-brand">Privacy</Link>
            <Link href="/terms" className="hover:text-brand">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
