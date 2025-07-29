import { prisma } from '@/lib/prisma';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MockInterviewPage from '@/components/MockInterview';
import PracticeQuestionsList from '@/components/PracticeQuestionsList';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface InterviewPageProps {
  params: { interviewId: string };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { interviewId } = await params;

  const questions = await prisma.question.findMany({
    where: {
      interviewId: interviewId,
    },
    include: {
      interview: true,
    },
  });

  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
    include: {
      resume: true,
    },
  });

  return (
    <div className='max-w-6xl mx-auto p-4'>
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
            <TabsTrigger value='practice-questions'>
              Practice Questions
            </TabsTrigger>
            <TabsTrigger value='mock-interview'>Mock Interview</TabsTrigger>
          </TabsList>
          <TabsContent value='practice-questions'>
            <PracticeQuestionsList questions={questions} />
          </TabsContent>
          <TabsContent value='mock-interview'>
            <MockInterviewPage
              questions={questions.map((question) => question.text)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
