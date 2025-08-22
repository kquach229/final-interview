// components/PricingFAQ.tsx
'use client'; // only needed if you want interactive collapsibles

import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What happens after I purchase?',
    answer:
      'You’ll get immediate access to the full interview prep platform. You can start practicing with mock interviews or generating questions right away.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time from your account settings. You’ll still have access until the end of your billing cycle.',
  },
  {
    question: 'Is there a Money Back Guarantee?',
    answer:
      'Absolutely. If you are not satisfied, contact us within 7 days of starting your subscription for a full refund — no questions asked.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes. All payments are processed through Stripe, which is PCI-compliant and ensures your data is handled securely.',
  },
];

export default function PricingFAQ() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-12'>
      <h2 className='text-2xl font-bold text-center mb-8'>
        Frequently Asked Questions
      </h2>
      <div className='space-y-4'>
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className='rounded-2xl border p-4 shadow-sm'>
                <Disclosure.Button className='flex w-full items-center justify-between text-left'>
                  <span className='font-medium text-gray-900'>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className='mt-2 text-gray-600 text-left'>
                  {faq.answer}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
