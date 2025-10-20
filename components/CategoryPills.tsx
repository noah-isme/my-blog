'use client'

type Props = {
  categories: string[]
  active?: string
  onSelect: (category?: string) => void
}

export function CategoryPills({ categories, active, onSelect }: Props) {
  return (
    <div role="toolbar" aria-label="Filter kategori" className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`rounded-full border px-3 py-1 text-sm ${!active ? 'bg-lightAccent/10 dark:bg-darkAccent/10' : ''}`}
        aria-pressed={!active}
        onClick={() => onSelect(undefined)}
      >
        Semua
      </button>
      {categories.map((category) => {
        const selected = active === category
        return (
          <button
            key={category}
            type="button"
            className={`rounded-full border px-3 py-1 text-sm ${selected ? 'bg-lightAccent/10 dark:bg-darkAccent/10' : ''}`}
            aria-pressed={selected}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
