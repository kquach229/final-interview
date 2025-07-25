import { getInterview } from '@/lib/interviewStore';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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
      <h1 className='text-2xl font-bold mb-4'>Your Mock Interview</h1>

      <ul>
        {questions.map((question) => (
          <li key={question.id}>{question.text}</li>
        ))}
      </ul>
    </div>
  );
}
