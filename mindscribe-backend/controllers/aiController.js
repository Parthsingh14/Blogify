const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const suggestBlogTitle = require("../services/aiServices"); // Adjust the path as necessary
const correctGrammer = require("../services/aiGrammer");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // or gemini-1.5-pro
});

module.exports.generateSummary = async (req, res) => {
  console.log(req.body);
  console.log("Generating summary...");
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const prompt = `
You are a professional blog summarizer. Summarize the following blog content into **a concise, clear summary** (max 3-4 sentences). 
Do not include any introduction, explanation, or unnecessary words.
    
Blog content:
${content}
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    if (!summary) {
      return res.status(500).json({ error: "Failed to generate summary" });
    }

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.suggestTitle = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Blog content is required" });
  }

  try {
    const title = await suggestBlogTitle(content);
    res.status(200).json({ title });
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate title" });
  }
};

module.exports.correctGrammar = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ error: "Content is required for grammar correction" });
  }

  try {
    const corrected = await correctGrammer(content);
    res.status(200).json({ corrected });
  } catch (error) {
    console.error("❌ Grammar Correction Error:", error);
    res.status(500).json({ error: "Failed to correct grammar" });
  }
};
