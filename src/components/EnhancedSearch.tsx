'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Clock,
  Star,
  BookOpen
} from 'lucide-react';
import { useDebounce } from '@/lib/performance';

interface SearchFilters {
  category: string;
  author: string;
  dateRange: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  tags: string[];
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear: () => void;
  placeholder?: string;
  categories?: string[];
  authors?: string[];
  tags?: string[];
  isLoading?: boolean;
  totalResults?: number;
}

export function EnhancedSearch({
  onSearch,
  onClear,
  placeholder = "Search articles...",
  categories = [],
  authors = [],
  tags = [],
  isLoading = false,
  totalResults
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    author: '',
    dateRange: '',
    sortBy: 'newest',
    tags: []
  });

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery, filters);
  }, [debouncedQuery, filters, onSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      dateRange: '',
      sortBy: 'newest',
      tags: []
    });
    setQuery('');
    onClear();
  };

  const hasActiveFilters = useMemo(() => {
    return filters.category || filters.author || filters.dateRange || filters.tags.length > 0;
  }, [filters]);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'oldest', label: 'Oldest First', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: Star }
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-colors ${
              showFilters
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Stats */}
        {totalResults !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400"
          >
            <span>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                `${totalResults} result${totalResults !== 1 ? 's' : ''} found`
              )}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author
                </label>
                <select
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">All Authors</option>
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as SearchFilters['sortBy'])}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      <BookOpen className="w-3 h-3" />
                      {filters.category}
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.author && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      <User className="w-3 h-3" />
                      {filters.author}
                      <button
                        onClick={() => handleFilterChange('author', '')}
                        className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.dateRange && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      <Calendar className="w-3 h-3" />
                      {dateRanges.find(r => r.value === filters.dateRange)?.label}
                      <button
                        onClick={() => handleFilterChange('dateRange', '')}
                        className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}