import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const interviewId = pathname.split('/')[3];

  console.log('ran::::::::!!!!!!!!!!!!!!!!!!!!', interviewId);
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (err) {
    console.error('Error fetching interview:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
