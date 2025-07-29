'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Skeleton } from './ui/skeleton';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from './ui/card';

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

  const submissions = question.submissions;

  return (
    <div className='w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-zinc-900'>
      <Tabs defaultValue='question' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='question'>Question</TabsTrigger>
          <TabsTrigger value='guidelines'>Guidelines</TabsTrigger>
          <TabsTrigger value='sample'>Sample</TabsTrigger>
          <TabsTrigger value='submissions'>Submissions</TabsTrigger>
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
                {submissions?.map((submission) => (
                  <Card className='p-5 w-full'>
                    <CardContent className='w-full'>
                      <div className='flex items-center justify-between w-full'>
                        <div>{submission.text}</div>
                        {/* <span>{submission.createdAt}</span> */}
                        <div>
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
