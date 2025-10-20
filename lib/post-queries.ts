import type { PostMeta } from './types'

export function searchPosts(posts: PostMeta[], query: string) {
  const value = query.trim().toLowerCase()

  if (!value) {
    return posts
  }

  return posts.filter((post) => {
    const haystack = [post.title, post.excerpt, ...(post.tags ?? []), ...(post.categories ?? [])]
      .join(' ')
      .toLowerCase()

    return haystack.includes(value)
  })
}

export function filterByCategory(posts: PostMeta[], category?: string) {
  if (!category) {
    return posts
  }

  return posts.filter((post) => post.categories?.includes(category))
}

export function filterByTags(posts: PostMeta[], tags: string[]) {
  if (tags.length === 0) {
    return posts
  }

  return posts.filter((post) => tags.every((tag) => post.tags?.includes(tag)))
}

export function sortPosts(posts: PostMeta[], mode: 'latest' | 'popular' = 'latest') {
  if (mode === 'popular') {
    return [...posts].sort((a, b) => b.readingTime.words - a.readingTime.words)
  }

  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
