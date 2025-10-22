import { useRef } from 'react'
import { PostMeta } from '@/lib/types'
import PostCard from './PostCard'

interface CarouselProps {
  posts: PostMeta[]
}

export default function Carousel({ posts }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.offsetWidth * 0.7
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll kiri"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-lightAccent hover:text-white transition dark:bg-slate-900/80 dark:hover:bg-darkAccent"
        onClick={() => scroll('left')}
        style={{ display: posts.length > 2 ? 'block' : 'none' }}
      >
        &#8592;
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {posts.map((post) => (
          <div key={post.slug} className="min-w-[320px] max-w-xs snap-start">
            <PostCard post={post} />
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll kanan"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-lightAccent hover:text-white transition dark:bg-slate-900/80 dark:hover:bg-darkAccent"
        onClick={() => scroll('right')}
        style={{ display: posts.length > 2 ? 'block' : 'none' }}
      >
        &#8594;
      </button>
    </div>
  )
}
