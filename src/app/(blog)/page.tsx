"use client";

import { getPosts, Post } from "@/lib/api-client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

const POSTS_PER_PAGE = 5;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts.filter((post) => post.published));
    });
  }, []);

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1, visiblePosts);

  return (
    <div className="space-y-8">
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

      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/post/${featuredPost.id}`}>
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <img
                  className="w-full transform object-cover transition duration-500 group-hover:scale-105"
                  src={`https://source.unsplash.com/random/1200x600/?nature,${featuredPost.id}`}
                  alt={featuredPost.title}
                />
              </div>
              <div className="mt-4">
                <h2 className="text-3xl font-bold group-hover:text-indigo-600">
                  {featuredPost.title}
                </h2>
                <p className="mt-2 text-gray-600">{featuredPost.content}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {otherPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/post/${post.id}`}>
              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    className="w-full transform object-cover transition duration-500 group-hover:scale-105"
                    src={`https://source.unsplash.com/random/800x600/?nature,${post.id}`}
                    alt={post.title}
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-bold group-hover:text-indigo-600">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{post.content}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {visiblePosts < filteredPosts.length && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
