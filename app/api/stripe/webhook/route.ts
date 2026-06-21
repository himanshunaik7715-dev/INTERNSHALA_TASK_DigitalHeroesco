import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@/services/stripeService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    await handleStripeWebhook(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Webhook error' },
      { status: 400 }
    );
  }
}