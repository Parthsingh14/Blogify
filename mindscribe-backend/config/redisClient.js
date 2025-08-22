// redisClient.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL, // use env variable
  socket: {
    tls: true, // Upstash uses rediss:// (TLS/SSL)
    rejectUnauthorized: false
  }
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Upstash Redis");
  } catch (err) {
    console.error("❌ Redis Connection Failed:", err);
  }
})();

module.exports = redisClient;
