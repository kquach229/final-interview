import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');
  const interviewId = req.nextUrl.searchParams.get('interviewId');

  if (!room)
    return NextResponse.json({ error: 'Missing room' }, { status: 400 });
  if (!username)
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  if (!interviewId)
    return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 });

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;
  const url = process.env.LIVEKIT_URL!; // your LiveKit Cloud URL

  if (!apiKey || !apiSecret || !url) {
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
  });
  if (!interview)
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });

  // Generate token
  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    metadata: JSON.stringify({ interviewId }),
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json(
    {
      token: await at.toJwt(),
      url, // send back the LiveKit Cloud URL for the frontend
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
