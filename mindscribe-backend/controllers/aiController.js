const { GoogleGenAI } = require("@google/genai");
const suggestBlogTitle = require("../services/aiServices"); // Adjust the path as necessary
const correctGrammer = require("../services/aiGrammer");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Common AI generator function
async function generateAIResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  console.log("Gemini raw response:", JSON.stringify(response, null, 2));
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim();
}

module.exports.generateSummary = async (req, res) => {
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

    const summary = await generateAIResponse(prompt);

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
    return res.status(200).json({
      title: title || "Could not generate title. Please try again.",
    });
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    return res.status(200).json({
      title: "AI is temporarily unavailable.",
    });
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
    return res.status(200).json({
      corrected: corrected || "Could not correct grammar. Please try again.",
    });
  } catch (error) {
    console.error("❌ Grammar Correction Error:", error);
    return res.status(200).json({
      corrected: "AI is temporarily unavailable.",
    });
  }
};
