"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Clock, Users } from "lucide-react";

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
}

interface ExamCoursesProps {
  examSlug: string;
}

export default function ExamCourses({ examSlug }: ExamCoursesProps) {
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/api/exam-courses?exam=" + examSlug);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.sort((a: ExamCourse, b: ExamCourse) => a.order - b.order));
        }
      } catch (error) {
        console.error("Error loading exam courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [examSlug]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No courses available yet</h3>
        <p className="mt-2 text-gray-600">Courses for this exam will be added soon.</p>
        <Link href="/courses" className="btn-primary mt-6 inline-flex">
          Browse all courses
        </Link>
      </div>
    );
  }

  const discount = (course: ExamCourse) => {
    if (!course.originalPrice) return 0;
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <div className="text-sm">Course Image</div>
                </div>
              </div>
            )}

            {/* Badge */}
            {course.badge && (
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-bold ${course.badgeColor}`}>
                {course.badge}
              </div>
            )}

            {/* Discount Badge */}
            {discount(course) > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                {discount(course)}% off
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title and Instructor */}
            <h3 className="font-bold text-lg leading-tight mb-1">{course.title}</h3>
            {course.instructor && (
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-300" />
                {course.instructor}
              </p>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

            {/* Features Preview */}
            <div className="mb-4 space-y-1">
              {course.features.slice(0, 2).map((feature, i) => (
                <div key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span className="line-clamp-1">{feature}</span>
                </div>
              ))}
              {course.features.length > 2 && (
                <div className="text-xs text-gray-500 italic">+{course.features.length - 2} more features</div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
              {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration}
                </div>
              )}
              {course.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {course.startDate}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">₹{course.price.toLocaleString("en-IN")}</span>
              {course.originalPrice > course.price && (
                <span className="text-sm text-gray-500 line-through">₹{course.originalPrice.toLocaleString("en-IN")}</span>
              )}
            </div>

            {/* CTA Button */}
            <Link href={course.link} className="block w-full text-center px-4 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
              {course.cta}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple calendar icon since we haven't imported it yet
function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
