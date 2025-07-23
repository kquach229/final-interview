'use client';
import React from 'react';
import { SignUp, SignUpButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';

const SignupButtonComponent = () => {
  return (
    <SignUpButton>
      <Button className='w-[200px] mt-12'>Get Started</Button>
    </SignUpButton>
  );
};

export default SignupButtonComponent;
