import type { PostMeta } from '@/lib/types'
import PostCard from './PostCard'

export default function PostList({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada artikel.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
