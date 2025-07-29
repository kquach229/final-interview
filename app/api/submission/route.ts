import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { questionId, type, content } = await req.json();

  if (!questionId || !type || !content) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const newSubmission = await prisma.questionSubmission.create({
      data: {
        questionId,
        text: content,
        videoUrl: type === 'video-submission' ? '' : '',
      },
    });

    return NextResponse.json({ newSubmission });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to store video' },
      { status: 500 }
    );
  }
}
