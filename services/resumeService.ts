import dbConnect from '@/lib/db';
import Resume, { IResume } from '@/models/Resume';
import { parseResumeText } from './resumeParserService';

export async function createResume(
  userId: string,
  originalText: string,
  fileUrl?: string,
  fileName?: string,
  uploadThingKey?: string
): Promise<IResume> {
  await dbConnect();
  const parsedData = parseResumeText(originalText);
  const resume = new Resume({
    userId,
    originalText,
    parsedData,
    fileUrl,
    fileName,
    uploadThingKey,
  });
  const savedResume = await resume.save();
  return savedResume;
}

export async function getResumeById(id: string, userId: string) {
  await dbConnect();
  const resume = await Resume.findOne({ _id: id, userId });
  return resume;
}

export async function getResumesByUser(userId: string) {
  await dbConnect();
  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
  return resumes;
}