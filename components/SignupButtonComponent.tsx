'use client';
import React from 'react';
import { SignUp, SignUpButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';

const SignupButtonComponent = () => {
  return <SignUpButton>Sign Up</SignUpButton>;
};

export default SignupButtonComponent;
