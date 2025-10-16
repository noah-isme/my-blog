"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPost, updatePost, Post } from "@/lib/api-client";

export default function EditPostPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { register, handleSubmit, setValue } = useForm<Post>();
  const [published, setPublished] = useState(false);

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
          setValue("content", post.content);
          setPublished(post.published);
        }
      });
    }
  }, [params.id, setValue]);

  const onSubmit = async (data: any) => {
    const postId = Number(params.id);
    if (postId) {
      await updatePost(postId, { ...data, published });
      router.push("/posts");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            {...register("title", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="content"
            {...register("content", { required: true })}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Published
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
}
