import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!body.questionId || !body.submissionId)
      return NextResponse.json({
        error: 'Missing question id or submission id',
      });

    const question = await prisma.question.findUnique({
      where: {
        id: body.questionId,
      },
      include: {
        submissions: true,
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

    const submission = question.submissions.find(
      (s) => s.id === body.submissionId
    );

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.feedback) {
      return NextResponse.json({ feedback: submission.feedback });
    }

    const prompt = `You are helping a candidate preparing for an interview and are tasked with giving feedback for the response: ${
      submission?.text
    } to the question ${question?.text} for the position: ${
      question?.interview.jobTitle
    }, with the job description: ${question?.interview.jobDescription}. ${
      question?.interview.companyName
        ? `Compoany Name: ${question.interview.companyName}. ${
            question.interview.companyDescription
              ? `Company Description: ${question.interview.companyDescription}`
              : ''
          }`
        : ''
    }. ${
      question?.interview.resume
        ? `Candiate Resume Content: ${question.interview.resume.content}`
        : ''
    }. Don't include markdown headers, the feedback should be in two different parts which are the pros, and the cons.`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
    });

    const addedSubmission = await prisma.questionSubmission.update({
      where: {
        id: body.submissionId,
      },
      data: {
        feedback: result.text,
      },
    });

    return NextResponse.json({ addedSubmission });
  } catch (err) {
    NextResponse.json({
      err,
    });
  }
};
