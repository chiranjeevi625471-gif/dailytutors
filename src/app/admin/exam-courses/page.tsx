"use client";
import EntityManager from "@/components/admin/EntityManager";

const EXAM_OPTIONS = ["neet", "cet", "ca", "school-boards"];
const BADGE_COLORS = ["bg-purple-600", "bg-green-600", "bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-orange-600"];

export default function AdminExamCourses() {
  return (
    <EntityManager
      title="Exam Courses"
      description="Manage courses displayed on individual exam pages (NEET, CET, CA, School Boards)."
      entity="exam-courses"
      defaults={{ order: 1, active: true, badgeColor: "bg-purple-600" }}
      columns={[
        { key: "title", label: "Title", render: (r) => <div className="font-semibold max-w-xs">{r.title}</div> },
        { key: "examSlug", label: "Exam", render: (r) => <span className="badge">{r.examSlug}</span> },
        { key: "price", label: "Price", render: (r) => <span>₹{Number(r.price || 0).toLocaleString("en-IN")}</span> },
        { key: "order", label: "Order" },
        {
          key: "active",
          label: "Status",
          render: (r) =>
            r.active ? (
              <span className="badge">Live</span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span>
            ),
        },
      ]}
      fields={[
        { name: "title", label: "Course Title", required: true, full: true, placeholder: "Arjuna NEET 2.0 2027" },
        { name: "examSlug", label: "Exam", type: "select", options: EXAM_OPTIONS, required: true },
        { name: "order", label: "Display Order", type: "number", required: true, placeholder: "1, 2, 3..." },
        { name: "image", label: "Course Image", type: "file", accept: "image/*", full: true, hint: "Upload course thumbnail (recommended: 400x300px)" },
        { name: "badge", label: "Badge Text", required: true, placeholder: "e.g., ONLINE, OFFLINE" },
        { name: "badgeColor", label: "Badge Color", type: "select", options: BADGE_COLORS, required: true },
        { name: "instructor", label: "Instructor Name", full: true, placeholder: "e.g., Arjun Singh" },
        { name: "description", label: "Short Description", type: "textarea", required: true, full: true, placeholder: "One-line description of the course" },
        { name: "price", label: "Price (₹)", type: "number", required: true },
        { name: "originalPrice", label: "Original Price (₹)", type: "number", hint: "Leave blank if no discount" },
        { name: "startDate", label: "Start Date", placeholder: "01 Jan 2026", full: true },
        { name: "endDate", label: "End Date", placeholder: "30 Jun 2028", full: true },
        { name: "duration", label: "Duration", placeholder: "e.g., 30 months", full: true },
        { 
          name: "features", 
          label: "Features", 
          type: "csv", 
          required: true, 
          full: true, 
          hint: "Enter features separated by commas or paste one per line (will be converted to array)"
        },
        { name: "cta", label: "Button Text", required: true, placeholder: "ENROLL NOW" },
        { name: "link", label: "Course Link", required: true, full: true, placeholder: "/courses/neet-arjuna-2027" },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Show on site" }
      ]}
    />
  );
}
