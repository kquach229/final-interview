'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import type { Interview } from '@prisma/client';

const SidebarInterviewSelection = ({
  interviews,
}: {
  interviews: Interview[];
}) => {
  const pathname = usePathname();

  return (
    <>
      {interviews.map((item) => (
        <Link
          className='text-left'
          key={item.id}
          href={`/interviews/${item.id}`}>
          <Button
            className={`cursor-pointer w-full text-left h-12 capitalize ${
              pathname.includes(item.id)
                ? 'bg-final-interview-orange font-semibold'
                : 'bg-ring'
            }`}>
            {item.jobTitle}
          </Button>
        </Link>
      ))}
    </>
  );
};

export default SidebarInterviewSelection;
