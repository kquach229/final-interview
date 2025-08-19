'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { RecordVideo } from './VideoSubmission';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Label } from './ui/label';

const formSchema = z.object({
  textResponse: z.string().min(5, {
    message: 'Response must be at least 5 characters',
  }),
});

export default function InputBox({ questionId }) {
  const [submittingSubmission, setSubmittingSubmission] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textResponse: '',
    },
  });

  const handleSubmitTextSubmission = async (formData) => {
    setSubmittingSubmission(true);

    const res = await fetch('/api/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'typed-submission',
        questionId,
        content: formData.textResponse,
      }),
    });

    const { newSubmission } = await res.json();

    if (!newSubmission.id) {
      console.error('Submission failed');
      return;
    }

    await fetch('/api/generate-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submissionId: newSubmission.id,
        questionId,
      }),
    });

    setSubmittingSubmission(false);

    form.reset();
    router.refresh();
  };

  return (
    <div className='w-full xl:max-w-lg rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-zinc-900'>
      <Label>Type Answer</Label>

      <div className='h-full mt-4 min-h-[380px] space-y-4 text-sm text-zinc-700 dark:text-zinc-100 font-mono'>
        <Form {...form}>
          <form
            className='h-full flex-col justify-between'
            onSubmit={form.handleSubmit(handleSubmitTextSubmission)}>
            <FormField
              control={form.control}
              name='textResponse'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className='h-full'
                      rows={154}
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Type your answer here...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full mt-6' disabled={submittingSubmission}>
              {submittingSubmission ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
