"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function AdminPromoBanners() {
  return (
    <EntityManager
      title="Promotional Banners"
      description="3 promotional banners displayed before 'Everything you need, in one place' section on the home page."
      entity="promobanners"
      defaults={{ order: 1 }}
      columns={[
        {
          key: "preview",
          label: "Preview",
          render: (r) => (
            <div className="relative h-16 w-24 rounded-md overflow-hidden bg-gradient-to-br from-red-600 to-rose-600">
              {r.image ? (
                <img src={r.image} alt={r.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold text-center px-1">No Image</span>
                </div>
              )}
            </div>
          )
        },
        { key: "title", label: "Title", render: (r) => <div className="font-semibold">{r.title}</div> },
        { key: "order", label: "Order" },
        { 
          key: "active", 
          label: "Active", 
          render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> 
        }
      ]}
      fields={[
        { name: "title", label: "Banner Title", required: true, full: true, placeholder: "e.g., Tuition for 8th to 12th" },
        { name: "order", label: "Order", type: "number", required: true, placeholder: "1, 2, 3..." },
        { name: "image", label: "Banner Image", type: "file", accept: "image/*", full: true, hint: "Upload a banner image (recommended: 800x400px)" },
        { name: "link", label: "Banner Link", required: true, full: true, placeholder: "e.g., /courses/school-tuition" },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Show on site" }
      ]}
    />
  );
}
