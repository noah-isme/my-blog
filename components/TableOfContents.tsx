'use client'

import { useEffect, useState } from 'react'

export type TocItem = { id: string; text: string; depth: number }

export default function TableOfContents({ initial }: { initial: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null)

  useEffect(() => {
    if (initial.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0% 0% -70% 0%', threshold: [0, 1] }
    )

    initial.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [initial])

  if (initial.length === 0) {
    return null
  }

  return (
    <nav aria-label="Daftar isi" className="sticky top-24 space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">Daftar isi</h2>
      <ul className="space-y-1">
        {initial.map((item) => (
          <li key={item.id} className={item.depth > 2 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className={`text-sm hover:underline ${activeId === item.id ? 'font-semibold' : 'opacity-80'}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
