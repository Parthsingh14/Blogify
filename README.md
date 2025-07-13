# Blogify - Advanced Fullstack Blogging Platform

Blogify is a robust fullstack blogging platform featuring user authentication, blog post management, comments, admin controls, and AI-powered utilities.  
This monorepo contains both the backend API (Node.js/Express/MongoDB) and the frontend (Next.js/React).

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Swagger
- **Frontend:** Next.js, React, Tailwind CSS
- **AI Services:** Google Gemini, HuggingFace (Summarization)
- **Other:** Multer (file uploads), bcrypt (password hashing)

---

## Backend API

### Base URL

```
http://localhost:8000/api/
```

---

## Authentication

| Endpoint                | Method | Description                | Auth Required | Body/Params                |
|-------------------------|--------|----------------------------|---------------|----------------------------|
| `/auth/register`        | POST   | Register a new user        | No            | `{ name, email, password, role? }` |
| `/auth/login`           | POST   | Login and get JWT token    | No            | `{ email, password }`      |

---

## Blog Posts

| Endpoint                        | Method | Description                        | Auth Required | Body/Params                |
|----------------------------------|--------|------------------------------------|---------------|----------------------------|
| `/posts`                        | GET    | List all posts (pagination/filter) | No            | `?page`, `?limit`, `?category`, `?search` |
| `/posts`                        | POST   | Create a post                      | Yes           | Form-data: `title`, `content`, `category`, `coverImage` (file) |
| `/posts/:id`                    | GET    | Get a single post by ID            | No            | Path: `id`                 |
| `/posts/:id`                    | PUT    | Update a post (only author)        | Yes           | Path: `id`, Body: `{ title?, content?, category? }` |
| `/posts/:id`                    | DELETE | Delete a post (only author)        | Yes           | Path: `id`                 |

---

## Comments

| Endpoint                                 | Method | Description                        | Auth Required | Body/Params                |
|-------------------------------------------|--------|------------------------------------|---------------|----------------------------|
| `/posts/:postId/comments`                 | GET    | List all comments for a post       | No            | Path: `postId`             |
| `/posts/:postId/comments`                 | POST   | Add a comment to a post            | Yes           | Path: `postId`, Body: `{ text }` |
| `/comments/:commentId`                    | DELETE | Delete a comment (only author)     | Yes           | Path: `commentId`          |

---

## Users (Admin Only)

| Endpoint                        | Method | Description                        | Auth Required | Body/Params                |
|----------------------------------|--------|------------------------------------|---------------|----------------------------|
| `/users`                        | GET    | List all users (admin only)        | Yes (Admin)   |                            |
| `/users/:userId`                | DELETE | Delete a user (admin only)         | Yes (Admin)   | Path: `userId`             |

---

## AI Utilities

| Endpoint                | Method | Description                        | Auth Required | Body/Params                |
|-------------------------|--------|------------------------------------|---------------|----------------------------|
| `/summary`              | POST   | Generate summary for content       | No            | `{ content }`              |
| `/title-suggestion`     | POST   | Generate catchy blog title         | No            | `{ content }`              |

---

## API Documentation (Swagger UI)

Interactive API docs available at:  
[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## Environment Variables

Create a `.env` file in the backend directory and set:

```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_google_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

---

## Setup & Run (Backend)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm run dev
   ```

   Server runs at [http://localhost:8000](http://localhost:8000)

---

## Error Handling

- All endpoints return JSON with `message` or `error` fields.
- Auth-protected routes require JWT in `Authorization: Bearer <token>` header.
- Admin routes require user role to be `admin`.

---

## Usage Examples

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

### Create Post

```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Authorization: Bearer <token>" \
  -F "title=My First Post" \
  -F "content=Hello world!" \
  -F "category=General" \
  -F "coverImage=@/path/to/image.jpg"
```

### AI Title Suggestion

```bash
curl -X POST http://localhost:8000/api/title-suggestion \
  -H "Content-Type: application/json" \
  -d '{"content":"This is my blog post content."}'
```

---

## Frontend (Next.js)

1. Install dependencies:

   ```bash
   cd blogify-frontend
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

- The frontend expects the backend API at `http://localhost:8000/api`.  
  Change `src/lib/api.js` if your backend runs elsewhere.

---

## Features

- User registration and login (JWT-based)
- Create, edit, delete blog posts (with image upload)
- Comment on posts
- Admin user management
- AI-powered blog utilities (title suggestion, summarization)
- Responsive UI with Tailwind CSS

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Google Gemini](https://ai.google.dev/)
- [HuggingFace](https://huggingface.co/)

---

