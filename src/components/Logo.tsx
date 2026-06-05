import NextImage from "next/image";
import Link from "next/link";

/**
 * Site logo. Renders /public/logo.png (the Daily Tutors brand mark).
 * Control the rendered size with `className` (set a height, e.g. "h-10 w-auto").
 * Pass href={null} to render the image without a link.
 */
export default function Logo({
  href = "/",
  className = "h-10 w-auto",
  priority = false,
}: {
  href?: string | null;
  className?: string;
  priority?: boolean;
}) {
  const img = (
    <NextImage
      src="/logo.png"
      alt="Daily Tutors — Decode the UPSC exam, Daily"
      width={4441}
      height={1000}
      priority={priority}
      className={className}
    />
  );

  if (href === null) return img;
  return (
    <Link href={href} aria-label="Daily Tutors home" className="inline-flex items-center">
      {img}
    </Link>
  );
}
