"use client";
import EntityManager from "@/components/admin/EntityManager";

const CATEGORIES = [
  "Polity",
  "Economy",
  "Environment",
  "Science_Technology",
  "Geography",
  "Ethics",
  "International_Relations",
];
const STATUSES = ["draft", "pending_review", "published", "archived", "rejected"];
const GS_PAPERS = ["GS1", "GS2", "GS3", "GS4", "Essay", "Prelims"];

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  pending_review: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ArticlesManager() {
  return (
    <EntityManager
      title="Articles"
      description="News & editorial articles stored in MongoDB (the AI news pipeline writes here too). Set status to 'published' to make them live."
      entity="articles"
      defaults={{ status: "draft", source: "Admin", category: "Polity" }}
      columns={[
        { key: "title", label: "Title", render: (r) => <div className="font-semibold max-w-md">{r.title}</div> },
        { key: "category", label: "Category", render: (r) => <span className="badge">{r.category}</span> },
        {
          key: "status",
          label: "Status",
          render: (r) => (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status] || "bg-gray-100 text-gray-600"}`}>
              {String(r.status || "draft").replace("_", " ")}
            </span>
          ),
        },
        { key: "views", label: "Views", render: (r) => r.views ?? 0 },
        {
          key: "createdAt",
          label: "Created",
          render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"),
        },
      ]}
      fields={[
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "Slug", hint: "Auto-generated from title if left blank" },
        { name: "source", label: "Source", placeholder: "Admin / The Hindu / PIB…" },
        { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
        { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
        { name: "gsPapers", label: "GS Papers", type: "csv", placeholder: GS_PAPERS.join(", "), hint: "Comma-separated: " + GS_PAPERS.join(", ") },
        { name: "summary", label: "Summary", type: "textarea", required: true, full: true },
        { name: "content", label: "Content", type: "textarea", required: true, full: true },
        { name: "whyInNews", label: "Why in News", type: "textarea", full: true },
        { name: "prelimsPointers", label: "Prelims Pointers", type: "csv", full: true, hint: "Comma-separated factual pointers (AI-filled)" },
        { name: "mainsAnalysis", label: "Mains Analysis", type: "textarea", full: true },
        { name: "constitutionalLinks", label: "Constitutional / Static Links", type: "csv", full: true, hint: "Comma-separated" },
        { name: "wayForward", label: "Way Forward", type: "textarea", full: true },
        { name: "keywords", label: "Keywords", type: "csv", placeholder: "comma, separated, keywords" },
        { name: "metaDescription", label: "Meta description", full: true, hint: "Max 160 characters" },
        { name: "featuredImage", label: "Featured image", type: "file", accept: "image/*", full: true },
      ]}
    />
  );
}
