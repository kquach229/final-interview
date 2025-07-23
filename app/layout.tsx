import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppSidebar from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SplashCursor from '@/blocks/Animations/SplashCursor/SplashCursor';

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Final Interview',
  description: 'Your AI Interview Buddy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`w-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SplashCursor />
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className='mx-auto max-w-[1300px] p-5 w-full overflow-hidden'>
              {children}
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
