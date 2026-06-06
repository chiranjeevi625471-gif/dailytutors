import Link from "next/link";
import { ArrowLeft, BellRing } from "lucide-react";

/** Lightweight "coming soon" placeholder used by pages still in the works. */
export default function ComingSoon({
  badge = "Coming soon",
  title,
  description,
  backHref = "/",
  backLabel = "Back to home",
  ctaHref,
  ctaLabel,
}: {
  badge?: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="container-page py-12">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <div className="mt-6 max-w-3xl">
        <span className="badge">{badge}</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-4 text-lg text-gray-600">{description}</p>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
          <BellRing className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold">We&apos;re building this section</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          This page is on its way. In the meantime, explore the rest of Daily Tutors.
        </p>
        <Link href={ctaHref ?? "/courses"} className="btn-primary mt-6 inline-flex">
          {ctaLabel ?? "Explore courses"}
        </Link>
      </div>
    </div>
  );
}
