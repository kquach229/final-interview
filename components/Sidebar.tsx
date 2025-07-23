import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from './ui/sidebar';
import Image from 'next/image';

const AppSidebar = () => {
  return (
    <div>
      <Sidebar className='w-[200px]'>
        <SidebarHeader>
          <Image
            src='/final_interview_logo.svg'
            alt='final interview logo'
            height={400}
            width={400}
          />
        </SidebarHeader>
        <SidebarContent></SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
