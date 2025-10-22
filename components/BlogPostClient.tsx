"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import AuthorCard from '@/components/AuthorCard'
import Prose from '@/components/Prose'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButtons from '@/components/ShareButtons'
import TableOfContents from '@/components/TableOfContents'

import { slugify } from '@/lib/slug'
import { isValidElement } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

type BlogPostClientProps = {
  meta: any
  content: any
  toc: any[]
  related: any[]
  canonicalUrl: string
}

export default function BlogPostClient({ meta, content, toc, related, canonicalUrl }: BlogPostClientProps) {
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (focusMode) {
      root.classList.add('focus-reading')
    } else {
      root.classList.remove('focus-reading')
    }
    return () => root.classList.remove('focus-reading')
  }, [focusMode])

  // Heading rendering logic moved here
  type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }
  const queue = [...toc]
  const seen = new Map<string, number>()
  const assignId = (text: string) => {
    if (queue.length > 0) {
      return queue.shift()!.id
    }
    const base = slugify(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
  const getNodeText = (node: ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node)
    }
    if (Array.isArray(node)) {
      return node.map((child) => getNodeText(child)).join('')
    }
    if (isValidElement(node)) {
      return node.props?.children ? getNodeText(node.props.children) : ''
    }
    return ''
  }
  const renderHeading = (Tag: 'h2' | 'h3') =>
    function Heading({ children, ...rest }: HeadingProps) {
      const text = getNodeText(children)
      const id = assignId(text)
      return (
        <Tag id={id} {...rest}>
          {children}
        </Tag>
      )
    }
  const headingComponents = {
    h2: renderHeading('h2'),
    h3: renderHeading('h3'),
  }

  return (
    <div className={focusMode ? 'fixed inset-0 z-[100] flex items-center justify-center bg-lightBg dark:bg-darkBg' : ''}>
      <article className={focusMode ? 'max-w-2xl mx-auto p-6 bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-2xl transition-all duration-300' : 'grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]'} aria-label="Artikel">
        <div>
          <header>
            <p className="text-sm opacity-80">
              {new Date(meta.date).toLocaleDateString('id-ID')} • {meta.readingTime.text}
            </p>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight">{meta.title}</h1>
            <div className="mt-3">
              <ShareButtons title={meta.title} />
            </div>
            <div className="relative mt-6 aspect-video">
              <Image
                src={meta.cover}
                alt={`Sampul: ${meta.title}`}
                fill
                className="rounded-lg border border-black/5 object-cover dark:border-white/10"
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority
              />
            </div>
          </header>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="rounded-full border border-lightAccent px-3 py-1 text-xs font-medium text-lightAccent transition hover:bg-lightAccent hover:text-white dark:border-darkAccent dark:text-darkAccent dark:hover:bg-darkAccent dark:hover:text-slate-900"
              onClick={() => setFocusMode((v) => !v)}
            >
              {focusMode ? 'Keluar Mode Baca' : 'Mode Baca Fokus'}
            </button>
          </div>

          <ReadingProgress />
          {/* <div className="mt-8 space-y-6">
            <Prose>
              <MDXRemote
                source={content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                components={headingComponents}
              />
            </Prose>
          </div> */}
          <div className="mt-8 space-y-6">
            <Prose>
              <div style={{color: 'red', fontWeight: 'bold'}}>MDX rendering temporarily disabled for debugging.</div>
            </Prose>
          </div>

          {!focusMode && related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Terkait</h2>
              <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {related.map((post) => (
                  <li key={post.slug} className="rounded border border-black/5 px-4 py-3 dark:border-white/10">
                    <Link className="font-medium hover:underline" href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                    <p className="mt-1 text-sm opacity-80">
                      {new Date(post.date).toLocaleDateString('id-ID')} • {post.readingTime.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!focusMode && <AuthorCard />}
        </div>

        {!focusMode && <aside className="lg:pt-16">{toc.length > 0 && <TableOfContents initial={toc} />}</aside>}
      </article>
    </div>
  )
}
