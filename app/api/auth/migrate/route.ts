import { NextResponse } from 'next/server';
import { MigrateGuestSchema } from '@/validations/authValidations';
import { verifyGuestJWT, migrateGuestToUser } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = MigrateGuestSchema.parse(body);

    const payload = await verifyGuestJWT(validated.guestToken);
    if (!payload || !payload.guestId) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest token' },
        { status: 401 }
      );
    }

    const user = await migrateGuestToUser(
      payload.guestId as string,
      validated.clerkId,
      validated.email
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Guest user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    );
  }
}