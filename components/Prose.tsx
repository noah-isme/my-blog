import type { ReactNode } from 'react'

export default function Prose({ children }: { children: ReactNode }) {
  return <div className="prose prose-zinc dark:prose-invert max-w-none">{children}</div>
}
