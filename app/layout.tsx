import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppSidebar from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SplashCursor from '@/blocks/Animations/SplashCursor/SplashCursor';

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Optional: Accessibility skip link */}
          <a href='#main-content' className='sr-only focus:not-sr-only'>
            Skip to content
          </a>

          <SplashCursor />

          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />

            {/* Proper layout container */}
            <div
              id='main-content'
              className='mx-auto max-w-[1300px] w-full px-5 py-6'>
              {children}
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
