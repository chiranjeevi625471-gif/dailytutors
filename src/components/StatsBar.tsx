"use client";

import { useEffect, useRef, useState } from "react";
import { Video, ClipboardList, BrainCircuit, Award } from "lucide-react";

type Stat = {
  icon: React.ReactNode;
  /** Numeric value to count up to. Omit for a static text value (e.g. "Daily Live"). */
  target?: number;
  prefix?: string;
  suffix?: string;
  staticValue?: string;
  label: string;
};

const STATS: Stat[] = [
  {
    icon: <Video className="h-7 w-7 text-red-500" />,
    staticValue: "Daily Live",
    label: "Interactive classes",
  },
  {
    icon: <ClipboardList className="h-7 w-7 text-indigo-500" />,
    target: 10,
    suffix: " Million +",
    label: "Tests, sample papers & notes",
  },
  {
    icon: <BrainCircuit className="h-7 w-7 text-purple-500" />,
    target: 24,
    suffix: " x 7",
    label: "Doubt solving sessions",
  },
  {
    icon: <Award className="h-7 w-7 text-amber-500" />,
    target: 100,
    suffix: " +",
    label: "Offline centres",
  },
];

/** Counts from 0 to `target` (eased) once `run` becomes true. */
function useCountUp(target: number, run: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return val;
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
  const val = useCountUp(stat.target ?? 0, run && stat.target !== undefined);
  const display =
    stat.target !== undefined
      ? `${stat.prefix ?? ""}${val}${stat.suffix ?? ""}`
      : stat.staticValue;

  return (
    <div className="flex flex-col items-center px-4 text-center">
      <div className="mb-2">{stat.icon}</div>
      <div className="text-lg font-extrabold text-gray-900 sm:text-xl">{display}</div>
      <div className="mt-0.5 text-xs text-gray-500 sm:text-sm">{stat.label}</div>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-gray-100 bg-white">
      <div className="container-page py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-200">
          {STATS.map((s, i) => (
            <StatItem key={i} stat={s} run={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
