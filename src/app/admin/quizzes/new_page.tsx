'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  _id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  questions: number;
  timeLimit: number;
  totalAttempts: number;
  published: boolean;
  createdAt: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuizzes();
  }, [search, difficulty, page]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      // Mock data
      setQuizzes([
        {
          _id: '1',
          title: 'Daily Current Affairs Quiz',
          slug: 'daily-ca-quiz',
          category: 'Current Affairs',
          difficulty: 'Medium',
          questions: 10,
          timeLimit: 15,
          totalAttempts: 1250,
          published: true,
          createdAt: '2026-06-01T10:00:00Z',
        },
        {
          _id: '2',
          title: 'GS Prelims Practice Test',
          slug: 'gs-prelims-test',
          category: 'Prelims',
          difficulty: 'Hard',
          questions: 100,
          timeLimit: 120,
          totalAttempts: 890,
          published: true,
          createdAt: '2026-05-28T10:00:00Z',
        },
        {
          _id: '3',
          title: 'History Quick Quiz',
          slug: 'history-quick-quiz',
          category: 'History',
          difficulty: 'Easy',
          questions: 15,
          timeLimit: 20,
          totalAttempts: 640,
          published: true,
          createdAt: '2026-05-25T10:00:00Z',
        },
      ]);
      setTotalPages(4);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q._id !== id));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quizzes Management</h1>
        <Link
          href="/admin/quizzes/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Quiz
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch('');
              setDifficulty('');
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Filter size={18} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No quizzes found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Questions</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attempts</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/quizzes/${quiz._id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {quiz.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{quiz.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{quiz.questions}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                        <Clock size={16} />
                        {quiz.timeLimit} min
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{quiz.totalAttempts}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/quizzes/${quiz._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(quiz._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}