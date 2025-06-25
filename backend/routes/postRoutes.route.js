const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

// Route to create a new post
router.post('/', authMiddleware, upload, createPost);


// Route to get all posts
router.get('/', getAllPosts);


// Route to get a single post by ID
router.get('/:id', getSinglePost);


// Route to update a post by ID
router.put('/:id', authMiddleware, updatePost);


// Route to delete a post by ID
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;