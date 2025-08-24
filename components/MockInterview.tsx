'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, createLocalTracks, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

export default function Page({ interviewId }: { interviewId: string }) {
  const room = `interview-${interviewId}`;
  const name = 'user';

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
        // Fetch a token for the user
        const resp = await fetch(
          `/api/token?room=${room}&username=${name}&interviewId=${interviewId}`
        );
        const data = await resp.json();
        if (!mounted || !data.token) return;

        // Connect to the LiveKit room
        await roomInstance.connect(
          process.env.NEXT_PUBLIC_LIVEKIT_URL!,
          data.token
        );

        // Automatically publish microphone using createLocalTracks
        const [audioTrack] = await createLocalTracks({
          audio: true,
          video: false,
        });
        await roomInstance.localParticipant.publishTrack(audioTrack);
      } catch (e) {
        console.error('Failed to join room', e);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance]);

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
