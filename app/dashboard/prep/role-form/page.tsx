'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
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

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: 'job title must be at least 2 characters.',
  }),
  jobDescription: z.string().min(2, {
    message: 'description must be at least 2 characters.',
  }),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  resume: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file instanceof File && file.type === 'application/pdf';
      },
      { message: 'Only PDF files are allowed.' }
    ),
});

const RoleForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      jobDescription: '',
      companyName: '',
      companyDescription: '',
      resume: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className='w-[100%]'>
      <h3 className='text-3xl font-bold text-center mt-10 mb-10'>
        Create Interview Prep
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='jobTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Job Title' {...field} />
                </FormControl>
                <FormDescription>This is the job title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='jobDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Job Description' {...field} />
                </FormControl>
                <FormDescription>This is the job description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='companyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Company Name' {...field} />
                </FormControl>
                <FormDescription>This is the Company Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='companyDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Company Description' {...field} />
                </FormControl>
                <FormDescription>
                  This is the Company Description
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resume'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='application/pdf'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue('resume', file);
                    }}
                    placeholder='Upload Resume'
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>This is the job title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default RoleForm;
