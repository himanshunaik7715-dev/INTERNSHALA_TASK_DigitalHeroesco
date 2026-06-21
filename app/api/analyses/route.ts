  import { NextRequest, NextResponse } from 'next/server';
  import { CreateAnalysisSchema } from '@/validations/analysisValidations';
  import { auth } from '@clerk/nextjs/server';
  import { verifyGuestJWT } from '@/services/authService';
  import { createAnalysis, getAnalysesByUser } from '@/services/analysisService';

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

      const body = await req.json();
      const validated = CreateAnalysisSchema.parse(body);
      const analysis = await createAnalysis(
        userId,
        validated.resumeId,
        validated.jobDescription
      );

      return NextResponse.json({ success: true, data: analysis });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { success: false, error: error.errors },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to create analysis' },
        { status: 500 }
      );
    }
  }

  export async function GET(req: NextRequest) {
    try {
      const userId = await getUserId(req);
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const analyses = await getAnalysesByUser(userId);
      return NextResponse.json({ success: true, data: analyses });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analyses' },
        { status: 500 }
      );
    }
  }