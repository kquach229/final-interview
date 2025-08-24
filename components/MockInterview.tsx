'use client';

import { useEffect, useState } from 'react';
import { createLocalAudioTrack, Room } from 'livekit-client';
import { RoomContext, RoomAudioRenderer } from '@livekit/components-react';

export default function Page({ interviewId }: { interviewId: string }) {
  const roomName = 'interview-' + interviewId;
  const username = 'candidate';

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
        // fetch LiveKit token
        const resp = await fetch(
          `/api/token?room=${roomName}&username=${username}&interviewId=${interviewId}`
        );
        const data = await resp.json();
        if (!mounted || !data.token) return;

        await roomInstance.connect(
          process.env.NEXT_PUBLIC_LIVEKIT_URL!,
          data.token
        );

        // create local audio track and publish
        const audioTrack = await createLocalAudioTrack();
        roomInstance.localParticipant.publishTrack(audioTrack);
      } catch (err) {
        console.error('LiveKit connection error:', err);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance, interviewId, roomName, username]);

  return (
    <RoomContext.Provider value={roomInstance}>
      <div style={{ height: '100dvh' }}>
        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
}
