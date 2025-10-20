'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (matches: boolean) => {
      setPrefersReducedMotion(matches)
    }

    update(mediaQuery.matches)
    const listener = (event: MediaQueryListEvent) => update(event.matches)
    mediaQuery.addEventListener('change', listener)

    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      const percentage = total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0
      setProgress(percentage)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-16 h-1 bg-transparent">
      <div
        className="h-full bg-lightAccent dark:bg-darkAccent"
        style={{ width: `${progress}%`, transition: prefersReducedMotion ? 'none' : 'width 120ms linear' }}
      />
    </div>
  )
}
