const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

module.exports.createPost = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject("Image upload failed");
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      coverImage: imageUrl,
      author: req.user._id,
    });

    await newPost.save();
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports.getAllPosts = async (req, res) => {
 try{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const {category,search} = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }
  if(search){
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
 }
  catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
}};

module.exports.getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name email"
  );
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }
  res.status(200).json({
    message: "Post fetched successfully",
    post: post,
  });
};

module.exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    await post.save();
    res.status(200).json({
      message: "Post updated successfully",
      post: post,
    });

  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


module.exports.deletePost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this post",
            });
        }
        await Post.findByIdAndDelete(post._id);
        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}