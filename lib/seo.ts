export const siteUrl = 'https://example.com'
export const siteName = 'Noah — Blog'
export const siteDescription = 'Blog pribadi Noah. Teknologi, desain, dan pemikiran.'

export function canonical(path: string = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalized}`
}

export function ogImageUrl(title?: string) {
  const query = title ? `?title=${encodeURIComponent(title)}` : ''
  return `${siteUrl}/api/og${query}`
}
