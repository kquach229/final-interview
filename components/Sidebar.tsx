import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from './ui/sidebar';
import Image from 'next/image';
import { SignedIn } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import SignupButtonComponent from './SignupButtonComponent';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

const AppSidebar = async () => {
  const user = await currentUser();

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
      <SidebarContent className='flex flex-col items-center justify-between'>
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

        <SidebarGroup>
          {user ? (
            <span>{user.emailAddresses[0].emailAddress}</span>
          ) : (
            <SignupButtonComponent />
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
