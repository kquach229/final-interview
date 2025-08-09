import { NextRequest, NextResponse } from 'next/server';
import { AccessToken, Room } from 'livekit-server-sdk';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id: interviewId } = await params;
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');

  if (!room || !username) {
    return NextResponse.json(
      { error: 'Missing "room" or "username"' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
  });

  if (!interview) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  // Corrected: Remove the metadata from the constructor
  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
  });

  const roomSession = new Room();

  roomSession.metadata = await JSON.stringify(
    '68351dfd-1bc6-42c4-882e-ac9e22ae7f65'
  );

  await at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canUpdateOwnMetadata: true,
  });

  at.metadata = JSON.stringify(interviewId);

  return NextResponse.json(
    { token: await at.toJwt() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
