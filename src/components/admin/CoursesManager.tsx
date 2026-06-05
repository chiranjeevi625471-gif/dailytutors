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

export default function CoursesManager() {
  return (
    <EntityManager
      title="Courses"
      description="Paid and free courses stored in MongoDB. Set 'Published' to make a course live on the site."
      entity="courses"
      defaults={{ level: "Intermediate", price: 0, isPublished: false }}
      columns={[
        { key: "title", label: "Title", render: (r) => <div className="font-semibold max-w-xs">{r.title}</div> },
        { key: "category", label: "Category", render: (r) => <span className="badge">{r.category}</span> },
        { key: "level", label: "Level" },
        { key: "price", label: "Price", render: (r) => <span>₹{Number(r.price || 0).toLocaleString("en-IN")}</span> },
        { key: "students", label: "Students", render: (r) => r.students ?? 0 },
        {
          key: "isPublished",
          label: "Status",
          render: (r) =>
            r.isPublished ? (
              <span className="badge">Published</span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Draft</span>
            ),
        },
      ]}
      fields={[
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "Slug", required: true, hint: "url-safe-identifier, e.g. upsc-gs-mains" },
        { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
        { name: "level", label: "Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
        { name: "shortDescription", label: "Short description", full: true },
        { name: "description", label: "Description", type: "textarea", required: true, full: true },
        { name: "price", label: "Price (₹)", type: "number", required: true },
        { name: "originalPrice", label: "Original Price (₹)", type: "number" },
        { name: "duration", label: "Duration (hours)", type: "number" },
        { name: "lessons", label: "Lessons", type: "number" },
        { name: "instructor", label: "Instructor" },
        { name: "thumbnail", label: "Thumbnail", type: "file", accept: "image/*", full: true, hint: "Optional cover image" },
        { name: "isPublished", label: "Published", type: "checkbox", placeholder: "Show on site" },
        { name: "isFeatured", label: "Featured", type: "checkbox", placeholder: "Highlight as featured" },
      ]}
    />
  );
}
