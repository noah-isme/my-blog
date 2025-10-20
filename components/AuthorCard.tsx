import Image from 'next/image'
import author from '@/content/authors/noah.json'

export default function AuthorCard() {
  return (
    <aside className="mt-10 flex items-center gap-4 rounded-lg border border-black/5 p-4 dark:border-white/10">
      <Image
        src={author.avatar}
        alt={`Avatar ${author.name}`}
        width={56}
        height={56}
        className="rounded-full"
      />
      <div>
        <p className="font-semibold">{author.name}</p>
        <p className="text-sm opacity-80">{author.bio}</p>
        <p className="mt-1 text-sm">
          <a href={author.social.github} className="underline" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          ·{' '}
          <a href={author.social.x} className="underline" target="_blank" rel="noopener noreferrer">
            X
          </a>{' '}
          ·{' '}
          <a href={author.social.linkedin} className="underline" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </aside>
  )
}
