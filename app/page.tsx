'use client';

import DistortionComponent from '@/components/DistortionComponent';
import SignupButtonComponent from '@/components/SignupButtonComponent';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { SignedOut } from '@clerk/nextjs';
import { BotIcon, CheckCheckIcon } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: 'Personalized Practice Questions',
      description:
        'Generate the perfect set of practice questions aligned with your job search',
      features: [
        'Get a sample resonse',
        'Get guidelines on crafting a well put-together answer',
        'Receive feedback on your answers. We tell you how you can improve and tips to watch out for',
      ],
    },
    {
      title: 'Interview Prep',
      description: 'Practice with AI-generated interview questions',
      features: [
        'Job-specific questions',
        'Generate answers based on your personal work history',
        'Feedback and performance insights',
      ],
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
    '+ Many More',
  ];

  return (
    <div className='w-full text-center mt-16 mb-20 space-y-20'>
      {/* Hero Section */}
      <div className='space-y-6 max-w-3xl mx-auto px-4'>
        <Badge variant='outline' className='gap-2'>
          <BotIcon className='w-4 h-4' /> AI-Powered Interview Coach
        </Badge>
        <h1 className='text-5xl font-extrabold leading-tight'>
          Crush Your Interview. <br /> Get the Job Offer.
        </h1>
        <p className='text-lg text-primary/80'>
          Make the job search process easier with our suite of tools designed to
          help you land and ace your interviews.
        </p>
        <SignedOut>
          <SignupButtonComponent />
        </SignedOut>
      </div>

      {/* Helping Hand Section */}
      <div className='flex flex-col items-center gap-6 max-w-4xl mx-auto px-4'>
        <h2 className='text-3xl font-bold'>
          Your Personalized AI Interview Coach
        </h2>
        <div className='mx-auto w-full object-fill'>
          <DistortionComponent src={'/helping_hand.jpg'} />
        </div>

        <p className='text-base text-muted-foreground max-w-2xl'>
          Upload your resume and job description, and get a personalized mock
          interview from an AI agent. Receive real-time feedback, scores, and
          prep suggestions.
        </p>
      </div>

      {/* Tools Section */}
      <section className='max-w-5xl mx-auto px-4'>
        <h3 className='text-3xl font-bold mb-10'>Our Tools</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          {tools.map((tool) => (
            <div key={tool.title} className='transition-transform'>
              <Card className='shadow-lg hover:shadow-xl transition-shadow h-full'>
                <CardHeader>
                  <div className='text-xl font-semibold'>{tool.title}</div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {tool.features.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-start gap-3 text-sm'>
                        <CheckCheckIcon className='text-final-interview-orange w-5 h-5 shrink-0' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className='max-w-4xl mx-auto px-4 space-y-6'>
        <h3 className='text-3xl font-bold'>Works for Any Role or Industry</h3>
        <p className='text-muted-foreground'>
          Our AI adapts to your background, whether you're switching careers or
          climbing higher in your current field.
        </p>
        <div className='flex flex-wrap gap-3 justify-center'>
          {industries.map((industry) => (
            <Badge
              key={industry}
              className='px-4 py-2 text-sm whitespace-nowrap'>
              {industry}
            </Badge>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className='max-w-5xl mx-auto px-4 space-y-10'>
        <h3 className='text-3xl font-bold text-center'>How It Works</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Card className='p-6 shadow-md'>
            <h4 className='text-xl font-semibold mb-2'>1. Upload</h4>
            <p className='text-muted-foreground'>
              Add your resume and the job description. Our AI analyzes your
              experience and the role.
            </p>
          </Card>
          <Card className='p-6 shadow-md'>
            <h4 className='text-xl font-semibold mb-2'>2. Practice</h4>
            <p className='text-muted-foreground'>
              Get a tailored mock interview with questions designed just for
              you.
            </p>
          </Card>
          <Card className='p-6 shadow-md'>
            <h4 className='text-xl font-semibold mb-2'>3. Improve</h4>
            <p className='text-muted-foreground'>
              Receive instant feedback, scores, and specific tips to refine your
              answers.
            </p>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className='max-w-5xl mx-auto px-4 space-y-6'>
        <h3 className='text-3xl font-bold text-center'>Why Choose Us?</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <Card className='p-6'>
            <h4 className='font-semibold'>Realistic Practice</h4>
            <p className='text-muted-foreground text-sm'>
              Our AI adapts to the exact role you’re applying for, not just
              generic interview questions.
            </p>
          </Card>
          <Card className='p-6'>
            <h4 className='font-semibold'>Actionable Feedback</h4>
            <p className='text-muted-foreground text-sm'>
              We don’t just grade you — we tell you how to improve with
              practical tips.
            </p>
          </Card>
          <Card className='p-6'>
            <h4 className='font-semibold'>Time-Saving</h4>
            <p className='text-muted-foreground text-sm'>
              Prep efficiently with focused, personalized sessions instead of
              hours of guesswork.
            </p>
          </Card>
          <Card className='p-6'>
            <h4 className='font-semibold'>Confidence Boost</h4>
            <p className='text-muted-foreground text-sm'>
              Walk into interviews knowing exactly what to expect and how to
              respond.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className='bg-muted py-16 px-4'>
        <div className='max-w-4xl mx-auto text-center space-y-10'>
          <h3 className='text-3xl font-bold'>What Users Say</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card className='p-6'>
              <p className='italic text-muted-foreground'>
                “This tool gave me the confidence to nail my interview at a top
                tech company. The feedback was spot on.”
              </p>
              <p className='mt-4 font-semibold'>— Alex, Software Engineer</p>
            </Card>
            <Card className='p-6'>
              <p className='italic text-muted-foreground'>
                “Way better than practicing alone. The AI adapted to my industry
                and I felt prepared for anything.”
              </p>
              <p className='mt-4 font-semibold'>— Maria, Marketing Manager</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='max-w-5xl mx-auto px-4 space-y-8'>
        <h3 className='text-3xl font-bold text-center'>
          Frequently Asked Questions
        </h3>
        <div className='space-y-4 text-left'>
          <div>
            <h4 className='font-semibold'>Do I need to create an account?</h4>
            <p className='text-muted-foreground text-sm'>
              Yes, signing up lets you save your progress and access
              personalized feedback anytime.
            </p>
          </div>
          <div>
            <h4 className='font-semibold'>Does it work for all industries?</h4>
            <p className='text-muted-foreground text-sm'>
              Absolutely. From tech and finance to hospitality and retail, our
              AI tailors questions to your role.
            </p>
          </div>
          <div>
            <h4 className='font-semibold'>Can I practice multiple times?</h4>
            <p className='text-muted-foreground text-sm'>
              Yes — you can run as many mock sessions as you’d like and track
              your improvement over time.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <div className='text-center space-y-4'>
        <h3 className='text-3xl font-bold'>
          Ready to Ace Your Next Interview?
        </h3>
        <p className='text-muted-foreground'>
          Get started today and prepare with confidence.
        </p>
        <SignedOut>
          <SignupButtonComponent />
        </SignedOut>
      </div>
    </div>
  );
}
