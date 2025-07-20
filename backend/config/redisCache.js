const redisClient = require("./redisClient"); // adjust if your path differs

// Function to invalidate all post-related keys
const invalidatePostsCache = async () => {
  try {
    const keys = await redisClient.keys("posts:*");
    if (keys.length) {
      await redisClient.del(keys);
      console.log("🧹 Cleared posts cache");
    }
  } catch (err) {
    console.error("❌ Error invalidating post cache:", err.message);
  }
};

module.exports = {
  invalidatePostsCache,
};
