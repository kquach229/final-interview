import { checkUser } from '@/lib/checkUser';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const user = await checkUser();
    const { interviewId } = await params;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!interviewId) {
      return NextResponse.json(
        { error: 'No interview id provided' },
        { status: 400 }
      );
    }

    await prisma.interview.delete({
      where: {
        // composite key assumed (id + userId)
        id: interviewId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
