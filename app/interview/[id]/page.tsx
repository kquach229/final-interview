import { Card, CardContent } from '@/components/ui/card';
import { getInterview } from '@/lib/interviewStore';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MockInterviewPage from '@/components/MockInterview';

interface InterviewPageProps {
  params: { id: string };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const id = await params.id;

  const questions = await prisma.question.findMany({
    where: {
      interviewId: id,
    },
  });

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Preparation</h1>

      <div className='mt-20 mb-20'>
        <Tabs defaultValue='account'>
          <TabsList className='w-full'>
            <TabsTrigger value='practice-questions'>
              Practice Questions
            </TabsTrigger>
            <TabsTrigger value='mock-interview'>Mock Interview</TabsTrigger>
          </TabsList>
          <TabsContent value='practice-questions'>
            <ul className='space-y-5 mt-12'>
              {questions.map((question) => (
                <li key={question.id}>
                  <Card>
                    <CardContent>{question.text}</CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value='mock-interview'>
            <MockInterviewPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
