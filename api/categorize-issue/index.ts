// api/categorize-issue/index.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: We will set this API key in Vercel's settings, not in the code
const API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { issueText } = request.body;

  if (!issueText) {
    return response.status(400).json({ error: 'Issue text is required' });
  }

  const prompt = `Analyze the following vendor comment about a raw material delivery and categorize it into ONE of these strict categories: "Freshness", "Damaged Goods", "Incorrect Quantity", "Wrong Item", or "Other". Also, provide a one-sentence summary. Return ONLY a JSON object with "category" and "summary" keys. Vendor Comment: "${issueText}"`;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = result.response;
    const jsonString = aiResponse.text().replace(/```json|```/g, "").trim();
    const parsedJson = JSON.parse(jsonString);

    // Send the AI's analysis back to the frontend
    return response.status(200).json(parsedJson);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to process the request with AI' });
  }
}