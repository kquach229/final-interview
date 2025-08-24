'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track, LocalAudioTrack } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

export default function Page({ interviewId }: { interviewId: string }) {
  const roomName = 'mock-interview-room';
  const username = 'user-' + Math.floor(Math.random() * 10000);

  const [roomInstance] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Fetch a token from your Next.js API
        const resp = await fetch(
          `/api/token?room=${roomName}&username=${username}&interviewId=${interviewId}`
        );
        const data = await resp.json();
        if (!mounted || !data.token) return;

        // Connect to LiveKit room using the token
        await roomInstance.connect(
          process.env.NEXT_PUBLIC_LIVEKIT_URL!,
          data.token
        );

        // Automatically publish mic audio to wake the agent
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioTrack = new LocalAudioTrack(stream.getAudioTracks()[0]);
        await roomInstance.localParticipant.publishTrack(audioTrack);
      } catch (e) {
        console.error('Error connecting to LiveKit:', e);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance, interviewId]);

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme='default' style={{ height: '100dvh' }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
