import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../config';

let posts = [
  { id: 1, user_id: 1, title: 'Mock Post 1', body: 'This is the body of the first mock post.', published: true },
  { id: 2, user_id: 1, title: 'Mock Post 2', body: 'This is the body of the second mock post.', published: true },
];
let nextPostId = 3;

export const handlers = [
  // Login
  http.post(`${API_BASE_URL}/v1/auth/login`, async ({ request }) => {
    const { email } = await request.json();
    if (email === 'test@example.com') {
      return HttpResponse.json({ token: 'mock-jwt-token' });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // Get Posts
  http.get(`${API_BASE_URL}/v1/posts`, () => {
    return HttpResponse.json({ data: posts, page: 1, size: 10, total: posts.length });
  }),

  // Get Post by ID
  http.get(`${API_BASE_URL}/v1/posts/:id`, ({ params }) => {
    const post = posts.find(p => p.id === parseInt(params.id));
    if (post) {
      return HttpResponse.json(post);
    }
    return new HttpResponse('Not Found', { status: 404 });
  }),

  // Create Post
  http.post(`${API_BASE_URL}/v1/posts`, async ({ request }) => {
    const { title, body } = await request.json();
    const newPost = { id: nextPostId++, user_id: 1, title, body, published: true };
    posts.push(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  // Update Post
  http.put(`${API_BASE_URL}/v1/posts/:id`, async ({ params, request }) => {
    const { title, body } = await request.json();
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    if (postIndex !== -1) {
      posts[postIndex] = { ...posts[postIndex], title, body };
      return HttpResponse.json(posts[postIndex]);
    }
    return new HttpResponse('Not Found', { status: 404 });
  }),

  // Delete Post
  http.delete(`${API_BASE_URL}/v1/posts/:id`, ({ params }) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse('Not Found', { status: 404 });
  }),
];
