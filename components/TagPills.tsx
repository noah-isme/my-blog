'use client'

type Props = {
  tags: string[]
  active: string[]
  onToggle: (tag: string) => void
}

export function TagPills({ tags, active, onToggle }: Props) {
  return (
    <div role="group" aria-label="Filter tag" className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const selected = active.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            className={`rounded-full border px-3 py-1 text-sm ${selected ? 'bg-lightAccent/10 dark:bg-darkAccent/10' : ''}`}
            aria-pressed={selected}
            onClick={() => onToggle(tag)}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}
