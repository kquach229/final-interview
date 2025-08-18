'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: '1 Month',
      price: '$15',
      duration: '1 Month Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Real-time feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 1 Month',
      popular: false,
    },
    {
      name: '3 Months',
      price: '$40',
      duration: '3 Months Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Real-time feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 3 Months',
      popular: true,
    },
    {
      name: '6 Months',
      price: '$70',
      duration: '6 Months Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Real-time feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 6 Months',
      popular: false,
    },
  ];

  return (
    <div className='max-w-6xl mx-auto px-6 py-16 space-y-16 text-center'>
      {/* Header */}
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold'>Subscription Plans</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          All plans include the same full-featured AI interview coach. Pick the
          duration that fits your preparation needs.
        </p>
      </div>

      {/* Pricing grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col justify-between ${
              plan.popular ? 'border-primary shadow-lg' : ''
            }`}>
            {plan.popular && (
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white'>
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className='text-2xl font-semibold'>
                {plan.name}
              </CardTitle>
              <div className='text-3xl font-bold'>{plan.price}</div>
              <p className='text-sm text-muted-foreground mt-2'>
                {plan.duration}
              </p>
            </CardHeader>
            <CardContent className='flex flex-col gap-6'>
              <ul className='space-y-3 text-left'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start gap-2'>
                    <Check className='w-5 h-5 text-green-500' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? 'bg-primary' : ''}`}
                size='lg'>
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Closing CTA */}
      <div className='mt-20 space-y-4'>
        <h2 className='text-2xl font-semibold'>Start Practicing Today</h2>
        <p className='text-muted-foreground'>
          Choose a subscription duration that fits your preparation timeline and
          gain full access to our AI interview coach.
        </p>
        <Button size='lg'>Get Started</Button>
      </div>
    </div>
  );
}
