'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const SidebarInterviewSelection = ({ interviews }) => {
  const pathname = usePathname();

  return (
    <>
      {interviews.map((item) => (
        <Link
          className='text-left'
          key={item.id}
          href={`/interviews/${item.id}`}>
          <Button
            className={`w-full text-left h-12 ${
              pathname.includes(item.id)
                ? 'bg-final-interview-orange'
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
