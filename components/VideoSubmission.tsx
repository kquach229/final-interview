'use client';

import React, { useRef, useState } from 'react';

const CLOUD_NAME = 'your-cloud-name';
const UPLOAD_PRESET = 'your-upload-preset';

export function RecordVideo({ questionId }: { questionId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      videoRef.current!.srcObject = mediaStream;

      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recording.webm', { type: 'video/webm' });

        await uploadVideo(file); // upload as soon as recording stops

        // Cleanup
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Failed to access camera:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadVideo = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      const secureUrl = data.secure_url;

      // Submit videoUrl and questionId to your backend
      await fetch('/api/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          videoUrl: secureUrl,
        }),
      });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className='w-full rounded-md border'
      />
      <div className='flex gap-4'>
        <button
          onClick={recording ? stopRecording : startRecording}
          className='px-4 py-2 bg-blue-500 text-white rounded'>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {isUploading && (
        <p className='text-sm text-gray-500'>Uploading video...</p>
      )}
    </div>
  );
}
