import { slugify } from './slug'

export type TocItem = { id: string; text: string; depth: number }

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const items: TocItem[] = []

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
    if (match) {
      const depth = match[1].length
      const text = match[2].replace(/[*_`]/g, '').trim()
      const baseId = slugify(text)
      items.push({ id: baseId, text, depth })
    }
  }

  const seen = new Map<string, number>()

  return items.map((item) => {
    const count = seen.get(item.id) ?? 0
    const uniqueId = count === 0 ? item.id : `${item.id}-${count}`
    seen.set(item.id, count + 1)
    return { ...item, id: uniqueId }
  })
}
