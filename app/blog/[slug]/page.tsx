import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import AuthorCard from '@/components/AuthorCard'
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd'
import Prose from '@/components/Prose'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButtons from '@/components/ShareButtons'
import TableOfContents, { type TocItem } from '@/components/TableOfContents'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/content'
import { slugify } from '@/lib/slug'
import { canonical, ogImageUrl, siteUrl } from '@/lib/seo'
import { extractToc } from '@/lib/toc'
import { isValidElement } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export const revalidate = 60

type Params = { slug: string }

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }

type HeadingComponents = {
  h2: (props: HeadingProps) => JSX.Element
  h3: (props: HeadingProps) => JSX.Element
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const data = getPostBySlug(params.slug)

  if (!data) {
    return {}
  }

  const { meta } = data
  const url = canonical(`/blog/${meta.slug}`)
  const coverUrl = new URL(meta.cover, siteUrl).toString()
  const ogImage = ogImageUrl(meta.title)

  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      url,
      type: 'article',
      publishedTime: meta.date,
      authors: ['Noah'],
      images: [
        { url: coverUrl, alt: meta.title },
        { url: ogImage, alt: meta.title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.excerpt,
      images: [ogImage],
    },
  }
}

export default function BlogPostPage({ params }: { params: Params }) {
  const data = getPostBySlug(params.slug)

  if (!data) {
    notFound()
  }

  const { meta, content } = data
  const toc = extractToc(content)
  const related = getRelatedPosts(meta, 3)
  const headingComponents = createHeadingComponents(toc)
  const canonicalUrl = canonical(`/blog/${meta.slug}`)

  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: canonical('/') },
          { name: 'Blog', item: canonical('/blog') },
          { name: meta.title, item: canonicalUrl },
        ]}
      />

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]" aria-label="Artikel">
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

          <ReadingProgress />
          <div className="mt-8 space-y-6">
            <Prose>
              <MDXRemote
                source={content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                components={headingComponents}
              />
            </Prose>
          </div>

          {related.length > 0 && (
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

          <AuthorCard />
        </div>

        <aside className="lg:pt-16">{toc.length > 0 && <TableOfContents initial={toc} />}</aside>
      </article>
    </>
  )
}

function createHeadingComponents(toc: TocItem[]): HeadingComponents {
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

  return {
    h2: renderHeading('h2'),
    h3: renderHeading('h3'),
  }
}

function getNodeText(node: ReactNode): string {
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
