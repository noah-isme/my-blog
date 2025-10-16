import { Post } from "@/lib/api-client";

interface BlogPostStructuredDataProps {
  post: Post;
  url: string;
}

export function BlogPostStructuredData({ post, url }: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.content.substring(0, 160) + "...",
    "image": `https://source.unsplash.com/random/1200x600/?nature,${post.id}`,
    "author": {
      "@type": "Person",
      "name": post.author || "Anonymous"
    },
    "publisher": {
      "@type": "Organization",
      "name": "My Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "http://localhost:3000/logo.png"
      }
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${post.readTime || 1}M`,
    "articleSection": post.tags?.[0] || "General",
    "keywords": post.tags?.join(", ") || "",
    "url": url
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface WebsiteStructuredDataProps {
  title: string;
  description: string;
  url: string;
}

export function WebsiteStructuredData({ title, description, url }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "My Blog"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}