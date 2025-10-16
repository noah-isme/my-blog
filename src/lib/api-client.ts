export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  views?: number;
  readTime?: number;
}

export async function getPosts(): Promise<Post[]> {
  // Small delay to ensure MSW is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function getPost(id: number): Promise<Post | undefined> {
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch post');
  }
  return response.json();
}

export async function createPost(post: Omit<Post, "id">): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

export async function updatePost(
  id: number,
  post: Partial<Post>
): Promise<Post | undefined> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to update post');
  }

  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
}

// Analytics API
export interface Analytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  avgViews: number;
  recentViews: number;
  growth: number;
}

export async function getAnalytics(): Promise<Analytics> {
  // Small delay to ensure MSW is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const response = await fetch('/api/analytics');
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

// Tags API
export interface Tag {
  name: string;
  count: number;
  posts: { id: number; title: string }[];
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags');
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
}
