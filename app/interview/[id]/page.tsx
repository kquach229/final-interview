import { prisma } from '@/lib/prisma';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MockInterviewPage from '@/components/MockInterview';
import PracticeQuestionsList from '@/components/PracticeQuestionsList';

interface InterviewPageProps {
  params: { id: string };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { id } = await params;

  const questions = await prisma.question.findMany({
    where: {
      interviewId: id,
    },
    include: {
      interview: true,
    },
  });

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Preparation</h1>

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
