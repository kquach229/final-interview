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
import { prisma } from '@/lib/prisma';
import SidebarInterviewSelection from './SidebarInterviewSelection';
import { substring } from '@/lib/utils';

const AppSidebar = async ({}) => {
  const loggedInUser = await currentUser();

  const interviews = loggedInUser?.id
    ? await prisma.interview.findMany({
        where: { userId: loggedInUser.id },
      })
    : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href='/'>
          <Image
            src='/final_interview_logo.svg'
            alt='final interview logo'
            height={400}
            width={400}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className='flex flex-col justify-between'>
        {loggedInUser && (
          <div>
            <SidebarGroup>
              <DropdownMenu>
                <DropdownMenuTrigger className='text-left'>
                  <Button className='w-full flex justify-between hover:cursor-pointer'>
                    <div className='inline-flex items-center gap-2'>
                      <Plus className='text-left' />
                      Create
                    </div>

                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href='/prep/role-form'>Create Interview Prep</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroup>
            <SidebarGroup className='space-y-2 mt-12'>
              <SidebarInterviewSelection interviews={interviews} />
            </SidebarGroup>{' '}
          </div>
        )}

        <SidebarGroup>
          {loggedInUser ? (
            <div className='flex flex-col items-start justify-center gap-2'>
              <Button className='text-xs' asChild>
                <Link href='/pricing'>Unlock Unlimiited Access</Link>
              </Button>
              <div className='flex items-center gap-1'>
                <UserButton />
                <span className='text-xs'>
                  {substring(loggedInUser?.emailAddresses[0].emailAddress, 19)}
                </span>
              </div>
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
