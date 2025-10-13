# Integrasi Frontend — Blog API

Dokumentasi ringkas untuk tim frontend agar mudah berintegrasi dengan API `blog-api`.
Semua endpoint berada di host API (default `http://localhost:8080`) dan di-prefix `/v1`.

File ini berisi ringkasan endpoint, bentuk payload dan respons, contoh penggunaan (fetch/axios), flow autentikasi JWT, pagination, dan tips CORS/security.

---

## Base URL & Environment

- Default lokal: `http://localhost:8080`
- Di environment produksi/frontend build, set variable environment (contoh Vite/CRA):
  - `VITE_API_BASE_URL` atau `REACT_APP_API_URL`

Contoh (Vite):
```js
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
```

---

## Auth (Register & Login)

### POST /v1/auth/register
- Request JSON:
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }
```
- Responses:
  - 201 Created: {"id": <number>, "email": "alice@example.com"}
  - 400 Bad Request: invalid payload / missing fields
  - 409 Conflict: email already registered

Contoh fetch:
```js
const register = async (body) => {
  const res = await fetch(`${API}/v1/auth/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
```

### POST /v1/auth/login
- Request JSON:
```json
{ "email": "alice@example.com", "password": "secret123" }
```
- Responses:
  - 200 OK: {"token": "<jwt>"}
  - 401 Unauthorized: invalid credentials

Contoh (menyimpan token):
```js
const login = async (payload) => {
  const res = await fetch(`${API}/v1/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || JSON.stringify(data))
  // Simpan token (contoh menggunakan memory/localStorage)
  localStorage.setItem('token', data.token)
  return data.token
}
```

Catatan keamanan: menyimpan token di localStorage rentan terhadap XSS. Untuk aplikasi production pertimbangkan HttpOnly cookie.

---

## Posts (CRUD)

Semua endpoint posts berada di `/v1/posts`.

Bentuk resource Post (API response):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "My Post",
  "body": "Content",
  "published": true
}
```

### GET /v1/posts?page=1&size=10
- Publik, tidak butuh auth.
- Response 200: {
  data: [Post], page: <number>, size: <number>, total: <number>
}

Contoh (fetch):
```js
const listPosts = async (page=1, size=10) => {
  const res = await fetch(`${API}/v1/posts?page=${page}&size=${size}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json() // {data, page, size, total}
}
```

### GET /v1/posts/:id
- Publik. Response: 200 with Post or 404 if not found.

### POST /v1/posts
- Protected: membutuhkan header `Authorization: Bearer <token>`
- Request JSON:
```json
{ "title": "New Post", "body": "Content", "published": true }
```
- Response 201: created Post object (with id and user_id set)

### PUT /v1/posts/:id
- Protected, hanya owner dapat update. Request JSON sama seperti POST (fields optional).
- Response 200: updated Post. 403 Forbidden jika bukan owner.

### DELETE /v1/posts/:id
- Protected, hanya owner dapat delete. Response 204 No Content on success.

Contoh membuat post (axios):
```js
import axios from 'axios'

const token = localStorage.getItem('token')
const client = axios.create({ baseURL: API })

const createPost = async (payload) => {
  const res = await client.post('/v1/posts', payload, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}
```

---

## Health & Readiness

- `GET /healthz` — basic liveness, returns 200 OK and body `ok`.
- `GET /readyz` — readiness, performs DB ping and returns 200 OK when DB is reachable. Useful for frontend healthchecks in staging.

---

## Error Handling & Status Codes (umum)

- 200 OK — success read operations
- 201 Created — resource created (register, create post)
- 204 No Content — resource deleted
- 400 Bad Request — invalid payload
- 401 Unauthorized — invalid or missing auth
- 403 Forbidden — user tidak punya akses (mis. update/delete non-owner)
- 404 Not Found — resource tidak ditemukan
- 409 Conflict — duplicate (mis. register email duplikat)
- 500 Internal Server Error — server error

Frontend harus memproses kode status dan menampilkan pesan yang sesuai ke pengguna.

---

## CORS & Dev Notes

- Pastikan backend mengizinkan origin aplikasi frontend (jika dijalankan terpisah). Jika Anda menjalankan frontend pada `localhost:3000`, aktifkan CORS untuk origin tersebut atau gunakan proxy saat development.
- Untuk pengembangan cepat dengan Vite/CRA, set `VITE_API_BASE_URL`/`REACT_APP_API_URL` ke `http://localhost:8080`.

---

## Contoh alur singkat (React):

1. Register -> tampilkan form dan panggil `POST /v1/auth/register`.
2. Login -> simpan JWT di localStorage/session dan arahkan ke dashboard.
3. Pembuatan post -> panggil `POST /v1/posts` dengan Bearer token.
4. List posts -> panggil `GET /v1/posts?page=1&size=10` dan render pagination.

---

Jika frontend membutuhkan contoh tambahan (React hooks, context, axios interceptors untuk refresh token, atau contoh TypeScript types), beri tahu saya — saya akan buatkan contoh lengkap yang bisa langsung dipakai dalam project frontend Anda.
