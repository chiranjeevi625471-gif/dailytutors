"use client";
import EntityManager from "@/components/admin/EntityManager";

const CATEGORIES = ["GS1", "GS2", "GS3", "GS4", "Editorial", "PIB", "Economy", "Polity", "Environment", "Science"];

export default function AdminPosts() {
  return (
    <EntityManager
      title="Current Affairs"
      description="Daily articles, editorials and analysis published to /current-affairs."
      entity="posts"
      defaults={{ category: "GS2", readTime: "8 min", date: new Date().toISOString().slice(0, 10) }}
      columns={[
        { key: "title", label: "Title", render: (r) => <div className="font-semibold max-w-md">{r.title}</div> },
        { key: "category", label: "Category", render: (r) => <span className="badge">{r.category}</span> },
        { key: "date", label: "Date" },
        { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
      ]}
      fields={[
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "Slug", required: true, placeholder: "url-safe-identifier", hint: "Used in /current-affairs/<slug>" },
        { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "readTime", label: "Read time", placeholder: "8 min" },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Publish" }
      ]}
    />
  );
}
