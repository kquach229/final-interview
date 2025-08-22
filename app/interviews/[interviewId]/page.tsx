import { prisma } from '@/lib/prisma';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MockInterviewPage from '@/components/MockInterview';
import PracticeQuestionsList from '@/components/PracticeQuestionsList';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon, Trash2Icon } from 'lucide-react';
import { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface InterviewPageProps {
  params: { interviewId: string };
  searchParams: Promise<{ key: string }>;
}
export const metadata: Metadata = {
  title: 'Interview',
};
export default async function InterviewPage({ params }: InterviewPageProps) {
  const user = await currentUser();
  const { interviewId } = await params;

  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
      userId: user?.id,
    },
    include: {
      resume: true,
      questions: true,
    },
  });

  return (
    <div className='max-w-6xl mx-auto p-4 relative'>
      <Link
        href={`/delete-interview/${interviewId}`}
        className='absolute right-0 top-0 text-red-500 cursor-pointer'>
        <Trash2Icon />
      </Link>

      <h1 className='text-4xl font-bold mb-4'>{`${interview?.jobTitle} Interview Questions`}</h1>
      {interview?.resume?.fileName && (
        <div className='text-right text-xs flex items-center gap-x-1'>
          {interview.resume.fileName}
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className='w-3' />
            </TooltipTrigger>
            <TooltipContent className='max-w-40'>
              You provided a resume file for this position on{' '}
              {`${new Date(interview.resume.createdAt).toLocaleDateString()}`}.
              Some questions are tailored based on your provided resume
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <div className='mt-20 mb-20'>
        <Tabs defaultValue='practice-questions'>
          <TabsList className='w-full'>
            <TabsTrigger className='cursor-pointer' value='practice-questions'>
              Practice Questions
            </TabsTrigger>
            <TabsTrigger className='cursor-pointer' value='mock-interview'>
              Mock Interview
            </TabsTrigger>
          </TabsList>
          <TabsContent value='practice-questions'>
            <Suspense fallback={<Skeleton className='h-24 w-full' />}>
              <PracticeQuestionsList questions={interview?.questions} />
            </Suspense>
          </TabsContent>
          <TabsContent value='mock-interview'>
            <MockInterviewPage interviewId={interviewId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
