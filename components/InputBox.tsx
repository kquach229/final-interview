'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import VideoSubmission, { RecordVideo } from './VideoSubmission';
import { useRouter } from 'next/navigation';

const CLOUD_NAME = 'your-cloud-name';
const UPLOAD_PRESET = 'your-upload-preset';

export default function InputBox({ questionId }) {
  const [textAnswer, setTextAnswer] = useState('');
  const [submittingSubmission, setSubmittingSubmission] = useState(false);
  const router = useRouter();

  const handleSubmitTextSubmission = async (e) => {
    e.preventDefault();

    setSubmittingSubmission(true);

    const res = await fetch('/api/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'typed-submission',
        questionId,
        content: textAnswer,
      }),
    });

    const { newSubmission } = await res.json();

    if (!newSubmission.id) {
      console.error('Submission failed');
      return;
    }

    await fetch('/api/generate-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submissionId: newSubmission.id,
        questionId,
      }),
    });

    setSubmittingSubmission(false);

    setTextAnswer('');
    router.refresh();
  };

  return (
    <div className='w-full xl:max-w-lg rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-zinc-900'>
      <Tabs defaultValue='typeAnswer' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='typeAnswer'>Type Answer</TabsTrigger>
          <TabsTrigger value='videoRecording'>Video Recording</TabsTrigger>
        </TabsList>

        <div className='h-full mt-4 min-h-[380px] space-y-4 text-sm text-zinc-700 dark:text-zinc-100 font-mono'>
          <TabsContent className='h-full' value='typeAnswer'>
            <form
              className='h-full flex-col justify-between'
              onSubmit={handleSubmitTextSubmission}>
              <Textarea
                rows={24}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder='Type your answer here...'
              />
              <Button className='w-full mt-6' disabled={submittingSubmission}>
                {submittingSubmission ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value='videoRecording'>
            <RecordVideo questionId={questionId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
