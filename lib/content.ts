import fs from 'node:fs'
import path from 'node:path'
// Both gray-matter and reading-time are CJS modules, so we can require them directly
// eslint-disable-next-line @typescript-eslint/no-var-requires
const matter = require('gray-matter')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readingTime = require('reading-time')
import type { PostMeta, PostFrontmatter } from './types'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

function readPostFile(filename: string) {
  const fullPath = path.join(POSTS_DIR, filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as PostFrontmatter

  return {
    frontmatter,
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))

  const posts: PostMeta[] = files.map((filename) => {
    const { frontmatter, content } = readPostFile(filename)
    const slug = filename.replace(/\.mdx?$/, '')

    return {
      ...frontmatter,
      slug,
  readingTime: readingTime(content),
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string) {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`)
  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!filePath) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as PostFrontmatter

  const meta: PostMeta = {
    ...frontmatter,
    slug,
  readingTime: readingTime(content),
  }

  return { meta, content }
}

export function getFeaturedPosts(limit = 3) {
  const all = getAllPosts()
  const featured = all.filter((post) => post.featured).slice(0, limit)

  if (featured.length < limit) {
    const filler = all.filter((post) => !post.featured).slice(0, limit - featured.length)
    return [...featured, ...filler]
  }

  return featured
}

export function getPopularCategories(limit = 6) {
  const counts = new Map<string, number>()

  for (const post of getAllPosts()) {
    for (const category of post.categories ?? []) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category)
}

export function getAllCategories() {
  const categories = new Set<string>()

  for (const post of getAllPosts()) {
    for (const category of post.categories ?? []) {
      categories.add(category)
    }
  }

  return [...categories].sort((a, b) => a.localeCompare(b))
}

export function getAllTags() {
  const tags = new Set<string>()

  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      tags.add(tag)
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b))
}

export function getRelatedPosts(current: PostMeta, limit = 3) {
  const others = getAllPosts().filter((post) => post.slug !== current.slug)

  const scored = others.map((post) => {
    const sharedTags = post.tags?.filter((tag) => current.tags?.includes(tag)).length ?? 0
    const sharedCategories = post.categories?.filter((category) => current.categories?.includes(category)).length ?? 0

    return {
      post,
      score: sharedTags * 2 + sharedCategories,
    }
  })

  return scored
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((entry) => entry.post)
}

export { filterByCategory, filterByTags, searchPosts, sortPosts } from './post-queries'
