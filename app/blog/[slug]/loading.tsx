export default function Loading() {
  return (
    <div className="space-y-4 motion-safe:animate-pulse" aria-hidden="true">
      <div className="h-6 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      <div className="h-4 w-1/3 rounded bg-black/10 dark:bg-white/10" />
      <div className="aspect-video rounded bg-black/10 dark:bg-white/10" />
      <div className="h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
      <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
    </div>
  )
}
