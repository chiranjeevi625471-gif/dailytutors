"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit2, Eye, EyeOff, BookOpen } from "lucide-react";
import { courseCategories as defaultCategories } from "@/lib/course-categories";
import type { CategoryType, ExamCourse } from "@/lib/types";

const EXAM_OPTIONS = ["neet", "cet", "ca", "school-boards"];
const BADGE_COLORS = ["bg-purple-600", "bg-green-600", "bg-red-600", "bg-blue-600", "bg-emerald-600", "bg-orange-600"];

export default function AdminExamCourses() {
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ExamCourse>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/exam-courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
      setCategories(defaultCategories);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCoursesByCategory = (categorySlug: string) => {
    return courses.filter((c) => c.examSlug === categorySlug);
  };

  const handleAddCourse = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setEditingId(null);
    setFormData({ examSlug: categorySlug, order: 1, active: true, badgeColor: "bg-purple-600" });
    setShowAddForm(true);
  };

  const handleEditCourse = (course: ExamCourse) => {
    setSelectedCategory(course.examSlug);
    setEditingId(course.id);
    setFormData(course);
    setShowAddForm(true);
  };

  const handleSaveCourse = async () => {
    if (!formData.title || !formData.examSlug || !formData.price) {
      alert("Please fill in required fields");
      return;
    }

    try {
      if (editingId) {
        // Update
        const response = await fetch(`/api/admin/exam-courses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          loadData();
          alert("Course updated successfully!");
        }
      } else {
        // Add new
        const response = await fetch("/api/admin/exam-courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          loadData();
          alert("Course added successfully!");
        }
      }
      setShowAddForm(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error saving course");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/admin/exam-courses/${id}`, { method: "DELETE" });
      if (response.ok) {
        loadData();
        alert("Course deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const toggleCourseActive = async (course: ExamCourse) => {
    try {
      const response = await fetch(`/api/admin/exam-courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...course, active: !course.active }),
      });
      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Error toggling course:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Exam Courses</h1>
        <p className="text-gray-600 mt-1">Manage courses displayed on individual exam pages. Organized by category.</p>
      </div>

      {/* Sections by Category */}
      {categories.map((category) => {
        const categoryCourses = getCoursesByCategory(category.slug);

        return (
          <div key={category.id} className="space-y-4 border-t pt-8">
            {/* Category Header */}
            <div className={`rounded-lg ${category.color} p-6 border-2 border-gray-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{category.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {categoryCourses.length} course{categoryCourses.length !== 1 ? "s" : ""} •{" "}
                      {categoryCourses.filter((c) => c.active).length} active
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddCourse(category.slug)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Course
                </button>
              </div>
            </div>

            {/* Courses Table */}
            {categoryCourses.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Curriculum</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categoryCourses
                      .sort((a, b) => a.order - b.order)
                      .map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold max-w-xs truncate">{course.title}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">₹{Number(course.price || 0).toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4 text-sm font-medium">{course.order}</td>
                          <td className="px-6 py-4">
                            {course.active ? (
                              <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Live
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                Off
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {course.chapters && course.chapters.length > 0 ? (
                              <Link
                                href={`/admin/exam-courses/${course.id}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                              >
                                <BookOpen className="h-4 w-4" />
                                {course.chapters.length} chapters
                              </Link>
                            ) : (
                              <Link
                                href={`/admin/exam-courses/${course.id}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
                              >
                                <BookOpen className="h-4 w-4" />
                                Add
                              </Link>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCourseActive(course)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title={course.active ? "Deactivate" : "Activate"}
                              >
                                {course.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                <p className="font-medium">No courses in this category</p>
                <p className="text-sm mt-1">Click "Add Course" to create the first course</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Add/Edit Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Course" : "Add New Course"}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Course Title *</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Arjuna NEET 2.0 2027"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Badge</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="ONLINE, OFFLINE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Instructor</label>
                <input
                  type="text"
                  value={formData.instructor || ""}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="e.g., Arjun Singh"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  rows={2}
                  placeholder="One-line description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="01 Jan 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="30 Jun 2028"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="e.g., 30 months"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Features (comma-separated) *</label>
                <textarea
                  value={Array.isArray(formData.features) ? formData.features.join(", ") : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value.split(",").map((f) => f.trim()),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  rows={3}
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Button Text *</label>
                  <input
                    type="text"
                    value={formData.cta || ""}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="ENROLL NOW"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Course Link *</label>
                  <input
                    type="text"
                    value={formData.link || ""}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="/courses/neet-arjuna-2027"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Active (show on site)</label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({});
                  setEditingId(null);
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-6 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingId ? "Update" : "Add"} Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
