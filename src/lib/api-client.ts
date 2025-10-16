export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

let posts: Post[] = [
  { id: 1, title: "Post 1", content: "This is the first post.", published: true },
  { id: 2, title: "Post 2", content: "This is the second post.", published: false },
  { id: 3, title: "Post 3", content: "This is the third post.", published: true },
];

export async function getPosts(): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts);
    }, 500);
  });
}

export async function getPost(id: number): Promise<Post | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts.find((post) => post.id === id));
    }, 500);
  });
}

export async function createPost(post: Omit<Post, "id">): Promise<Post> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost = { ...post, id: posts.length + 1 };
      posts = [...posts, newPost];
      resolve(newPost);
    }, 500);
  });
}

export async function updatePost(
  id: number,
  post: Partial<Post>
): Promise<Post | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const postIndex = posts.findIndex((p) => p.id === id);
      if (postIndex !== -1) {
        posts[postIndex] = { ...posts[postIndex], ...post };
        resolve(posts[postIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
}

export async function deletePost(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = posts.filter((post) => post.id !== id);
      resolve();
    }, 500);
  });
}
