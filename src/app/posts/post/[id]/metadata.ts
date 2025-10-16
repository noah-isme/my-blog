import { Metadata } from "next";
import { getPost } from "@/lib/api-client";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const postId = Number(resolvedParams.id);

  try {
    const post = await getPost(postId);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      };
    }

    return {
      title: `${post.title} | My Blog`,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      keywords: post.tags?.join(', '),
      authors: [{ name: post.author || 'Anonymous' }],
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author || 'Anonymous'],
        tags: post.tags,
        images: [
          {
            url: `https://source.unsplash.com/random/1200x630/?${post.tags?.[0] || 'blog'}`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: [`https://source.unsplash.com/random/1200x630/?${post.tags?.[0] || 'blog'}`],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Post | My Blog",
      description: "Read our latest blog posts and articles.",
    };
  }
}