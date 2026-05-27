import Link from "next/link";
import { Clock, ArrowRight, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card overflow-hidden group">
      <div className="relative h-44 bg-gradient-to-br from-brand-50 to-brand-100">
        <div className="absolute left-3 top-3 badge bg-white">{post.category}</div>
        <div className="absolute inset-0 flex items-center justify-center text-brand-300 text-7xl font-black select-none">
          DT
        </div>
      </div>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 group-hover:text-brand">
          <Link href={`/current-affairs/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600 flex-grow">{post.excerpt}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/current-affairs/${post.slug}`} className="link-arrow flex-1">
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
          <a 
            href="https://www.thehindu.com/news/national/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-outline !px-3 inline-flex items-center gap-1 whitespace-nowrap"
            title="Visit The Hindu Current Affairs"
          >
            The Hindu <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
