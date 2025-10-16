"use client";

import { getPost, Post } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CommentsSystem } from "@/components/CommentsSystem";
import { BlogPostStructuredData } from "@/components/StructuredData";
import {
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Bookmark,
  Heart
} from "lucide-react";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const resolvedParams = await params;
      const postId = Number(resolvedParams.id);
      const post = await getPost(postId);
      if (post) {
        setPost(post);
      }
    };
    fetchPost();
  }, [params]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading post...</p>
        </div>
      </div>
    );
  }

  const postUrl = `http://localhost:3000/post/${post.id}`;

  return (
    <>
      {/* SEO Structured Data */}
      <BlogPostStructuredData post={post} url={postUrl} />

      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative h-96 w-full rounded-2xl shadow-lg overflow-hidden mb-8">
            <Image
              fill
              className="object-cover"
              src={`https://source.unsplash.com/random/1200x600/?nature,${post.id}`}
              alt={post.title}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 text-textSecondary mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown date'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime || 1} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views?.toLocaleString() || 0} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-textSecondary hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                isBookmarked
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-textSecondary hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              Bookmark
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.share?.({
                title: post.title,
                text: post.content.substring(0, 100) + '...',
                url: postUrl
              })}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-textSecondary hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CommentsSystem postId={post.id.toString()} />
        </motion.div>
      </article>
    </>
  );
}
