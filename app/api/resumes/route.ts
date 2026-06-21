import { NextRequest, NextResponse } from 'next/server';
import { CreateResumeSchema } from '@/validations/resumeValidations';
import { auth } from '@clerk/nextjs/server';
import { verifyGuestJWT } from '@/services/authService';
import { createResume, getResumesByUser } from '@/services/resumeService';
import { extractTextFromPDF, extractTextFromDocx } from '@/services/resumeParserService';

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
    console.log(" Resume creation request payload:", body);

    const validated = CreateResumeSchema.parse(body);

    let text = validated.text || '';

    // If text is not provided but fileUrl is provided, extract text on the server.
    if (!text && validated.fileUrl) {
      console.log(" Fetching file from UploadThing URL:", validated.fileUrl);
      const fileResponse = await fetch(validated.fileUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from URL: ${fileResponse.statusText}`);
      }
      const arrayBuffer = await fileResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (validated.fileName?.endsWith(".pdf") || validated.fileUrl.includes(".pdf")) {
        console.log(" Extracting text from PDF...");
        text = await extractTextFromPDF(buffer);
      } else if (validated.fileName?.endsWith(".docx") || validated.fileUrl.includes(".docx")) {
        console.log(" Extracting text from DOCX...");
        text = await extractTextFromDocx(buffer);
      } else {
        throw new Error("Unsupported file format. Only PDF and DOCX are supported.");
      }
    }

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Could not extract text from file' },
        { status: 400 }
      );
    }

    const resume = await createResume(
      userId,
      text,
      validated.fileUrl,
      validated.fileName,
      validated.uploadThingKey
    );

    const responsePayload = { success: true, data: resume };
    console.log(" Resume API Response (POST):", responsePayload);
    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error(" Resume API POST error:", error);
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: (error as any).errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to create resume';
    return NextResponse.json(
      { success: false, error: message },
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

    const resumes = await getResumesByUser(userId);
    console.log(" Resume fetch result:", resumes);
    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    console.error(" Resume API GET error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}