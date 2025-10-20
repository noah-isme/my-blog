'use client'

import { useEffect, useState } from 'react'

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [])

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <a
        className="underline"
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Bagikan ke X
      </a>
      <button
        type="button"
        className="underline"
        onClick={() => {
          if (navigator.clipboard && url) {
            void navigator.clipboard.writeText(url)
          }
        }}
      >
        Salin tautan
      </button>
    </div>
  )
}
