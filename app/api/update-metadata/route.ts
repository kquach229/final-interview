import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

// Get your LiveKit API key and secret from environment variables
const livekitHost = process.env.LIVEKIT_URL;
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!livekitHost || !apiKey || !apiSecret) {
  throw new Error('LiveKit credentials are not set');
}

const svc = new RoomServiceClient(livekitHost, apiKey, apiSecret);

export async function POST(request: Request) {
  try {
    const { roomName, metadata } = await request.json();

    if (!roomName || !metadata) {
      return NextResponse.json(
        { error: 'Room name and metadata are required' },
        { status: 400 }
      );
    }

    // Corrected line: Convert the metadata object to a JSON string
    const metadataString = JSON.stringify(metadata);

    const updatedRoom = await svc.updateRoomMetadata(roomName, metadataString);

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Failed to update room metadata:', error);
    return NextResponse.json(
      { error: 'Failed to update metadata' },
      { status: 500 }
    );
  }
}
