'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function MockInterviewPage({ questions }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        setPermissionGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Permission denied or error:', err);
        setPermissionGranted(false);
        setLoading(false);
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Mock Interview</CardTitle>
        </CardHeader>
        <CardContent>
          {!permissionGranted && !loading && (
            <div className='text-red-500 text-center mb-4'>
              Camera and microphone permissions are required.
            </div>
          )}

          {loading ? (
            <div className='grid grid-cols-1 gap-4'>
              <Skeleton className='h-[300px] w-full rounded-xl' />
              <Skeleton className='h-10 w-1/2 rounded' />
            </div>
          ) : (
            <>
              <div className='relative'>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={cn(
                    'rounded-xl w-full h-[300px] object-cover',
                    !permissionGranted && 'opacity-50'
                  )}
                />
              </div>

              <div className='mt-6 text-lg font-medium'>
                {questions[currentQuestionIndex]}
              </div>

              {/* Recorder placeholder – connect with actual recorder */}
              <div className='mt-4 text-sm text-gray-500 italic'>
                (Your answer will be recorded here.)
              </div>

              <div className='mt-6 flex items-center gap-4'>
                <Button disabled={!permissionGranted}>Start Recording</Button>
                <Button variant='outline' onClick={handleNextQuestion}>
                  Next Question
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
