import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { deleteInterview } from '@/lib/actions/deleteUser';

interface DeleteInterviewProps {
  params: {
    interviewId: string;
  };
}

const DeleteInterview = async ({ params }: DeleteInterviewProps) => {
  const { interviewId } = await params;

  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <div className='rounded-2xl bg-white shadow-xl p-10 text-center max-w-md'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Delete Interview
        </h1>
        <p className='text-gray-600 mb-6'>
          Are you sure you want to delete interview for{' '}
          <span className='font-semibold text-gray-800'>
            {interview?.jobTitle}{' '}
            {interview?.companyName && `at ${interview.companyName}`}
          </span>
          ? This action cannot be undone.
        </p>
        <div className='flex gap-4 justify-center'>
          <Link
            href={`/interviews/${interviewId}`}
            className='bg-gray-200 px-5 py-2 rounded-xl hover:bg-gray-300 transition'>
            Cancel
          </Link>
          <form action={deleteInterview} method='post'>
            <input type='hidden' name='interviewId' value={interviewId} />
            <Button
              type='submit'
              className='bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition'>
              Yes, Delete
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteInterview;
