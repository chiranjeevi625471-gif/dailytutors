"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  hours: number;
  topics: string[];
  previewVideoUrl?: string;
}

interface ExamCourse {
  id: string;
  examSlug: string;
  active: boolean;
  order: number;
  title: string;
  image: string;
  badge: string;
  badgeColor: string;
  instructor: string;
  instructorImage: string;
  price: number;
  originalPrice: number;
  startDate: string;
  endDate: string;
  duration: string;
  features: string[];
  description: string;
  cta: string;
  link: string;
  chapters?: Chapter[];
  totalHours?: number;
}

export default function EditExamCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<ExamCourse | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({});

  useEffect(() => {
    if (courseId === "new") {
      setLoading(false);
      return;
    }

    const loadCourse = async () => {
      try {
        const response = await fetch(`/api/admin/exam-courses`);
        if (response.ok) {
          const data = await response.json();
          const found = data.find((c: ExamCourse) => c.id === courseId);
          if (found) {
            setCourse(found);
            setChapters(found.chapters || []);
          }
        }
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const addChapter = () => {
    if (!newChapter.title || newChapter.hours === undefined) {
      alert("Please fill in chapter title and hours");
      return;
    }

    const chapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: newChapter.title,
      hours: newChapter.hours,
      topics: newChapter.topics || [],
      previewVideoUrl: newChapter.previewVideoUrl,
    };

    setChapters([...chapters, chapter]);
    setNewChapter({});
  };

  const removeChapter = (id: string) => {
    setChapters(chapters.filter((ch) => ch.id !== id));
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === id ? { ...ch, ...updates } : ch
      )
    );
  };

  const handleSave = async () => {
    if (!course) return;
    
    setSaving(true);
    try {
      const updatedCourse = {
        ...course,
        chapters,
        totalHours: chapters.reduce((sum, ch) => sum + ch.hours, 0),
      };

      const response = await fetch(`/api/admin/exam-courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse),
      });

      if (response.ok) {
        alert("Course updated successfully!");
        router.push("/admin/exam-courses");
      } else {
        alert("Failed to update course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error saving course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center">Course not found</div>;
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-1">Manage course chapters and curriculum</p>
        </div>
        <button
          onClick={() => router.push("/admin/exam-courses")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Current Chapters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Course Chapters ({chapters.length})</h2>
        
        {chapters.length > 0 ? (
          <div className="space-y-3 mb-6">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{index + 1}. {chapter.title}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      <div>⏱️ {chapter.hours} hours</div>
                      {chapter.previewVideoUrl && (
                        <div>🎬 <a href={chapter.previewVideoUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Preview Video</a></div>
                      )}
                    </div>
                    
                    {/* Topics */}
                    <div className="mt-3">
                      <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">Topics</div>
                      <div className="flex flex-wrap gap-2">
                        {chapter.topics.map((topic, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeChapter(chapter.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No chapters added yet</div>
        )}

        {/* Add New Chapter */}
        <div className="border-t pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Chapter
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Chapter Title</label>
              <input
                type="text"
                value={newChapter.title || ""}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="e.g., Physics Fundamentals"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Hours</label>
              <input
                type="number"
                value={newChapter.hours || ""}
                onChange={(e) => setNewChapter({ ...newChapter, hours: Number(e.target.value) })}
                placeholder="e.g., 120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Topics (comma-separated)</label>
            <input
              type="text"
              value={(newChapter.topics || []).join(", ")}
              onChange={(e) =>
                setNewChapter({
                  ...newChapter,
                  topics: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="e.g., Mechanics, Thermodynamics, Waves"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Preview Video URL (optional)</label>
            <input
              type="url"
              value={newChapter.previewVideoUrl || ""}
              onChange={(e) => setNewChapter({ ...newChapter, previewVideoUrl: e.target.value })}
              placeholder="e.g., https://youtu.be/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            onClick={addChapter}
            className="w-full px-4 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Chapter
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => router.push("/admin/exam-courses")}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Curriculum"}
        </button>
      </div>
    </div>
  );
}
