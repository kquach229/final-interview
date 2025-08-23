'use client';

import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function DeleteModal() {
  const [openModal, setOpenModal] = useState(true);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();

  const handleDeleteInterview = async () => {
    const res = await fetch(`/api/remove-interview/${params.interviewId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setOpenModal(false);

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 200); // allow modal transition
    } else {
      const data = await res.json();
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <Modal openModal={openModal} onClose={() => router.back()}>
      <div className='flex flex-col items-center justify-center p-6 text-center'>
        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4'>
          <AlertTriangle className='w-6 h-6 text-red-600' />
        </div>
        <h2 className='text-xl font-semibold mb-2'>Delete Interview?</h2>
        <p className='text-sm text-muted-foreground mb-6 max-w-sm'>
          This action cannot be undone. This will permanently delete this
          interview and remove all related data.
        </p>

        <div className='flex gap-4 w-full'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={() => startTransition(handleDeleteInterview)}
            disabled={isPending}
            className='bg-red-500 hover:bg-red-600 flex-1'>
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
