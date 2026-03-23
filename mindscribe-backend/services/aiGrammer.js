const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function correctGrammar(content) {
  const prompt = `
You are a grammar correction assistant.
Improve grammar, spelling, punctuation, and fluency in the text below.
Return ONLY the corrected version. Do not add explanations.

Content:
${content}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || content;

  } catch (error) {
    console.error("❌ Grammar Correction Error:", error);
    return content;
  }
}

module.exports = correctGrammar;