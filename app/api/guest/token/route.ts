import { NextResponse } from 'next/server';
import { createGuestJWT } from '@/services/authService';

export async function POST() {
  try {
    const authData = await createGuestJWT();

    return NextResponse.json({
      success: true,
      data: authData,
    });
  } catch (error: any) {
    console.error('GUEST TOKEN ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
        name: error?.name,
      },
      { status: 500 }
    );
  }
}