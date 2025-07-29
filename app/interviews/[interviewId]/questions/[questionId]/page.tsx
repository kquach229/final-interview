import React from 'react';
import { OutputBox } from '@/components/OutputBox';
import { prisma } from '@/lib/prisma';
import InputBox from '@/components/InputBox';

const QuestionPage = async ({ params }: { params: { questionId: string } }) => {
  const { questionId } = await params;
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      submissions: true,
    },
  });
  return (
    <div className='flex flex-col justify-around xl:flex-row   gap-10 mt-10'>
      <OutputBox questionId={params.questionId} question={question} />
      <InputBox questionId={params.questionId} />
    </div>
  );
};

export default QuestionPage;
