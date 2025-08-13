"use client";
import React from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const SignupButtonComponent = () => {
  return (
    <Button className="cursor-pointer" asChild>
      <SignUpButton>Sign Up</SignUpButton>
    </Button>
  );
};

export default SignupButtonComponent;
