'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  onChange: (value: string) => void
}

export default function SearchInput({ onChange }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingField = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (event.key === '/' && !isTypingField) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => onChange(value), 200)
    return () => window.clearTimeout(id)
  }, [value, onChange])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari artikel… (tekan /)"
        aria-label="Cari artikel"
        className="w-full rounded border px-3 py-2"
        type="search"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border px-1 text-xs opacity-70">
        /
      </kbd>
    </div>
  )
}
