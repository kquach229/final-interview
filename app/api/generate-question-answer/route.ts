// app/api/gemini/generateQuestionAnswer.ts

import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();

    if (!questionId) {
      return NextResponse.json(
        { error: 'Missing questionId' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        interview: { include: { resume: true } },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const prompt = `
You are an expert interview coach. Given the following question, generate:

1. A sample answer tailored to the role and resume (if provided).

Question:
${question.text}

Role:
${question.interview.jobTitle}

${
  question.interview.resume?.content
    ? `Resume:
${question.interview.resume.content}`
    : ''
}
Do not use any markdown markups such as asterisks.`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const content = await result.text;

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        sampleResponse: content,
      },
    });

    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({
      err,
    });
  }
}
