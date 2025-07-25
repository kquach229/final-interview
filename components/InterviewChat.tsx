interface InterviewChatProps {
  result: string;
}

export default function InterviewChat({ result }: InterviewChatProps) {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Your Mock Interview</h1>
      <div className='whitespace-pre-wrap bg-muted p-4 rounded shadow text-sm'>
        {result}
      </div>
    </div>
  );
}
