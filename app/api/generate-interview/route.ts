import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = `You are an AI mock interviewer. Based on the job title "${
      body.title
    }" and job description "${body.description}", generate ${
      body.company
        ? `a set of 10 mock interview questions for a role at ${body.company}.`
        : 'a general set of 10 mock interview questions.'
    } ${
      body.companyDescription
        ? `Company overview: ${body.companyDescription}.`
        : ''
    } ${body.resumeContent ? `Candidate resume: ${body.resumeContent}` : ''}`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const text = result.text ?? '';

    // Parse the questions into an array
    const questionsArray = text
      .split('\n')
      .map((q) => q.trim().replace(/^\d+[\).\s]+/, ''))
      .filter((q) => q.length > 0);

    const interviewId = uuidv4();

    // Create Interview and linked Questions
    await prisma.interview.create({
      data: {
        id: interviewId,
        userId: body.userId, // make sure you're passing this from client
        jobTitle: body.title,
        questions: {
          create: questionsArray.map((q) => ({
            text: q,
          })),
        },
      },
    });

    return NextResponse.json({ id: interviewId });
  } catch (err) {
    console.error('[GENAI_ERROR]', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
