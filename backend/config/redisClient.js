// redisClient.js
const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect(); // Connect asynchronously
})();

module.exports = redisClient;
