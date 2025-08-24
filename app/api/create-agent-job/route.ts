import { NextRequest, NextResponse } from 'next/server';

const LIVEKIT_AGENT_URL = process.env.LIVEKIT_AGENT_URL; // e.g. "https://final-interview-2spnsl9h.livekit.cloud"
const AGENT_ID = process.env.LIVEKIT_AGENT_ID;

export async function POST(req: NextRequest) {
  try {
    const { roomName, interviewId } = await req.json();

    if (!roomName || !interviewId) {
      return NextResponse.json(
        { error: 'Missing roomName or interviewId' },
        { status: 400 }
      );
    }

    if (!LIVEKIT_AGENT_URL || !AGENT_ID) {
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    // Create a job for the agent
    const res = await fetch(`${LIVEKIT_AGENT_URL}/v1/agents/${AGENT_ID}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room: roomName,
        metadata: {
          interviewId,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create job: ${text}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, job: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
