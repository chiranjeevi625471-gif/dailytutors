"use client";
import EntityManager from "@/components/admin/EntityManager";

const ICONS = ["Newspaper", "PenLine", "Brain", "Download", "GraduationCap", "Map", "Trophy", "BookOpenCheck"];
const GRADIENTS = [
  "from-red-600 to-rose-500",
  "from-rose-700 to-pink-500",
  "from-red-700 to-orange-500",
  "from-orange-600 to-red-500",
  "from-rose-600 to-red-700",
  "from-pink-600 to-rose-700",
  "from-red-500 to-rose-600",
  "from-red-800 to-rose-500"
];

export default function AdminCards() {
  return (
    <EntityManager
      title="Banner Cards (8 Auto-scroll)"
      description="The auto-scrolling row of cards below the hero. Use 'order' to control sequence."
      entity="cards"
      defaults={{ order: 1, icon: ICONS[0], bg: GRADIENTS[0] }}
      columns={[
        { key: "preview", label: "Preview", render: (r) => <div className={`h-12 w-20 rounded-md bg-gradient-to-br ${r.bg}`} /> },
        { key: "title", label: "Title", render: (r) => <div className="font-semibold">{r.title}</div> },
        { key: "tag", label: "Tag" },
        { key: "icon", label: "Icon" },
        { key: "order", label: "Order" },
        { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
      ]}
      fields={[
        { name: "title", label: "Title", required: true, placeholder: "Daily Current Affairs" },
        { name: "tag", label: "Tag (small text)", required: true, placeholder: "FREE · 8 AM IST" },
        { name: "href", label: "Link", required: false, placeholder: "/current-affairs", full: true },
        { name: "icon", label: "Icon", type: "select", options: ICONS, required: true },
        { name: "order", label: "Order", type: "number", required: true },
        { name: "bg", label: "Background gradient", type: "select", options: GRADIENTS, required: true, full: true },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Show on site" }
      ]}
    />
  );
}
