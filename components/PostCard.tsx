import Image from 'next/image'
import Link from 'next/link'
import type { PostMeta } from '@/lib/types'

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group card-hover overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      <Link
        href={`/blog/${post.slug}`}
        className="block focus:outline-none"
        aria-label={`Baca ${post.title}`}
      >
        <div className="relative aspect-video">
          <Image
            src={post.cover}
            alt={`Sampul: ${post.title}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
            priority={post.featured}
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-600 dark:border-white/20 dark:text-slate-300"
              >
                {category}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold leading-tight">
            <span className="link-underline">{post.title}</span>
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {new Date(post.date).toLocaleDateString('id-ID', { dateStyle: 'long' })} • {post.readingTime.text}
          </p>
          <p className="mt-2 text-sm text-slate-700 line-clamp-3 dark:text-slate-200">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  )
}
