
'use client'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  tags: string[]
  active: string[]
  onToggle: (tag: string) => void
}

export function TagPills({ tags, active, onToggle }: Props) {
  return (
    <div role="group" aria-label="Filter tag" className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {tags.map((tag) => {
          const selected = active.includes(tag)
          return (
            <motion.button
              key={tag}
              type="button"
              className={`rounded-full border px-3 py-1 text-sm transition-colors duration-200 ${selected ? 'bg-lightAccent/10 dark:bg-darkAccent/10 border-lightAccent dark:border-darkAccent text-lightAccent dark:text-darkAccent' : 'border-black/10 dark:border-white/10'}`}
              aria-pressed={selected}
              onClick={() => onToggle(tag)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              layout
            >
              #{tag}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
