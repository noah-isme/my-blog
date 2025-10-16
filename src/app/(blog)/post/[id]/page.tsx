"use client";

import { getPost, Post } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    getPost(Number(params.id)).then((post) => {
      if (post) {
        setPost(post);
      }
    });
  }, [params.id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prose prose-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <img
          className="mt-8 w-full rounded-lg shadow-lg"
          src={`https://source.unsplash.com/random/1200x600/?nature,${post.id}`}
          alt={post.title}
        />
        <div className="mt-8">{post.content}</div>
      </motion.div>
    </div>
  );
}
