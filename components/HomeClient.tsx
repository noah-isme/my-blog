"use client"
import { useState } from 'react'
import Carousel from '@/components/Carousel'
import Toast from './Toast'
import RippleButton from '@/components/RippleButton'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FeaturedHero from '@/components/FeaturedHero'
import { getAllPosts, getFeaturedPosts, getPopularCategories } from '@/lib/content'

export default function HomeClient({
  posts,
  featured,
  primary,
  rest,
  latest,
  popularCategories,
}: {
  posts: any[]
  featured: any[]
  primary: any
  rest: any[]
  latest: any[]
  popularCategories: string[]
}) {
  const [showToast, setShowToast] = useState(false)
  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
    e.currentTarget.reset()
  }
  return (
    <section className="space-y-12">
      <motion.header
        aria-label="Hero pribadi"
        className="space-y-4"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm uppercase tracking-wide text-lightAccent dark:text-darkAccent">Halo, saya Noah</p>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl">Membangun web yang manusiawi dan cepat.</h1>
        <p className="max-w-prose text-base leading-8 text-slate-700 dark:text-slate-200">
          Saya menulis tentang frontend, UX, aksesibilitas, dan performa. Semua catatan saya dirancang agar praktis, dapat diulang, dan memprioritaskan pengalaman manusia.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/about" passHref legacyBehavior>
            <RippleButton className="inline-flex items-center rounded-full border border-lightAccent px-4 py-2 text-sm font-medium text-lightAccent bg-transparent transition hover:bg-lightAccent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:border-darkAccent dark:text-darkAccent dark:hover:bg-darkAccent dark:hover:text-slate-900 dark:focus-visible:outline-darkAccent">
              Tentang saya
            </RippleButton>
          </Link>
          <Link href="/contact" passHref legacyBehavior>
            <RippleButton className="inline-flex items-center rounded-full border border-transparent bg-lightAccent px-4 py-2 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:bg-darkAccent dark:text-slate-900 dark:hover:text-slate-950 dark:focus-visible:outline-darkAccent">
              Kolaborasi?
            </RippleButton>
          </Link>
        </div>
      </motion.header>
      {primary ? <FeaturedHero primary={primary} secondary={rest} /> : null}
      <motion.section
        aria-labelledby="latest-heading"
        className="space-y-5"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 id="latest-heading" className="text-2xl font-semibold">Artikel terbaru</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enam artikel terbaru dari Noah.</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-lightAccent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:text-darkAccent dark:focus-visible:outline-darkAccent"
          >
            Lihat semua
          </Link>
        </div>
        <Carousel posts={latest} />
      </motion.section>
      <motion.section
        aria-labelledby="cat-heading"
        className="space-y-4"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        <div>
          <h2 id="cat-heading" className="text-2xl font-semibold">Kategori populer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Topik yang paling sering dibaca.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularCategories.map((category) => (
            <Link
              key={category}
              href={{ pathname: '/blog', query: { category } }}
              className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-lightAccent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-darkAccent dark:focus-visible:outline-darkAccent"
            >
              {category}
            </Link>
          ))}
        </div>
      </motion.section>
      <section aria-labelledby="newsletter-heading" className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
        <div className="space-y-3">
          <h2 id="newsletter-heading" className="text-2xl font-semibold">Dapatkan tulisan terbaru</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Newsletter dummy mingguan. Tidak ada spam, hanya insight praktis.
          </p>
          <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleNewsletter} autoComplete="off">
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="email@contoh.com"
              className="min-w-0 rounded-full border border-black/10 px-4 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:focus-visible:outline-darkAccent"
              autoComplete="email"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-lightAccent px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightAccent dark:bg-darkAccent dark:text-slate-900 dark:focus-visible:outline-darkAccent"
            >
              Berlangganan
            </button>
          </form>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dengan berlangganan, kamu setuju dengan kebijakan privasi kami. Bisa berhenti kapan saja.
          </p>
        </div>
        <Toast message="Terima kasih telah berlangganan!" show={showToast} />
      </section>
    </section>
  )
}
