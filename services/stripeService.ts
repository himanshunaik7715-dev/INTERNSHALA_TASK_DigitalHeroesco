import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutSession(userId: string) {
  await dbConnect();
  const user = await User.findOne({
    $or: [{ clerkId: userId }, { guestId: userId }],
  });
  if (!user) throw new Error('User not found');

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_123456789', // Replace with your actual price ID
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
  });

  return session;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  await dbConnect();
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription && typeof session.subscription === 'string') {
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.subscription = 'premium';
          user.stripeSubscriptionId = session.subscription;
          await user.save();
        }
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.subscription = 'free';
        user.stripeSubscriptionId = undefined;
        await user.save();
      }
      break;
    }
  }
  return { received: true };
}