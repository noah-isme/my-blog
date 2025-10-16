"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getPosts, Post, deletePost } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Trash2, Search } from "lucide-react";

const POSTS_PER_PAGE = 5;

export default function PostsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Posts</h1>
        <Link href="/posts/new">
          <button className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white">
            <Plus className="mr-2 h-5 w-5" />
            Create Post
          </button>
        </Link>
      </div>
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Published
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <tr key={post.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="mr-4 text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visiblePosts < filteredPosts.length && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
