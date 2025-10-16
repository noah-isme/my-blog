"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getPosts, Post, deletePost } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Search,
  Edit3,
  Eye,
  MoreVertical,
  Download,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const POSTS_PER_PAGE = 10;

export default function PostsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "title" | "views" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: ""
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts);
      setLoading(false);
      
      // Extract unique tags
      const allTags = posts.flatMap(post => post.tags || []);
      const uniqueTags = [...new Set(allTags)];
      setAvailableTags(uniqueTags);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      setSelectedPosts(selectedPosts.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      for (const id of selectedPosts) {
        await deletePost(id);
      }
      setPosts(posts.filter((post) => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      setShowBulkActions(false);
    }
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  const togglePostSelection = (id: number) => {
    setSelectedPosts(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPagePosts = filteredPosts.slice(0, visiblePosts);
    const allSelected = currentPagePosts.every(post => selectedPosts.includes(post.id));

    if (allSelected) {
      setSelectedPosts(prev => prev.filter(id => !currentPagePosts.some(post => post.id === id)));
    } else {
      const newSelections = currentPagePosts
        .filter(post => !selectedPosts.includes(post.id))
        .map(post => post.id);
      setSelectedPosts(prev => [...prev, ...newSelections]);
    }
  };

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || post.published === (statusFilter === "published");
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => post.tags?.includes(tag));
      const matchesDateRange = (!dateRange.start || !post.createdAt || new Date(post.createdAt) >= new Date(dateRange.start)) &&
                              (!dateRange.end || !post.createdAt || new Date(post.createdAt) <= new Date(dateRange.end));
      
      return matchesSearch && matchesStatus && matchesTags && matchesDateRange;
    });

    // Sort posts
    const sorted = filtered.toSorted((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'status':
          aValue = a.published ? 1 : 0;
          bValue = b.published ? 1 : 0;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [posts, searchTerm, statusFilter, selectedTags, dateRange, sortBy, sortOrder]);

  const handleBulkStatusChange = async (newStatus: boolean) => {
    // In a real app, this would make API calls to update multiple posts
    // For now, we'll update the local state
    setPosts(posts.map(post => 
      selectedPosts.includes(post.id) 
        ? { ...post, published: newStatus }
        : post
    ));
    setSelectedPosts([]);
    setShowBulkActions(false);
  };

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Status', 'Views', 'Tags', 'Created Date'],
      ...filteredPosts.map(post => [
        post.title,
        post.published ? 'Published' : 'Draft',
        post.views?.toString() || '0',
        post.tags?.join(', ') || '',
        post.createdAt || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return null;
  }

  const currentPagePosts = filteredPosts.slice(0, visiblePosts);
  const allSelected = currentPagePosts.length > 0 && currentPagePosts.every(post => selectedPosts.includes(post.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-textPrimary">
            Posts Management
          </h1>
          <p className="mt-1 text-textSecondary">
            Manage your blog posts and content
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/posts/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Post
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-textSecondary" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
              className="rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="views-desc">Most Viewed</option>
              <option value="status-desc">Published First</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-textPrimary px-4 py-3 rounded-xl font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
          {/* Tag Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-textSecondary mb-2">Filter by Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-gray-50 text-textSecondary border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-3">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {showBulkActions && selectedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-textPrimary">
                {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkStatusChange(true)}
                  className="px-4 py-2 text-sm text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg"
                >
                  Publish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkStatusChange(false)}
                  className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg"
                >
                  Unpublish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPosts([])}
                  className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary rounded-lg hover:bg-white/50"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Delete Selected
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="text-textSecondary">Loading posts...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-textPrimary">
                    {filteredPosts.length} posts
                  </span>
                </div>
                {selectedPosts.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="p-2 text-textSecondary hover:text-textPrimary rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {currentPagePosts.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-textPrimary mb-2">No posts found</h3>
                  <p className="text-textSecondary">Try adjusting your search or filters.</p>
                </div>
              ) : (
                currentPagePosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => togglePostSelection(post.id)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-textPrimary truncate mb-1">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-textSecondary mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views?.toLocaleString() || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{post.readTime || 1} min read</span>
                            </div>
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-100 text-textSecondary rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs text-textSecondary">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Link href={`/posts/${post.id}/edit`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-textSecondary hover:text-accent rounded-lg hover:bg-gray-100"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                          </Link>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-textSecondary hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Load More */}
            {visiblePosts < filteredPosts.length && (
              <div className="p-6 border-t border-gray-200 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Load More Posts
                </motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
