const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts/:postId/comments', authMiddleware, createComment);
router.get('/posts/:postId/comments', getCommentsByPost);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;