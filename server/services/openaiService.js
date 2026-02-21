import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAd({ brand, country, productType }) {
  const prompt = `
Generate an advertising banner copy for:

Brand: ${brand}
Country: ${country}
Product type: ${productType}

Return ONLY valid JSON.
No markdown.
No explanation.

Make the CTA different each time.
Avoid repeating previous outputs.

Format:
{
  "title": "max 8 words",
  "description": "max 20 words",
  "cta": "2-4 word strong action phrase"
}
`;

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  let text = response.output_text.trim();

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
}
