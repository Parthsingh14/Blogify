# Blogify Backend API

This backend provides RESTful APIs for user authentication and blog post management.

## Base URL

```
http://localhost:8000/api/
```

---

## Authentication Routes

### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `role` (string, optional: `'user'` or `'admin'`)
- **Description:** Registers a new user and returns a JWT token.

---

### Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Description:** Authenticates a user and returns a JWT token.

---

## Post Routes

### Create Post

- **URL:** `/api/posts/`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body (form-data):**
  - `title` (string, required)
  - `content` (string, required)
  - `category` (string, required)
  - `coverImage` (file, optional)
- **Description:** Creates a new blog post. Only authenticated users can create posts. Supports image upload.

---

### Get All Posts

- **URL:** `/api/posts/`
- **Method:** `GET`
- **Description:** Retrieves all blog posts, sorted by creation date (newest first).

---

### Get Single Post

- **URL:** `/api/posts/:id`
- **Method:** `GET`
- **Description:** Retrieves a single blog post by its ID.

---

### Update Post

- **URL:** `/api/posts/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  - `title` (string, optional)
  - `content` (string, optional)
  - `category` (string, optional)
- **Description:** Updates a blog post. Only the author can update their post.

---

### Delete Post

- **URL:** `/api/posts/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Deletes a blog post. Only the author can delete their post.

---

## Middleware

- **authMiddleware:** Protects routes, requires a valid JWT token.
- **adminMiddleware:** (Not used in routes above) Restricts access to admin users.
- **uploadMiddleware:** Handles image uploads for posts.

---

## Environment Variables

Set the following in your `.env` file:

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

## Notes

- All protected routes require the `Authorization` header with a valid JWT token.
- Image uploads use Cloudinary.
- User roles supported: `user`, `admin`.

