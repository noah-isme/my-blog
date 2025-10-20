'use client'

import { useMemo, useState } from 'react'

import Pagination from '@/components/Pagination'
import { CategoryPills } from '@/components/CategoryPills'
import PostList from '@/components/PostList'
import SearchInput from '@/components/SearchInput'
import { TagPills } from '@/components/TagPills'
import type { PostMeta } from '@/lib/types'
import { filterByCategory, filterByTags, searchPosts, sortPosts } from '@/lib/post-queries'

type Props = {
  posts: PostMeta[]
  categories: string[]
  tags: string[]
}

export default function BlogIndexClient({ posts, categories, tags }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [page, setPage] = useState(1)
  const perPage = 9

  const filtered = useMemo(() => {
    const bySearch = searchPosts(posts, query)
    const byCategory = filterByCategory(bySearch, category)
    const byTags = filterByTags(byCategory, selectedTags)
    return sortPosts(byTags, sort)
  }, [posts, query, category, selectedTags, sort])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const handleQueryChange = (value: string) => {
    setPage(1)
    setQuery(value)
  }

  const handleCategorySelect = (value?: string) => {
    setPage(1)
    setCategory(value)
  }

  const handleSortChange = (value: 'latest' | 'popular') => {
    setPage(1)
    setSort(value)
  }

  const toggleTag = (tag: string) => {
    setPage(1)
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  return (
    <section className="space-y-6" aria-label="Index blog">
      <div className="flex flex-col gap-3">
        <SearchInput onChange={handleQueryChange} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CategoryPills categories={categories} active={category} onSelect={handleCategorySelect} />
          <label className="ml-auto flex items-center gap-2 text-sm">
            Urutkan:
            <select
              className="rounded border px-2 py-1"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value as 'latest' | 'popular')}
              aria-label="Urutkan"
            >
              <option value="latest">Terbaru</option>
              <option value="popular">Populer (dummy)</option>
            </select>
          </label>
        </div>
        <TagPills tags={tags} active={selectedTags} onToggle={toggleTag} />
      </div>

      {paginated.length > 0 ? (
        <>
          <PostList posts={paginated} />
          <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
        </>
      ) : (
        <p role="status" className="rounded border border-dashed px-4 py-6 text-center text-sm opacity-80">
          Tidak ada hasil. Coba ubah kata kunci atau filter.
        </p>
      )}
    </section>
  )
}
