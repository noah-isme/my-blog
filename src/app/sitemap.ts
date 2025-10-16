import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000'

  // In a real app, these would come from your CMS/database
  const posts = [
    {
      id: 1,
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      updatedAt: '2024-01-14T14:30:00Z',
    },
    {
      id: 3,
      updatedAt: '2024-01-13T09:15:00Z',
    },
    {
      id: 4,
      updatedAt: '2024-01-12T16:45:00Z',
    }
  ]

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postUrls,
  ]
}