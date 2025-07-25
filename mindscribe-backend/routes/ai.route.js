const express = require('express');
const { generateSummary, suggestTitle, correctGrammar } = require('../controllers/aiController');
const {aiLimiter} = require('../middlewares/rateLimiter');

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

/**
 * @swagger
 * /api/title-suggestion:
 *   post:
 *     summary: Generate a catchy blog title using AI
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
 *                 description: The blog content to generate a title for
 *     responses:
 *       200:
 *         description: Title generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The generated blog title
 *       400:
 *         description: Blog content is required
 *       500:
 *         description: Failed to generate title
 */


/**
 * @swagger
 * /api/grammar-correct:
 *   post:
 *     summary: Correct grammar and improve content fluency using AI
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
 *                 description: The blog content to correct
 *     responses:
 *       200:
 *         description: Corrected content returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 corrected:
 *                   type: string
 *                   description: The AI-corrected blog content
 *       400:
 *         description: Content is required
 *       500:
 *         description: Failed to correct grammar
 */



router.post('/summary',aiLimiter, generateSummary);
router.post('/title-suggestion',aiLimiter, suggestTitle);
router.post('/grammar-correct',aiLimiter, correctGrammar);

module.exports = router;
