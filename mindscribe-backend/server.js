const dotenv = require('dotenv');
dotenv.config();

require('./config/redisClient');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes.route')
const postRoutes = require('./routes/postRoutes.route')
const commentRoutes = require('./routes/commentRoutes.route');
const userRoutes = require('./routes/user.route');
const aiRoutes = require('./routes/ai.route'); // Import AI routes
const { swaggerUi, swaggerSpec } = require("./config/swagger")
const {generalLimiter} = require('./middlewares/rateLimiter');

 
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter); // Apply the general rate limiter

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/', commentRoutes);
app.use('/api/users', userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/', aiRoutes); // Use AI routes

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});