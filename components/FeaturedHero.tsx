import Image from 'next/image'
import Link from 'next/link'
import type { PostMeta } from '@/lib/types'

export default function FeaturedHero({ primary, secondary }: { primary: PostMeta; secondary: PostMeta[] }) {
  const secondaryPosts = secondary.slice(0, 2)

  return (
    <section aria-label="Artikel unggulan" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Link
        href={`/blog/${primary.slug}`}
        className="group relative overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-lg dark:border-white/10 dark:bg-slate-900"
      >
        <div className="relative aspect-video">
          <Image
            src={primary.cover}
            alt={`Sampul: ${primary.title}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 66vw, 100vw"
            priority
          />
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {primary.categories?.join(' • ')}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-extrabold leading-tight group-hover:underline group-focus-visible:underline">
            {primary.title}
          </h2>
          <p className="mt-3 text-sm text-slate-700 line-clamp-3 dark:text-slate-200">{primary.excerpt}</p>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-6">
        {secondaryPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-lg dark:border-white/10 dark:bg-slate-900"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={post.cover}
                alt={`Sampul: ${post.title}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {post.categories?.join(' • ')}
              </p>
              <h3 className="mt-1 text-lg font-semibold leading-tight group-hover:underline group-focus-visible:underline">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700 line-clamp-2 dark:text-slate-200">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
