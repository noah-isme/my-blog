'use client'

import { cn } from '@/lib/utils'

type Props = {
  page: number
  perPage: number
  total: number
  onPage: (page: number) => void
}

export default function Pagination({ page, perPage, total, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const previous = Math.max(1, page - 1)
  const next = Math.min(totalPages, page + 1)

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onPage(previous)}
        disabled={page === 1}
        className="rounded border px-3 py-1 disabled:opacity-50"
        aria-label="Halaman sebelumnya"
      >
        ← Prev
      </button>
      <ul className="flex items-center gap-1" role="list">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <li key={number}>
            <button
              type="button"
              onClick={() => onPage(number)}
              aria-current={number === page ? 'page' : undefined}
              className={cn(
                'rounded border px-3 py-1',
                number === page && 'bg-lightAccent/10 dark:bg-darkAccent/10 font-semibold',
              )}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onPage(next)}
        disabled={page === totalPages}
        className="rounded border px-3 py-1 disabled:opacity-50"
        aria-label="Halaman berikutnya"
      >
        Next →
      </button>
    </nav>
  )
}
