'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Users, FileText, BookOpen, DollarSign, TrendingUp, LogOut, Menu, X } from 'lucide-react';

interface DashboardStats {
  totalArticles: number;
  totalCourses: number;
  totalQuizzes: number;
  totalRevenue: number;
  aiGeneratedContent: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Placeholder for now - in real implementation, fetch from API
      // const response = await fetch('/api/admin/dashboard-stats');
      // const data = await response.json();
      
      // Mock data for demonstration
      setStats({
        totalArticles: 156,
        totalCourses: 12,
        totalQuizzes: 45,
        totalRevenue: 125000,
        aiGeneratedContent: 89,
        totalUsers: 3240,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className={`font-bold text-blue-600 ${sidebarOpen ? 'text-xl' : 'text-xs'}`}>
            {sidebarOpen ? 'DailyTutors' : 'DT'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink
            href="/admin/dashboard"
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            active
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/articles"
            icon={<FileText size={20} />}
            label="Articles"
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/courses"
            icon={<BookOpen size={20} />}
            label="Courses"
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/quizzes"
            icon={<BarChart3 size={20} />}
            label="Quizzes"
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/payments"
            icon={<DollarSign size={20} />}
            label="Payments"
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/analytics"
            icon={<TrendingUp size={20} />}
            label="Analytics"
            collapsed={!sidebarOpen}
          />
          <SidebarLink
            href="/admin/settings"
            icon={<Users size={20} />}
            label="Settings"
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Articles"
                  value={stats.totalArticles}
                  icon={<FileText className="text-blue-600" size={24} />}
                  trend="+12%"
                  trendColor="green"
                />
                <StatCard
                  title="Total Courses"
                  value={stats.totalCourses}
                  icon={<BookOpen className="text-green-600" size={24} />}
                  trend="+8%"
                  trendColor="green"
                />
                <StatCard
                  title="Total Quizzes"
                  value={stats.totalQuizzes}
                  icon={<BarChart3 className="text-purple-600" size={24} />}
                  trend="+5%"
                  trendColor="green"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Revenue"
                  value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
                  icon={<DollarSign className="text-green-600" size={24} />}
                  trend="+18%"
                  trendColor="green"
                />
                <StatCard
                  title="AI Generated Content"
                  value={stats.aiGeneratedContent}
                  icon={<TrendingUp className="text-orange-600" size={24} />}
                  trend="+25%"
                  trendColor="green"
                />
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<Users className="text-red-600" size={24} />}
                  trend="+15%"
                  trendColor="green"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Articles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Article Title {i}</p>
                          <p className="text-xs text-gray-500">Published 2 hours ago</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Published</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/admin/articles"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all articles →
                  </Link>
                </div>

                {/* Pending Moderation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Moderation</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Article Title {i}</p>
                          <p className="text-xs text-gray-500">Waiting review</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Pending</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/admin/articles?status=pending_review"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Review pending articles →
                  </Link>
                </div>
              </div>

              {/* Latest Payments */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Payments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-sm text-gray-600">#PAY{String(i).padStart(4, '0')}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">UPSC Course {i}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{(5000 + i * 1000).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Captured</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">Jun {i}, 2026</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar Navigation Link Component
 */
function SidebarLink({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  title,
  value,
  icon,
  trend,
  trendColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendColor: 'green' | 'red';
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-xs mt-2 ${trendColor === 'green' ? 'text-green-600' : 'text-red-600'}`}>
            {trend} from last month
          </p>
        </div>
        <div className="text-gray-300">{icon}</div>
      </div>
    </div>
  );
}