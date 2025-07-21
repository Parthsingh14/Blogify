const rateLimit = require('express-rate-limit');

// General rate limiter – 100 requests per 15 minutes per IP
module.exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});


// 5 attempts per 10 minutes per IP
module.exports.loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


// 5 accounts per 30 minutes
module.exports.registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 mins
  max: 5,
  message: {
    success: false,
    message: "Too many accounts created from this IP. Try again later.",
  },
});


// 10 blog posts per hour
module.exports.createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Post creation rate limit reached. Try again later.",
  },
});


// 20 comments per hour
module.exports.commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: "You're commenting too frequently. Please slow down.",
  },
});


// 10 AI requests per hour
module.exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "AI usage limit reached. Try again in an hour.",
  },
});
