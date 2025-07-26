import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from './ui/sidebar';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import SignupButtonComponent from './SignupButtonComponent';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { checkUser } from '@/lib/checkUser';
import { prisma } from '@/lib/prisma';

const AppSidebar = async ({}) => {
  const user = await currentUser();
  const interviews = await prisma?.interview.findMany({
    where: {
      userId: user?.id,
    },
  });
  await checkUser();

  return (
    <Sidebar className='w-[200px]'>
      <SidebarHeader>
        <Image
          src='/final_interview_logo.svg'
          alt='final interview logo'
          height={400}
          width={400}
        />
      </SidebarHeader>
      <SidebarContent className='flex flex-col justify-between'>
        <div>
          <SidebarGroup>
            <DropdownMenu>
              <DropdownMenuTrigger className='text-left'>
                <Button className='w-full flex justify-between'>
                  <div className='inline-flex items-center gap-2'>
                    <Plus className='text-left' />
                    Create
                  </div>

                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href='/dashboard/prep/role-form'>
                    Create Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroup>

          <SidebarGroup className='space-y-2 mt-12'>
            {interviews.map((item) => (
              <Link
                className='text-left'
                key={item.id}
                href={`/interview/${item.id}`}>
                <Button className={`w-full text-left`}>{item.jobTitle}</Button>
              </Link>
            ))}
          </SidebarGroup>
        </div>

        <SidebarGroup>
          {user ? (
            <div className='flex items-center gap-2'>
              <UserButton />
              <span>{user.firstName}</span>
            </div>
          ) : (
            <SignupButtonComponent />
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
