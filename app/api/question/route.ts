// pages/api/question.ts
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { NextApiRequest, NextApiResponse } from 'next';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string')
    return res.status(400).json({ error: 'Missing id' });

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      interview: {
        include: {
          resume: true,
        },
      },
    },
  });

  if (!question) return res.status(404).json({ error: 'Question not found' });

  const prompt = `You are an interview coach. Give a sample answer, structure tips, and evaluation guidelines for the following interview question:\n\n"${
    question.text
  }"\n\nThe position is: ${
    question.interview.jobTitle
  }. Be sure to not include anything other than the actual content, avoid asterisks. ${
    question.interview.resume
      ? `Tailor the sample response and guidelines to the provided resume: ${question.interview.resume.content}, `
      : ''
  }`;

  const result = await ai.models.generateContent({
    model: 'gemini-1.5-flash-8b',
    contents: prompt,
  });

  const answer = await result.text;

  return res.status(200).json({ question, answer });
}
