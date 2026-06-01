"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV = [
  {
    label: "Current Affairs",
    href: "/current-affairs",
    children: [
      { label: "Daily Current Affairs", href: "/current-affairs" },
      { label: "Daily News Analysis", href: "/daily-news-analysis" },
      { label: "Editorial Analysis", href: "/editorial-analysis" },
      { label: "PIB Summary", href: "/pib-summary" },
      { label: "Yojana / Kurukshetra", href: "/yojana-kurukshetra" }
    ]
  },
  {
    label: "Mains",
    href: "/mains",
    children: [
      { label: "Answer Writing (Secure)", href: "/mains/answer-writing" },
      { label: "Essay Challenge", href: "/mains/essay" },
      { label: "Ethics Case Studies", href: "/mains/ethics" },
      { label: "Mind Maps", href: "/mains/mind-maps" }
    ]
  },
  {
    label: "Prelims",
    href: "/prelims",
    children: [
      { label: "Daily Quiz", href: "/prelims/daily-quiz" },
      { label: "Static Quiz", href: "/prelims/static-quiz" },
      { label: "CSAT Practice", href: "/prelims/csat" },
      { label: "Previous Year Questions", href: "/prelims/pyq" }
    ]
  },
  {
    label: "Optional",
    href: "/optional",
    children: [
      { label: "Sociology", href: "/optional/sociology" },
      { label: "History", href: "/optional/history" },
      { label: "Geography", href: "/optional/geography" },
      { label: "Public Administration", href: "/optional/pub-ad" }
    ]
  },
  { label: "Downloads", href: "/downloads" },
  { label: "Courses", href: "/courses" },
  { label: "Careers", href: "/careers" }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="bg-brand text-white text-xs">
        <div className="container-page flex h-8 items-center justify-center sm:justify-start">
          <span>Free Daily Current Affairs · Updated every morning at 8 AM IST</span>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand text-white font-bold text-xl">
            D
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">
              Daily<span className="text-brand">Tutors</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">UPSC · IAS · State PCS</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              {item.children && openMenu === item.label && (
                <div className="absolute left-0 top-full w-60 rounded-lg border border-gray-100 bg-white p-2 shadow-card">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/courses" className="hidden md:inline-flex btn-primary">Enroll Now</Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container-page py-3">
            {NAV.map((item) => (
              <details key={item.label} className="group border-b border-gray-100 py-2">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-800">
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && <ChevronDown className="h-4 w-4 group-open:rotate-180 transition" />}
                </summary>
                {item.children && (
                  <div className="mt-2 grid gap-1 pl-2">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded px-2 py-1.5 text-sm text-gray-600 hover:bg-brand-50">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </details>
            ))}
            <div className="mt-3 flex gap-2">
              <Link href="/courses" className="btn-primary flex-1">Enroll</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
