const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

async function correctGrammar(content) {
  const prompt = `
You are a grammar correction assistant. Your job is to improve grammar, spelling, punctuation, and fluency in the following blog content. 
Return ONLY the corrected version. Do not add explanations.

Content:
${content}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  return text;
}

module.exports = correctGrammar;
