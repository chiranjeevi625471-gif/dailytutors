"use client";
import EntityManager from "@/components/admin/EntityManager";

const GRADIENTS = [
  "from-red-700 via-red-600 to-rose-500",
  "from-rose-900 via-red-700 to-red-500",
  "from-red-800 via-rose-600 to-pink-500",
  "from-red-600 via-orange-500 to-amber-500",
  "from-rose-700 via-red-600 to-red-400"
];

export default function AdminBanners() {
  return (
    <EntityManager
      title="Hero Banners"
      description="The full-width auto-rotating carousel at the top of the home page."
      entity="banners"
      defaults={{ order: 1, bg: GRADIENTS[0] }}
      columns={[
        {
          key: "preview",
          label: "Preview",
          render: (r) => (
            <div className="relative h-12 w-32 rounded-md overflow-hidden bg-gradient-to-br">
              {r.image ? (
                <img src={r.image} alt="Banner" className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${r.bg}`} />
              )}
            </div>
          )
        },
        { key: "title", label: "Title", render: (r) => <div className="font-semibold">{r.title}</div> },
        { key: "eyebrow", label: "Eyebrow" },
        { key: "order", label: "Order" },
        { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
      ]}
      fields={[
        { name: "eyebrow", label: "Eyebrow", required: true, placeholder: "Ace Your UPSC Prep!" },
        { name: "order", label: "Order", type: "number", required: true },
        { name: "image", label: "Banner Image", type: "file", accept: "image/*", full: true, hint: "Upload a background image for the banner" },
        { name: "title", label: "Title (large)", required: true, full: true, placeholder: "FOUNDATION 2027 BATCH" },
        { name: "subtitle", label: "Subtitle", required: true, full: true, placeholder: "FOR PRELIMS, MAINS & OPTIONAL — LIVE + RECORDED" },
        { name: "cta", label: "CTA text", required: true, placeholder: "TAP TO EXPLORE!" },
        { name: "href", label: "CTA link", required: false, placeholder: "/courses/..." },
        { name: "bg", label: "Background gradient (fallback)", type: "select", options: GRADIENTS, required: true, full: true, hint: "Used when no image is uploaded" },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Show on site" }
      ]}
    />
  );
}
