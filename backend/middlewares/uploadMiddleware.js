const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

module.exports = upload.single('coverImage'); // Middleware to handle single file uploads with the field name 'file'