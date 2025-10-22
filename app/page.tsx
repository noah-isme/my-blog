import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'
import { getAllPosts, getFeaturedPosts, getPopularCategories } from '@/lib/content'
import { canonical, siteDescription, siteName } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Beranda',
  description: siteDescription,
  alternates: { canonical: canonical('/') },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: canonical('/'),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
}

export default function HomePage() {
  const posts = getAllPosts()
  const featured = getFeaturedPosts(3)
  const [primary, ...rest] = featured
  const latest = posts.slice(0, 6)
  const popularCategories = getPopularCategories(6)
  return (
    <HomeClient
      posts={posts}
      featured={featured}
      primary={primary}
      rest={rest}
      latest={latest}
      popularCategories={popularCategories}
    />
  )
}
