import type { Metadata } from 'next'
import BlogIndexClient from './BlogIndexClient'
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/content'
import { canonical, siteDescription } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Cari, filter, dan jelajahi artikel terbaru dari Noah.',
  alternates: { canonical: canonical('/blog') },
  openGraph: {
    title: 'Blog',
    description: 'Cari, filter, dan jelajahi artikel terbaru dari Noah.',
    url: canonical('/blog'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: siteDescription,
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight">Blog</h1>
        <p className="mt-2 opacity-80">Cari, filter, dan jelajahi artikel.</p>
      </header>
      <BlogIndexClient posts={posts} categories={categories} tags={tags} />
    </>
  )
}
