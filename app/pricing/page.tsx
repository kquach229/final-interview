'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { FormEvent, useTransition } from 'react';
import PricingFAQ from '@/components/PricingFaq';

export default function PricingPage() {
  const [pending, startTransition] = useTransition();
  const plans = [
    {
      name: '1 Month',
      price: '$15',
      duration: '1 Month Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 1 Month',
      popular: false,
    },
    {
      name: '3 Months',
      price: '$39',
      duration: '3 Months Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 3 Months',
      popular: true,
    },
    {
      name: '6 Months',
      price: '$69',
      duration: '6 Months Access',
      features: [
        'Unlimited interview questions',
        'AI-generated personalized answers',
        'Feedback and scoring',
        'Resume-to-question integration',
      ],
      cta: 'Choose 6 Months',
      popular: false,
    },
  ];
  const handlePurchaseCta = async (e: FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const planName = formData.get('planName');

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // ✅ redirect to Stripe
      } else {
        alert(data.error || 'Something went wrong');
      }
    });
  };

  return (
    <div className='max-w-6xl mx-auto px-6 py-16 space-y-16 text-center'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold'>Subscription Plans</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          All plans include the same full-featured AI interview coach. Pick the
          duration that fits your preparation needs.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10'>
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
              <form onSubmit={handlePurchaseCta}>
                <input type='hidden' name='planName' value={plan.name} />
                <ul className='space-y-3 text-left mb-5'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-green-500' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={pending}
                  type='submit'
                  role='link'
                  className={`w-full cursor-pointer ${
                    plan.popular ? 'bg-primary' : ''
                  }`}
                  size='lg'>
                  {plan.cta}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
      <PricingFAQ />
    </div>
  );
}
