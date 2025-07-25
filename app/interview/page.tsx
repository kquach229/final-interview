import InterviewChat from '@/components/InterviewChat';

interface InterviewPageProps {
  searchParams: {
    result?: string;
  };
}

export default function InterviewPage({ searchParams }: InterviewPageProps) {
  const result = searchParams.result || '';

  return (
    <main className='max-w-3xl mx-auto px-4 py-6'>
      <InterviewChat result={result} />
    </main>
  );
}
