'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Calendar,
  Download,
  Share2
} from 'lucide-react';
import { DashboardSkeleton } from './Skeleton';

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  viewsTrend: number;
  usersTrend: number;
  postsTrend: number;
  commentsTrend: number;
  monthlyViews: Array<{ month: string; views: number }>;
  topPosts: Array<{ id: string; title: string; views: number; comments: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: AnalyticsData = {
        totalViews: 45280,
        totalUsers: 1234,
        totalPosts: 89,
        totalComments: 567,
        viewsTrend: 12.5,
        usersTrend: 8.3,
        postsTrend: 15.2,
        commentsTrend: -2.1,
        monthlyViews: [
          { month: 'Jan', views: 3200 },
          { month: 'Feb', views: 4100 },
          { month: 'Mar', views: 3800 },
          { month: 'Apr', views: 5200 },
          { month: 'May', views: 4800 },
          { month: 'Jun', views: 6100 },
        ],
        topPosts: [
          { id: '1', title: 'Getting Started with Next.js 15', views: 2450, comments: 23 },
          { id: '2', title: 'Advanced TypeScript Patterns', views: 1890, comments: 18 },
          { id: '3', title: 'Building Modern UIs with Tailwind', views: 1650, comments: 31 },
          { id: '4', title: 'React Server Components Deep Dive', views: 1420, comments: 15 },
          { id: '5', title: 'Performance Optimization Techniques', views: 1280, comments: 27 },
        ],
        recentActivity: [
          { type: 'post', description: 'New post published: "React 19 Features"', timestamp: '2 hours ago' },
          { type: 'comment', description: 'New comment on "TypeScript Tips"', timestamp: '4 hours ago' },
          { type: 'user', description: 'New user registered: john_doe', timestamp: '6 hours ago' },
          { type: 'view', description: 'Post "Next.js Guide" reached 1000 views', timestamp: '8 hours ago' },
          { type: 'comment', description: 'Comment liked on "CSS Grid Tutorial"', timestamp: '12 hours ago' },
        ]
      };

      setData(mockData);
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) return null;

  const stats = [
    {
      title: 'Total Views',
      value: data.totalViews.toLocaleString(),
      trend: data.viewsTrend,
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Users',
      value: data.totalUsers.toLocaleString(),
      trend: data.usersTrend,
      icon: Users,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Published Posts',
      value: data.totalPosts.toString(),
      trend: data.postsTrend,
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Total Comments',
      value: data.totalComments.toString(),
      trend: data.commentsTrend,
      icon: MessageSquare,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your blog&apos;s performance and engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <TrendingUp className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Views
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyViews.map((item, index) => {
              const maxViews = Math.max(...data.monthlyViews.map(d => d.views));
              const height = (item.views / maxViews) * 100;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[20px]"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {data.topPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
                <button className="ml-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {data.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}