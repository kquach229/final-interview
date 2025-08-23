'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteInterview(formData: FormData) {
  const interviewId = formData.get('interviewId') as string;

  if (!interviewId) return;

  await prisma.interview.delete({
    where: { id: interviewId },
  });

  // Optionally revalidate cache and redirect
  revalidatePath('/');
  redirect('/');
}
