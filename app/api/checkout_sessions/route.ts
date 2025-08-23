import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';

interface RequestBody {
  planName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const headersList = headers();
    const origin =
      (await headersList).get('origin') || process.env.NEXT_PUBLIC_APP_URL;

    const body: RequestBody = await req.json();
    const { planName } = body;
    if (!planName) {
      return NextResponse.json({ error: 'No plan selected' }, { status: 400 });
    }

    let priceId;
    if (planName === '1 Month') priceId = 'price_1RyfzhGhCEdRAWImTGVgZkeX';
    else if (planName === '3 Months')
      priceId = 'price_1Ryg0GGhCEdRAWImchS9W3oq';
    else if (planName === '6 Months')
      priceId = 'price_1Ryg0vGhCEdRAWImp1vpoTxB';
    else return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, // ✅ use the mapped priceId
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
