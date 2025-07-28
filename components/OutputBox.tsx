'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { prisma } from '@/lib/prisma';

export const OutputBox = ({
  questionId,
  question,
}: {
  questionId: string;
  question: string;
}) => {
  const [guidelines, setGuidelines] = useState('');
  const [sampleAnswer, setSampleAnswer] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='w-[500px]'>
      <Tabs defaultValue='question'>
        <TabsList>
          <TabsTrigger value='question'>Question</TabsTrigger>
          <TabsTrigger value='guidelines'>Guidelines</TabsTrigger>
          <TabsTrigger value='sample'>Sample</TabsTrigger>
        </TabsList>
        <TabsContent value='question'>{question}</TabsContent>
        <TabsContent value='guidelines'>{guidelines}</TabsContent>
        <TabsContent value='sample'>{sampleAnswer}</TabsContent>
      </Tabs>
    </div>
  );
};
