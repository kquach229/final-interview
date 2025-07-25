'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createWorker } from 'tesseract.js';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  company: z.string().optional(),
  companyDescription: z.string().optional(),
  resume: z
    .custom<File>((file) => file instanceof File, {
      message: 'Resume must be a file',
    })
    .optional(),
});

export default function RoleForm() {
  const router = useRouter();
  const user = useUser();
  const [isLoading, setIsloading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      company: '',
      companyDescription: '',
      resume: undefined,
    },
  });

  const onSubmit = async (data) => {
    setIsloading(true);
    let resumeContent = '';

    if (data.resume) {
      resumeContent = '';
    }

    const response = await fetch('/api/generate-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.user?.id,
        title: data.title,
        description: data.description,
        company: data.company,
        companyDescription: data.companyDescription,
        resumeContent,
      }),
    });

    const result = await response.json();
    router.push(`/interview/${result.id}`);
    router.refresh();
  };

  return (
    <div className='max-w-xl mx-auto p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Tell us about the role</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder='Frontend Engineer' {...field} />
                </FormControl>
                <FormDescription>
                  What position are you applying for?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Paste the job description here...'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include responsibilities, qualifications, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='company'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Google' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='companyDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe the company if you’d like.'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='resume'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume (optional)</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='.pdf,.txt'
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>Upload a PDF or TXT file.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isLoading}>
            {isLoading
              ? 'Generating Your Interview Prep'
              : 'Generate Mock Interview'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
