# Blogify - Fullstack Blogging Platform

Blogify is a fullstack blogging platform with user authentication, blog post management, comments, and admin features.  
This monorepo contains both the backend API (Node.js/Express/MongoDB) and the frontend (Next.js/React).

---

## Backend API

### Base URL

```
http://localhost:8000/api/
```

### Authentication

- **POST** `/api/auth/register`  
  Register a new user.  
  Body: `{ name, email, password, role? }`

- **POST** `/api/auth/login`  
  Login and receive JWT token.  
  Body: `{ email, password }`

### Posts

- **GET** `/api/posts`  
  List all posts. Supports `?page`, `?limit`, `?category`, `?search`.

- **POST** `/api/posts`  
  Create a post (auth required).  
  Form-data: `title`, `content`, `category`, `coverImage` (file)

- **GET** `/api/posts/:id`  
  Get a single post by ID.

- **PUT** `/api/posts/:id`  
  Update a post (auth, only author).

- **DELETE** `/api/posts/:id`  
  Delete a post (auth, only author).

### Comments

- **GET** `/api/posts/:postId/comments`  
  List all comments for a post.

- **POST** `/api/posts/:postId/comments`  
  Add a comment (auth required).  
  Body: `{ text }`

- **DELETE** `/api/comments/:commentId`  
  Delete a comment (auth, only author).

### Users (Admin Only)

- **GET** `/api/users`  
  List all users (admin only).

- **DELETE** `/api/users/:userId`  
  Delete a user (admin only).

---

## API Documentation (Swagger UI)

Interactive API docs available at:  
[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## Environment Variables

Set the following in your `.env` file (backend):

```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## Frontend (Next.js)

### Getting Started

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

### Features

- User registration and login (JWT-based)
- Create, edit, delete blog posts (with image upload)
- Comment on posts
- Admin user management (backend API)
- Responsive UI with Tailwind CSS

### Configuration

- The frontend expects the backend API at `http://localhost:8000/api`.  
  Change `src/lib/api.js` if your backend runs elsewhere.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)

---

