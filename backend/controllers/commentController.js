const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.createComment = async (req, res) => {
    try{
        const { text } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = new Comment ({
            text,
            author: req.user._id,
            post: postId
        })

        await comment.save();
        res.status(201).json({
            message: 'Comment created successfully',
            comment
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports.getCommentsByPost = async (req, res) => {
    try{
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

            res.json({
                count: comments.length,
                comments
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.deleteComment = async (req, res) => {
    try{
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }       
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
        await comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}