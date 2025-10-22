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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getPostBySlug(slug);
  if (!data) {
    return {};
  }
  const { meta } = data;
  const url = canonical(`/blog/${meta.slug}`);
  const coverUrl = new URL(meta.cover, siteUrl).toString();
  const ogImage = ogImageUrl(meta.title);
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
  };
}

import BlogPostClient from '@/components/BlogPostClient'

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const data = getPostBySlug(slug);
  if (!data) {
    notFound();
  }
  const { meta, content } = data;
  const toc = extractToc(content);
  const related = getRelatedPosts(meta, 3);
  const canonicalUrl = canonical(`/blog/${meta.slug}`);
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: canonical('/') },
          { name: 'Blog', item: canonical('/blog') },
          { name: meta.title, item: canonicalUrl },
        ]}
      />
      <BlogPostClient
        meta={meta}
        content={content}
        toc={toc}
        related={related}
        canonicalUrl={canonicalUrl}
      />
    </>
  );
}

