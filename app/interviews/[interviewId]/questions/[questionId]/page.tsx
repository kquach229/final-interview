import React from 'react';
import { OutputBox } from '@/components/OutputBox';
import { prisma } from '@/lib/prisma';

const QuestionPage = async ({ params }: { params: { questionId: string } }) => {
  const { questionId } = await params;
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });
  return (
    <div className='flex justify-center gap-10 mt-10'>
      <OutputBox questionId={params.questionId} question={question.text} />
    </div>
  );
};

export default QuestionPage;
