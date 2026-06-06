"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { courseCategories as defaultCategories } from "@/lib/course-categories";
import type { CategoryType } from "@/lib/types";

export default function AdminCourseCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CategoryType>>({});

  useEffect(() => {
    // Load categories (defaulting to seed data)
    setCategories(defaultCategories);
    setLoading(false);
  }, []);

  const handleEdit = (category: CategoryType) => {
    setEditingId(category.id);
    setFormData({ ...category });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert("Please fill in required fields");
      return;
    }

    if (editingId) {
      // Update existing
      setCategories(
        categories.map((c) =>
          c.id === editingId ? ({ ...c, ...formData } as CategoryType) : c
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newCategory: CategoryType = {
        id: `cat-${Date.now()}`,
        name: formData.name!,
        slug: formData.slug!,
        icon: formData.icon || "📚",
        color: formData.color || "bg-gray-50",
        accentColor: formData.accentColor || "from-gray-600 to-gray-700",
        description: formData.description || "",
        totalCourses: 0,
        active: true,
      };
      setCategories([...categories, newCategory]);
    }

    setFormData({});
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c
      )
    );
  };

  const ICONS = ["🧬", "⚙️", "📊", "📚", "🏛️", "🎓", "💼", "🔬"];
  const COLORS = [
    "bg-rose-50",
    "bg-blue-50",
    "bg-emerald-50",
    "bg-purple-50",
    "bg-amber-50",
    "bg-indigo-50",
    "bg-cyan-50",
    "bg-pink-50",
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Categories</h1>
          <p className="text-gray-600 mt-1">Manage exam types and course categories</p>
        </div>
        <button
          onClick={() => {
            setFormData({});
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative rounded-lg border-2 p-6 transition-all ${
              category.active
                ? "border-gray-200 bg-white"
                : "border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-xs text-gray-600">/{category.slug}</p>
                </div>
              </div>

              {/* Status Badge */}
              {!category.active && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                  Inactive
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>

            {/* Stats */}
            <div className="text-sm font-semibold text-gray-700 mb-4 pb-4 border-b border-gray-200">
              📊 {category.totalCourses} courses
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(category.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {category.active ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Active
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Inactive
                  </>
                )}
              </button>
              <button
                onClick={() => handleEdit(category)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <div className="space-y-4 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., NEET Medical"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                  }
                  placeholder="e.g., neet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What is this course category about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  rows={2}
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-semibold mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        formData.icon === icon
                          ? "bg-brand text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${color} ${
                        formData.color === color
                          ? "border-brand scale-110"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({});
                  setEditingId(null);
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingId ? "Update" : "Add"} Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="font-bold text-blue-900 mb-2">📊 Summary</h3>
        <p className="text-blue-800">
          You have <strong>{categories.length}</strong> course categories with{" "}
          <strong>
            {categories.reduce((sum, c) => sum + c.totalCourses, 0)}
          </strong>{" "}
          total courses. <strong>{categories.filter(c => c.active).length}</strong> are active.
        </p>
      </div>
    </div>
  );
}
