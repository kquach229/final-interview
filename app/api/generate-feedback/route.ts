import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!body.questionId)
      return NextResponse.json({ error: 'Missing question id' });

    const prompt = `You are an AI Mock interviewer interviewing a candidate for the position. Please give the candidate feedback to the question: ${question?.text}, given their response: ${question.}`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const question = await prisma.question.findUnique({
      where: {
        id: body.questionId,
      },
    });
  } catch (err) {
    NextResponse.json({
      err,
    });
  }
};
