import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { verifyGuestJWT } from '@/services/authService';
import { createCheckoutSession } from '@/services/stripeService';

async function getUserId(req: NextRequest) {
  const { userId } = await auth();
  if (userId) return userId;
  const token = req.cookies.get('guest_token')?.value;
  if (token) {
    const payload = await verifyGuestJWT(token);
    return payload?.guestId as string;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await createCheckoutSession(userId);
    return NextResponse.json({ success: true, data: { url: session.url } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}