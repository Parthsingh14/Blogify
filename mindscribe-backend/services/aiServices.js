const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function suggestBlogTitle(content) {
  const prompt = `
You are a blog post title generator.
Based on the content below, generate ONLY ONE short, catchy blog title.
Do not include explanations or extra text.

Blog content:
${content}

Respond with only the title.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) return "Untitled";

    const cleaned = text
      .replace(/[*`"#]/g, "")
      .trim()
      .split("\n")
      .filter(
        (line) =>
          line &&
          !line.toLowerCase().includes("title") &&
          line.length > 5
      );

    return cleaned[0] || "Untitled";

  } catch (error) {
    console.error("❌ Title Generation Error:", error);
    return "Untitled";
  }
}

module.exports = suggestBlogTitle;