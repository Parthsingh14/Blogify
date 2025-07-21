const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // or "gemini-1.5-pro" if you want more quality
});

async function suggestBlogTitle(content) {
  const prompt = `
You are a blog post title generator. Based on the content provided below, generate **only one short and catchy blog title**. Do not include any introduction or explanation.

Blog content:
${content}

Respond with only the title.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const lines = text
    .replace(/[*`"#]/g, '')
    .trim()
    .split('\n')
    .filter(line => line && !line.toLowerCase().includes("title") && line.length > 10);

  return lines[0] || "Untitled";
}


module.exports = suggestBlogTitle;
