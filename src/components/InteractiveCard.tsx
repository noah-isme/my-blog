'use client';

import { useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Eye, Clock, User } from 'lucide-react';

interface InteractiveCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
  glow?: boolean;
  interactive?: boolean;
}

export function InteractiveCard({
  children,
  onClick,
  className = '',
  hover = true,
  tilt = false,
  glow = false,
  interactive = true
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!tilt) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      style={tilt ? { rotateX, rotateY } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />
      )}

      {/* Main Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {children}

        {/* Interactive Overlay */}
        {interactive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-[1px]"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isBookmarked
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Post Card Component
interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: number;
  views: number;
  comments: number;
  image?: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  onClick?: () => void;
}

export function PostCard({
  title,
  excerpt,
  author,
  date,
  readTime,
  views,
  comments,
  image,
  tags = [],
  category,
  featured = false,
  onClick
}: PostCardProps) {
  return (
    <InteractiveCard
      onClick={onClick}
      className="h-full"
      hover={true}
      glow={featured}
      interactive={true}
    >
      <div className="h-full flex flex-col">
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                Featured
              </div>
            )}
            {category && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {category}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime} min
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {comments}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{new Date(date).toLocaleDateString()}</span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}