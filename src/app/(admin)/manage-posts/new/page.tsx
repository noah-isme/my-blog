"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "@/lib/api-client";
import { RichTextEditor } from "@/components/RichTextEditor";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  ArrowLeft,
  Tag,
  Image as ImageIcon,
  Calendar,
  User,
  FileText
} from "lucide-react";
import Link from "next/link";

interface PostFormData {
  title: string;
  content: string;
  tags: string;
  featured: boolean;
  published: boolean;
}

export default function NewPostPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<PostFormData>();
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const watchedTags = watch("tags");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: PostFormData) => {
    setIsSaving(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      await createPost({
        title: data.title,
        content,
        tags,
        featured: data.featured || false,
        published: data.published || false,
      });
      router.push("/posts");
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-textSecondary hover:text-accent rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-textPrimary">
              Create New Post
            </h1>
            <p className="mt-1 text-textSecondary">
              Write and publish your next blog post
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreview(!isPreview)}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-textPrimary px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isPreview ? 'Edit' : 'Preview'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Publish Post'}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <label className="block text-sm font-semibold text-textPrimary mb-3">
              Post Title
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Enter an engaging title..."
              className="w-full text-2xl font-playfair font-bold border-0 focus:outline-none focus:ring-0 p-0 placeholder:text-gray-300"
            />
          </motion.div>

          {/* Content Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content
              </h3>
            </div>
            <div className="p-6">
              {isPreview ? (
                <div
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your amazing blog post..."
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Publish Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-textPrimary">
                  Publish immediately
                </label>
                <input
                  type="checkbox"
                  {...register("published")}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-textPrimary">
                  Featured post
                </label>
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            <input
              {...register("tags")}
              placeholder="Add tags separated by commas..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            {watchedTags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {watchedTags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Featured Image
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-textSecondary mb-2">
                Drag and drop an image or click to browse
              </p>
              <button className="text-accent hover:text-accent/80 text-sm font-medium">
                Choose Image
              </button>
            </div>
          </motion.div>

          {/* Post Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Post Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-textSecondary">Words</span>
                <span className="font-medium">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">Characters</span>
                <span className="font-medium">{content.replace(/<[^>]*>/g, '').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">Reading Time</span>
                <span className="font-medium">
                  {Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)} min
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
