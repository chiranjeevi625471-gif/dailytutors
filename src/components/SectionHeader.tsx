import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  href,
  ctaLabel = "View all"
}: {
  title: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-gray-600">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="link-arrow whitespace-nowrap">
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
