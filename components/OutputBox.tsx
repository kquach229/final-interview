'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { substring } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { InfoIcon } from 'lucide-react';

export const OutputBox = ({
  questionId,
  question,
}: {
  questionId: string;
  question: {
    text: string;
    submissions: {
      id: string;
      text: string;
      feedback?: string | null;
      createdAt: string;
    }[];
  };
}) => {
  const [guidelines, setGuidelines] = useState('');
  const [sampleAnswer, setSampleAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('question');

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const submissionId = searchParams.get('submissionId');

  const selectedSubmission = useMemo(() => {
    return question?.submissions?.find((s) => s.id === submissionId);
  }, [question.submissions, submissionId]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  useEffect(() => {
    if (!submissionId && question.submissions.length > 0) {
      const defaultId = question.submissions[0].id;
      const params = new URLSearchParams(searchParams.toString());
      params.set('submissionId', defaultId);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [submissionId, question.submissions, searchParams, router, pathname]);

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

  const handleSubmissionClick = (id: string) => {
    router.push(`${pathname}?${createQueryString('submissionId', id)}`);
    setSelectedTab('feedback');
  };

  return (
    <div className='w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-zinc-900'>
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='w-full'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='question'>Question</TabsTrigger>
          <TabsTrigger value='guidelines'>Guidelines</TabsTrigger>
          <TabsTrigger value='sample'>Sample</TabsTrigger>
          <TabsTrigger value='submissions'>Submissions</TabsTrigger>
          <TabsTrigger value='feedback'>Feedback</TabsTrigger>
        </TabsList>

        <div className='mt-4 min-h-[160px] space-y-2 text-sm text-zinc-700 dark:text-zinc-100 font-mono whitespace-pre-wrap'>
          <TabsContent value='question'>
            {loading ? <Skeleton className='h-24 w-full' /> : question.text}
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
                {question.submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    onClick={() => handleSubmissionClick(submission.id)}
                    className='p-5 w-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800'>
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
            {!selectedSubmission?.feedback ? (
              <div className='text-zinc-400 italic text-sm'>
                No feedback generated yet.
              </div>
            ) : (
              <Card className='p-4'>
                <CardContent>
                  <div className='text-xs text-zinc-400 mb-2 flex flex-row justify-between'>
                    <div>
                      {new Date(
                        selectedSubmission.createdAt
                      ).toLocaleDateString()}
                    </div>
                    {
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className='w-3' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-40'>
                          Feedback is based on the info you provided including
                          desired job title, job description, resume, etc.
                        </TooltipContent>
                      </Tooltip>
                    }
                  </div>
                  <div className='font-semibold mb-1'>Response:</div>
                  <div className='mb-4 whitespace-pre-wrap'>
                    {selectedSubmission.text}
                  </div>
                  <div className='font-semibold mb-1'>Feedback:</div>
                  <div className='whitespace-pre-wrap'>
                    {selectedSubmission.feedback}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
