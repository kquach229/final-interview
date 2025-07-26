// pages/api/generate-answer.ts
import { GoogleGenAI } from '@google/genai';
import { NextApiRequest, NextApiResponse } from 'next';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { question, jobTitle, resumeContent } = JSON.parse(req.body);

  if (!question || !jobTitle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are an interview coach. Give a sample answer, structure tips, and evaluation guidelines for the following interview question:\n\n"${question}"\n\nThe position is: ${jobTitle}. Be sure to not include anything other than the actual content, avoid asterisks.${
    resumeContent ? ` Tailor the answer to the resume: ${resumeContent}` : ''
  }`;

  const result = await ai.models.generateContent({
    model: 'gemini-1.5-flash-8b',
    contents: prompt,
  });

  const answer = await result.text;

  res.status(200).json({ answer });
}
