export type PostFrontmatter = {
  title: string
  date: string
  excerpt: string
  cover: string
  categories: string[]
  tags: string[]
  author: 'noah'
  featured?: boolean
}

export type PostMeta = PostFrontmatter & {
  slug: string
  readingTime: {
    text: string
    minutes: number
    words: number
  }
}
