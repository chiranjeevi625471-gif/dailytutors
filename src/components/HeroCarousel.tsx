"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner } from "@/lib/types";

export default function HeroCarousel({ slides }: { slides: HeroBanner[] }) {
  const SLIDES = slides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || SLIDES.length === 0) return;
    timer.current = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, SLIDES.length]);

  if (SLIDES.length === 0) return null;
  const go = (dir: number) => setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative h-[150px] xs:h-[180px] sm:h-[210px] md:h-[255px] lg:h-[300px] overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            aria-hidden={i !== active}
          >
            {s.image ? (
              <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg}`} />
            )}
            {/* dark overlay for better text readability - reduced opacity for better image visibility */}
            <div className="absolute inset-0 bg-black/20" />
            {/* decorative pattern - reduced opacity */}
            <div
              className="absolute inset-0 opacity-10 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "28px 28px"
              }}
            />
            <div className="container-page relative z-10 flex h-full items-center py-2 xs:py-3 sm:py-4">
              <div className="w-full max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl text-white">
                {s.eyebrow && (
                  <span className="inline-block rounded-full bg-white/95 px-2 py-0.5 text-xs xs:text-sm font-semibold text-red-700">
                    {s.eyebrow}
                  </span>
                )}
                {s.title && (
                  <h1 className="mt-1.5 xs:mt-2 sm:mt-3 text-sm xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow leading-snug">
                    {s.title}
                  </h1>
                )}
                {s.subtitle && (
                  <div className="mt-1 xs:mt-1.5 sm:mt-2 inline-block rounded-md border-2 border-white/80 px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-3 sm:py-1 text-[8px] xs:text-xs sm:text-sm font-bold tracking-wide">
                    {s.subtitle}
                  </div>
                )}
                {s.href && (
                  <div className="mt-2 xs:mt-2.5 sm:mt-3">
                    <Link href={s.href} className="inline-flex items-center rounded-md bg-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-[8px] xs:text-xs sm:text-sm font-extrabold uppercase tracking-wider text-red-700 shadow-lg hover:bg-red-50 transition whitespace-nowrap">
                      {s.cta || "Explore"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="group absolute left-1.5 xs:left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-red-700 shadow-lg backdrop-blur hover:bg-white"
        >
          <ChevronLeft className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 transition group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="group absolute right-1.5 xs:right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-red-700 shadow-lg backdrop-blur hover:bg-white"
        >
          <ChevronRight className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* dots */}
      <div className="flex justify-center gap-1.5 xs:gap-2 py-2.5 xs:py-3 sm:py-4 bg-gradient-to-b from-white via-brand-50/50 to-white">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 xs:h-2.5 rounded-full transition-all ${i === active ? "w-6 xs:w-8 bg-brand" : "w-2 xs:w-2.5 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </section>
  );
}
