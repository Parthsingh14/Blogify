const express = require('express');
const { generateSummary } = require('../controllers/aiController');

const router = express.Router();

/**
 * @swagger
 * /api/summary:
 *   post:
 *     summary: Generate a summary for provided content
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The text content to summarize
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: The generated summary
 *       400:
 *         description: Content is required
 *       500:
 *         description: Internal server error
 */

router.post('/summary', generateSummary);

module.exports = router;