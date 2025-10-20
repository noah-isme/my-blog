import Image from 'next/image'
import type { Metadata } from 'next'
import author from '@/content/authors/noah.json'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About',
  description: 'Tentang Noah: bio, topik favorit, tech stack, nilai, dan sosial.',
  alternates: { canonical: canonical('/about') },
  openGraph: {
    title: 'About',
    description: 'Tentang Noah: bio, topik favorit, tech stack, nilai, dan sosial.',
    url: canonical('/about'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About',
    description: 'Tentang Noah: bio, topik favorit, tech stack, nilai, dan sosial.',
  },
}

export default function AboutPage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight">Tentang saya</h1>
        <p className="mt-2 opacity-80">Mengenal Noah lebih dekat.</p>
      </header>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image
          src={author.avatar}
          alt={`Avatar ${author.name}`}
          width={112}
          height={112}
          className="rounded-full border"
        />
        <div className="max-w-prose space-y-4">
          <p className="leading-8">{author.bio}</p>

          <div>
            <h2 className="text-lg font-semibold">Topik favorit</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {author.topics.map(topic => (
                <li key={topic} className="rounded-full border px-3 py-1 text-sm">
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Tech stack</h2>
            <p className="mt-1 opacity-80">
              Next.js, TypeScript, Tailwind, MDX, testing ringan, dan fokus aksesibilitas.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Nilai & prinsip</h2>
            <ul className="mt-1 list-disc pl-6 opacity-90">
              <li>Accessible by default</li>
              <li>Performa sebagai fitur</li>
              <li>Konten jernih, desain tenang</li>
            </ul>
          </div>

          <p className="pt-2">
            <a className="underline" href={author.social.github}>
              GitHub
            </a>{' '}
            ·{' '}
            <a className="underline" href={author.social.x}>
              X
            </a>{' '}
            ·{' '}
            <a className="underline" href={author.social.linkedin}>
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
