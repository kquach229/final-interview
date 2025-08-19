import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.questionId) {
      return NextResponse.json(
        { error: 'Missing questionId' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: body.questionId },
      include: {
        interview: {
          include: {
            resume: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (question?.guidelines && question?.sampleResponse) {
      const guidelines = question.guidelines;
      const sampleResponse = question.sampleResponse;

      return NextResponse.json({ guidelines, sampleResponse });
    }

    const prompt = `You are helping someone answer a job interview question.
The question is: ${question.text}

The company they are interviewing at is: ${
      question.interview.companyName || 'N/A'
    }

${
  question.interview.companyDescription
    ? `Here is what the company does: ${question.interview.companyDescription}`
    : ''
}

${question.interview.resume ? `Here is the resume they provided` : ''}



Please provide:
1. Guidelines or tips to help answer this question well.
2. A sample answer to this question.
Avoid using markdown characters like asterisks, underscores, or tildes.`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const fullText = result.text?.replace(/[\*\_\~]/g, '') ?? '';

    // Basic extraction from model's full text
    const splitIndex = fullText.indexOf('2.');
    const guidelines = fullText.slice(0, splitIndex).replace('1.', '').trim();
    const sampleResponse = fullText.slice(splitIndex).replace('2.', '').trim();

    const res = await prisma.question.update({
      where: { id: question.id },
      data: {
        guidelines,
        sampleResponse,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not generate content' },
      { status: 500 }
    );
  }
}
