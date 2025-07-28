import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

export const TypeAnswerBox = () => {
  return (
    <>
      <Textarea placeholder='Type your response here...' />
      <Button>Submit</Button>
      <Button>Generate Answer</Button>
    </>
  );
};

export const InputBox = () => {
  return (
    <div>
      <Tabs defaultValue='account' className='w-[400px]'>
        <TabsList>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export const OutputBox = () => {
  return <div>Output Box</div>;
};
