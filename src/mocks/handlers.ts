import { http, HttpResponse } from 'msw';

// Mock data
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    content: "Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced React Server Components. In this comprehensive guide, we'll explore how to leverage these new capabilities to build modern web applications.",
    published: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    author: "Admin",
    tags: ["Next.js", "React", "Web Development"],
    featured: true,
    views: 1250,
    readTime: 8
  },
  {
    id: 2,
    title: "Modern UI/UX Design Principles",
    content: "Creating beautiful and functional user interfaces requires understanding core design principles. From visual hierarchy to user-centered design, learn how to create interfaces that users love to interact with.",
    published: true,
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    author: "Admin",
    tags: ["UI/UX", "Design", "User Experience"],
    featured: false,
    views: 890,
    readTime: 6
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    content: "Scalability is crucial for modern web applications. Learn about state management, component architecture, and performance optimization techniques that will help your React apps grow gracefully.",
    published: false,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    author: "Admin",
    tags: ["React", "Performance", "Architecture"],
    featured: false,
    views: 0,
    readTime: 12
  },
  {
    id: 4,
    title: "The Future of Web Development",
    content: "Web development is constantly evolving. From WebAssembly to AI integration, explore the technologies that are shaping the future of how we build for the web.",
    published: true,
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    author: "Admin",
    tags: ["Web Development", "Future", "Technology"],
    featured: false,
    views: 2100,
    readTime: 10
  },
  {
    id: 5,
    title: "Mastering TypeScript",
    content: "TypeScript has become essential for modern JavaScript development. Learn advanced patterns, best practices, and how to leverage TypeScript's powerful type system in your projects.",
    published: true,
    createdAt: "2024-01-11T11:20:00Z",
    updatedAt: "2024-01-11T11:20:00Z",
    author: "Admin",
    tags: ["TypeScript", "JavaScript", "Programming"],
    featured: false,
    views: 1650,
    readTime: 15
  },
  {
    id: 6,
    title: "CSS Grid vs Flexbox: When to Use What",
    content: "Both CSS Grid and Flexbox are powerful layout systems. Understanding when to use each one is crucial for creating efficient and maintainable layouts.",
    published: true,
    createdAt: "2024-01-10T13:10:00Z",
    updatedAt: "2024-01-10T13:10:00Z",
    author: "Admin",
    tags: ["CSS", "Layout", "Frontend"],
    featured: false,
    views: 980,
    readTime: 7
  }
];

const posts = [...mockPosts];

// API handlers
export const handlers = [
  // Get all posts
  http.get('/api/posts', () => {
    return HttpResponse.json(posts);
  }),

  // Get single post
  http.get('/api/posts/:id', ({ params }) => {
    const { id } = params;
    const post = posts.find(p => p.id === parseInt(id as string));

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  // Create new post
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json() as {
      title: string;
      content: string;
      published?: boolean;
      tags?: string[];
      featured?: boolean;
    };

    const newPost = {
      id: posts.length + 1,
      title: body.title,
      content: body.content,
      published: body.published || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Admin",
      tags: body.tags || [],
      featured: body.featured || false,
      views: 0,
      readTime: Math.ceil(body.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)
    };
    posts.push(newPost);
    return HttpResponse.json(newPost);
  }),

  // Update post
  http.put('/api/posts/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<typeof mockPosts[0]>;
    const postIndex = posts.findIndex(p => p.id === parseInt(id as string));

    if (postIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json(posts[postIndex]);
  }),

  // Delete post
  http.delete('/api/posts/:id', ({ params }) => {
    const { id } = params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id as string));

    if (postIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    posts.splice(postIndex, 1);
    return HttpResponse.json({ success: true });
  }),

  // Get analytics/stats
  http.get('/api/analytics', () => {
    const publishedPosts = posts.filter(p => p.published);
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const avgViews = Math.round(totalViews / publishedPosts.length);

    return HttpResponse.json({
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: posts.length - publishedPosts.length,
      totalViews,
      avgViews,
      recentViews: 1250,
      growth: 15.3
    });
  }),

  // Get categories/tags
  http.get('/api/tags', () => {
    const allTags = posts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];

    const tagStats = uniqueTags.map(tag => ({
      name: tag,
      count: posts.filter(post => post.tags.includes(tag)).length,
      posts: posts.filter(post => post.tags.includes(tag)).map(p => ({ id: p.id, title: p.title }))
    }));

    return HttpResponse.json(tagStats);
  }),

  // Get media files
  http.get('/api/media', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'hero-image.jpg',
        url: '/api/placeholder/800/400',
        type: 'image',
        size: 2457600,
        uploadedAt: '2024-01-15T10:00:00Z',
        dimensions: { width: 800, height: 400 }
      },
      {
        id: '2',
        name: 'blog-post-1.png',
        url: '/api/placeholder/600/300',
        type: 'image',
        size: 1536000,
        uploadedAt: '2024-01-14T14:30:00Z',
        dimensions: { width: 600, height: 300 }
      },
      {
        id: '3',
        name: 'document.pdf',
        url: '/api/placeholder/document',
        type: 'document',
        size: 512000,
        uploadedAt: '2024-01-13T09:15:00Z'
      }
    ]);
  }),

  // Delete media file
  http.delete('/api/media/:id', () => {
    // In a real app, this would delete the file
    return HttpResponse.json({ success: true });
  }),

  // Get users
  http.get('/api/users', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Admin User",
        email: "admin@blog.com",
        role: "admin",
        status: "active",
        joinedAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-15T10:00:00Z",
        postsCount: 25,
        permissions: ["all"]
      },
      {
        id: 2,
        name: "John Editor",
        email: "john@blog.com",
        role: "editor",
        status: "active",
        joinedAt: "2024-01-05T00:00:00Z",
        lastLogin: "2024-01-14T14:30:00Z",
        postsCount: 12,
        permissions: ["create", "edit", "publish", "delete"]
      }
    ]);
  }),

  // Delete user
  http.delete('/api/users/:id', () => {
    return HttpResponse.json({ success: true });
  }),

  // Get comments for a post
  http.get('/api/posts/:id/comments', () => {
    // Mock comments data
    const comments = [
      {
        id: '1',
        author: 'Sarah Johnson',
        content: 'This is such an insightful article! I especially loved the part about modern UI design principles.',
        createdAt: '2024-01-15T14:30:00Z',
        likes: 12,
        replies: [
          {
            id: '1-1',
            author: 'Admin',
            content: 'Thank you Sarah! I\'m glad you found it helpful.',
            createdAt: '2024-01-15T15:45:00Z',
            likes: 8
          }
        ]
      }
    ];
    return HttpResponse.json(comments);
  }),

  // Create comment
  http.post('/api/posts/:id/comments', async ({ request }) => {
    const body = await request.json() as { content: string; author: string };
    const newComment = {
      id: Date.now().toString(),
      author: body.author,
      content: body.content,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    return HttpResponse.json(newComment);
  }),
];