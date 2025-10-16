"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RichTextEditor } from "@/components/RichTextEditor";
import { updatePost, Post, getPost } from "@/lib/api-client";
import { ArrowLeft, Eye, EyeOff, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { register, handleSubmit, setValue, watch } = useForm<Omit<Post, 'id'>>();
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");

  const watchedTitle = watch("title");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const postId = Number(params.id);
    if (postId) {
      getPost(postId).then((post) => {
        if (post) {
          setValue("title", post.title);
          setContent(post.content);
          setPublished(post.published);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [params.id, setValue]);

  const onSubmit = async (data: Omit<Post, 'id'>) => {
    setSaving(true);
    const postId = Number(params.id);
    if (postId) {
      try {
        await updatePost(postId, { ...data, content, published });
        router.push("/manage-posts");
      } catch (error) {
        console.error("Failed to update post:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/manage-posts"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Posts
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
                <p className="text-sm text-gray-500">Make changes to your post</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="flex items-center text-sm text-gray-700">
                  {published ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                  {published ? "Published" : "Draft"}
                </label>
              </div>
              <button
                type="submit"
                form="edit-post-form"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form id="edit-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Post Title
              </label>
              <input
                id="title"
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
              />
              {watchedTitle && (
                <p className="mt-2 text-sm text-gray-500">
                  Preview: <span className="font-medium text-gray-900">{watchedTitle}</span>
                </p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Post Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your amazing post..."
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>Write something amazing...</span>
                <span>{content.length} characters</span>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">SEO Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
                  {watchedTitle || "Your Post Title"}
                </div>
                <div className="text-green-700 text-sm mb-2">
                  myblog.com/posts/{params.id}
                </div>
                <div className="text-gray-600 text-sm">
                  {content.replace(/<[^>]*>/g, '').substring(0, 160)}...
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
