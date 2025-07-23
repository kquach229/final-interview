import GridDistortion from '@/blocks/Backgrounds/GridDistortion/GridDistortion';
import DistortionComponent from '@/components/DistortionComponent';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { BotIcon, CheckCheckIcon } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: 'Chat to Resume',
      description: 'Create a perfect resume through natural conversation',
      features: [
        'Chat naturally with AI',
        'Perfectly formatted resume',
        'Transform your resume to any job description',
      ],
      link: '',
    },
    {
      title: 'Interview Prep',
      description: 'Practice with AI-generated interview questions',
      features: [
        'Job-specific questions',
        'Generate answers based on your personal work history',
        'Feedback and performance insights',
      ],
      link: 'oks',
    },
  ];

  const industries = [
    'IT/Tech',
    'Sales',
    'Finance',
    'Customer Service',
    'Retail',
    'Crypto',
    'Automotive',
    'Fashion',
    'Hospitality',
    'Entertainment',
    'Food',
    '+Many More',
  ];
  return (
    <div className='w-full text-center mt-10 mb-20'>
      <div className='space-y-5 mt-30 min-h-[350px]'>
        <Badge variant='outline'>
          <BotIcon /> AI-Powered Interview Coach
        </Badge>
        <h3 className='text-5xl font-bold'>
          Crush Your Interview. Get the Job Offer.
        </h3>
        <h5 className='text-primary'>
          Make the job search process 10x easier with our suite of tools
          designed to help you land and ace your interviews.
        </h5>
      </div>

      <div className='mt-30 space-y-5 mx-auto flex flex-col items-center overflow-hidden'>
        <div className='text-3xl font-bold'>
          Your Personalized AI Interview Coach - Ready to Lend a Helping Hand
        </div>

        <DistortionComponent src={'/helping_hand.jpg'} />
        <div className='text-md'>
          Upload your resume and job description, and get a personalized mock
          interview from an AI agent. Receive real-time feedback, scores, and
          prep suggestions.
        </div>
      </div>

      <div className='flex flex-col gap-5 mt-30'>
        <h5 className='text-3xl font-bold'>Our Tools</h5>
        <div className='flex flex-col sm:flex-row justify-center gap-10'>
          {tools &&
            tools.map((tool) => (
              <Card key={tool.title}>
                <CardHeader>
                  <div className='font-semibold'>{tool.title}</div>
                  <CardDescription>
                    <span>{tool.description}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='text-left'>
                    {tool.features.map((feature) => (
                      <li className='inline-flex gap-5'>
                        <CheckCheckIcon className='text-final-interview-orange w-5' />
                        <div>{feature}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <div className='mt-30 space-y-5'>
        <h3 className='text-3xl font-bold'>
          An Agent that Works for You - No Matter Your Job Title
        </h3>
        <h5>
          Regardless of your industry, our interview agent will adapt to your
          needs
        </h5>
        <div className='space-y-2 space-x-2'>
          {industries &&
            industries.map((industry) => (
              <Badge className='w-[130px]' key={industry}>
                {industry}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}
