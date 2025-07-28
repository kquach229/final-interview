import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { uuidv4 } from 'zod';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.questionId) {
      return NextResponse.json(
        {
          error: 'Missing Question ID',
        },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: body.questionId,
      },
      include: {
        interview: true,
      },
    });

    if (!question)
      return NextResponse.json(
        {
          error: 'Not found',
        },
        { status: 404 }
      );

    const prompt = `Based on the provided question:${
      body.question
    }, generate some guidelines that would make the response to the question successful. ${
      question.interview.companyName
        ? `Company name is ${question.interview.companyName}`
        : ''
    }. ${
      question.interview.companyDescription
        ? `Company description is ${question.interview.companyDescription}`
        : ''
    }.`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const guidelines = result.text ?? '';

    await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        guidelines,
      },
    });

    return NextResponse.json({
      guidelines,
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Could not get guidelines',
    });
  }
}
