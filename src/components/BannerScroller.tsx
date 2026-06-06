"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Newspaper, PenLine, Brain, Download, GraduationCap, Map, Trophy, BookOpenCheck } from "lucide-react";
import type { BannerCard } from "@/lib/types";

const ICON_MAP: Record<string, typeof Newspaper> = {
  Newspaper, PenLine, Brain, Download, GraduationCap, Map, Trophy, BookOpenCheck
};

export default function BannerScroller({ cards }: { cards: BannerCard[] }) {
  const BANNERS = cards.map((c) => ({ ...c, Icon: ICON_MAP[c.icon] || Newspaper }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // auto scroll
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 320;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, [paused]);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 320;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <section
      className="relative bg-white py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page mb-5 flex items-end justify-between">
        <div>
          <h2 className="section-title">Explore Daily Tutors</h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            Eight ways to prepare smarter — swipe through, or use the arrows.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* arrows */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-700 shadow-card border border-gray-100 hover:bg-brand-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-700 shadow-card border border-gray-100 hover:bg-brand-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent hidden md:block" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent hidden md:block" />

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-12 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {BANNERS.map(({ title, tag, href, Icon, bg }) => {
            if (!href) return null;
            return (
            <Link
              key={title}
              href={href}
              className="snap-start flex-none w-[260px] sm:w-[300px] md:w-[320px] group"
            >
              <div className={`relative h-40 sm:h-44 overflow-hidden rounded-2xl bg-gradient-to-br ${bg} shadow-card transition group-hover:-translate-y-1`}>
                <div
                  className="absolute inset-0 opacity-15 mix-blend-overlay"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                    backgroundSize: "20px 20px"
                  }}
                />
                <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -right-10 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
                  <Icon className="h-8 w-8" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-white/85">{tag}</div>
                    <div className="mt-1 text-lg sm:text-xl font-extrabold leading-tight">{title}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
          })
        </div>
      </div>
    </section>
  );
}
