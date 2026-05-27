"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function AdminCourses() {
  return (
    <EntityManager
      title="Courses"
      description="Paid courses, test series, and answer-writing programmes."
      entity="courses"
      defaults={{ level: "Foundation", price: 0, features: [] }}
      columns={[
        { key: "title", label: "Title", render: (r) => <div className="font-semibold">{r.title}</div> },
        { key: "level", label: "Level", render: (r) => <span className="badge">{r.level}</span> },
        { 
          key: "price", 
          label: "Prices", 
          render: (r) => {
            const discount = r.originalPrice ? Math.round(((r.originalPrice - r.price) / r.originalPrice) * 100) : 0;
            return (
              <div className="text-sm">
                <div>₹{Number(r.price).toLocaleString("en-IN")} <span className="text-gray-500">(Sale)</span></div>
                {r.originalPrice && <div className="text-gray-500">₹{Number(r.originalPrice).toLocaleString("en-IN")} <span className="text-green-600 font-semibold">{discount}% OFF</span></div>}
              </div>
            );
          } 
        },
        { key: "duration", label: "Duration" },
        { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
      ]}
      fields={[
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "Slug", required: true },
        { name: "level", label: "Level", type: "select", options: ["Foundation", "Advanced", "Test Series"], required: true },
        { name: "duration", label: "Duration", placeholder: "24 months" },
        { name: "originalPrice", label: "Actual Price (₹) - Original", type: "number", hint: "Full price before discount" },
        { name: "price", label: "Sale Price (₹) - Discounted", type: "number", required: true, hint: "Price customers pay (leave originalPrice empty if no discount)" },
        { name: "badge", label: "Badge", placeholder: "Most Popular (optional)" },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "features", label: "Features (CSV)", type: "csv", full: true, hint: "Comma-separated, e.g. 1200+ live hours, NCERTs, Mentor" },
        { name: "highlightFeatures", label: "Highlight Features (CSV)", type: "csv", full: true, hint: "Key differentiating features to bold - e.g. Live Classes, Personalized Guidance" },
        { name: "whyChoose", label: "Why Choose This?", type: "textarea", full: true, hint: "Brief explanation of why this course is special (e.g. Interactive learning with personalized mentorship)" },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Publish" }
      ]}
    />
  );
}
