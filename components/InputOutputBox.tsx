import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { prisma } from '@/lib/prisma';

export const InputBox = async () => {
  return (
    <div>
      <Tabs defaultValue='account' className='w-[400px]'>
        <TabsList>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export const OutputBox = async ({ questionId }) => {
  await fetch('/generate-sample-and-guidelines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: questionId,
    }),
  });

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  return (
    <div>
      <Tabs defaultValue='question' className='w-[400px]'>
        <TabsList>
          <TabsTrigger value='question'>Question</TabsTrigger>
          <TabsTrigger value='guidelines'>Guidelines</TabsTrigger>
          <TabsTrigger value='sample'>Sample</TabsTrigger>
        </TabsList>

        <div className='border-black'>
          <TabsContent value='question'>
            <div>{question?.text}</div>
          </TabsContent>
          <TabsContent value='guidelines'>
            <div>{question?.guidelines}</div>
          </TabsContent>
          <TabsContent value='sample'>{question?.sampleResponse}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
