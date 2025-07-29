'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Skeleton } from './ui/skeleton';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from './ui/card';
import { substring } from '@/lib/utils';

export const OutputBox = ({
  questionId,
  question,
}: {
  questionId: string;
  question: string;
}) => {
  const [guidelines, setGuidelines] = useState('');
  const [sampleAnswer, setSampleAnswer] = useState('');

  const [loading, setLoading] = useState(false);

  console.log(question, questionId);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/generate-sample-and-guidelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId }),
        });

        const data = await res.json();
        setGuidelines(data.guidelines);
        setSampleAnswer(data.sampleResponse);
      } catch (err) {
        console.error('Failed to load question content');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [questionId]);

  const sortedSubmissions = [...(question?.submissions || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const feedbackSubmissions = sortedSubmissions.filter((s) => s.feedback);

  return (
    <div className='w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-zinc-900'>
      <Tabs defaultValue='question' className='w-full'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='question'>Question</TabsTrigger>
          <TabsTrigger value='guidelines'>Guidelines</TabsTrigger>
          <TabsTrigger value='sample'>Sample</TabsTrigger>
          <TabsTrigger value='submissions'>Submissions</TabsTrigger>
          <TabsTrigger value='feedback'>Feedback</TabsTrigger>
        </TabsList>

        <div className='mt-4 min-h-[160px] space-y-2 text-sm text-zinc-700 dark:text-zinc-100 font-mono whitespace-pre-wrap'>
          <TabsContent value='question'>
            {loading ? <Skeleton className='h-24 w-full' /> : question?.text}
          </TabsContent>

          <TabsContent value='guidelines'>
            {loading ? <Skeleton className='h-24 w-full' /> : guidelines}
          </TabsContent>

          <TabsContent value='sample'>
            {loading ? <Skeleton className='h-24 w-full' /> : sampleAnswer}
          </TabsContent>

          <TabsContent value='submissions'>
            {loading ? (
              <Skeleton className='h-24 w-full' />
            ) : (
              <div className='space-y-5'>
                {sortedSubmissions.map((submission) => (
                  <Card key={submission.id} className='p-5 w-full'>
                    <CardContent className='w-full'>
                      <div className='flex items-center justify-between w-full'>
                        <div className='text-sm text-zinc-600 dark:text-zinc-300'>
                          {substring(submission.text, 50)}
                        </div>
                        <div className='text-xs text-zinc-500'>
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='feedback'>
            {feedbackSubmissions.length === 0 ? (
              <div className='text-sm text-zinc-400 italic'>
                No feedback yet.
              </div>
            ) : (
              feedbackSubmissions.map((submission) => (
                <Card key={submission.id} className='p-4'>
                  <CardContent>
                    <div className='text-xs text-zinc-400 mb-2'>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    <div className='font-semibold mb-1'>Response:</div>
                    <div className='mb-4 whitespace-pre-wrap'>
                      {submission.text}
                    </div>
                    <div className='font-semibold mb-1'>Feedback:</div>
                    <div className='whitespace-pre-wrap'>
                      {submission.feedback}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
