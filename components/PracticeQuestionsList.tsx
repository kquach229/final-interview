import React from 'react';
import { Card, CardContent } from './ui/card';

const PracticeQuestionsList = ({ questions }) => {
  return (
    <ul className='space-y-5 mt-12'>
      {questions.map((question) => (
        <li key={question.id}>
          <Card>
            <CardContent>{question.text}</CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export default PracticeQuestionsList;
