// practice questions list

import React from 'react';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

const PracticeQuestionsList = async ({ questions }) => {
  return (
    <ul className='space-y-5 mt-12'>
      {questions.map((question, index) => (
        <li key={question.id}>
          <Link
            href={`/interviews/${question.interviewId}/questions/${question.id}`}>
            <Card className='cursor-pointer hover:bg-muted transition'>
              <CardContent>
                {index + 1}. {question.text}
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PracticeQuestionsList;
