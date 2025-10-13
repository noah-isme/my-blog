import { API_BASE_URL } from './config';

const login = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || JSON.stringify(data))
  // Simpan token (contoh menggunakan memory/localStorage)
  localStorage.setItem('token', data.token)
  return data.token
}

const getPosts = async (page = 1, size = 10) => {
  const res = await fetch(`${API_BASE_URL}/v1/posts?page=${page}&size=${size}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const getPost = async (id) => {
  const res = await fetch(`${API_BASE_URL}/v1/posts/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const createPost = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const updatePost = async (id, payload) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/v1/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const deletePost = async (id) => {
  const token = localStorage.getItem('token');
  await fetch(`${API_BASE_URL}/v1/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export { login, getPosts, getPost, createPost, updatePost, deletePost };
