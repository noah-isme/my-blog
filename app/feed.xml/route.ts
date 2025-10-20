import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/content'
import { siteDescription, siteName, siteUrl } from '@/lib/seo'

export const revalidate = 60

export async function GET() {
  const posts = getAllPosts()
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>
  `
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[${siteName}]]></title>
      <link>${siteUrl}</link>
      <description><![CDATA[${siteDescription}]]></description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  })
}
