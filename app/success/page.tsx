import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';

export default async function Success({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session_id = searchParams?.session_id;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const {
    status,
    customer_details: { email: customerEmail },
    amount_total,
    currency,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6'>
        <div className='bg-white shadow-lg rounded-2xl p-10 text-center max-w-lg'>
          <div className='mb-6'>
            <svg
              className='mx-auto h-16 w-16 text-green-500'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>

          <h1 className='text-2xl font-bold text-gray-800 mb-3'>
            Payment Successful 🎉
          </h1>
          <p className='text-gray-600 mb-4'>
            Thank you for your purchase! A confirmation email has been sent to{' '}
            <span className='font-medium text-gray-800'>{customerEmail}</span>.
          </p>

          <div className='bg-gray-100 rounded-lg py-3 px-5 mb-6'>
            <p className='text-gray-700 font-medium'>
              Amount Paid:{' '}
              <span className='text-green-600'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(amount_total! / 100)}
              </span>
            </p>
          </div>

          <p className='text-gray-500 text-sm mb-6'>
            If you have any questions, feel free to reach us at{' '}
            <a
              href='mailto:orders@example.com'
              className='text-blue-600 hover:underline'>
              orders@example.com
            </a>
          </p>

          <a
            href='/'
            className='inline-block bg-final-interview-orange text-white font-medium px-6 py-3 rounded-xl shadow hover:bg-final-interview-orange hover:opacity-50 transition'>
            Go Home
          </a>
        </div>
      </main>
    );
  }
}
