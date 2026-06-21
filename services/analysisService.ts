import dbConnect from '@/lib/db';
import Analysis, { IAnalysis } from '@/models/Analysis';
import { getResumeById } from './resumeService';
import { calculateATSScore } from './atsService';
import { generateResumeSuggestions, simulateRecruiter } from './aiService';

export async function createAnalysis(
  userId: string,
  resumeId: string,
  jobDescription: string
): Promise<IAnalysis> {
  await dbConnect();

  const resume = await getResumeById(resumeId, userId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  const atsResult = calculateATSScore(resume, jobDescription);
  const aiSuggestions = await generateResumeSuggestions(resume.originalText, jobDescription);
  const recruiterSim = await simulateRecruiter(resume.originalText, jobDescription);

  const analysis = new Analysis({
    userId,
    resumeId,
    jobDescription,
    atsScores: {
      overallScore: atsResult.overallScore,
      keywordMatch: atsResult.keywordMatch,
      skillsMatch: atsResult.skillsMatch,
      experienceMatch: atsResult.experienceMatch,
      educationMatch: atsResult.educationMatch,
      formattingScore: atsResult.formattingScore,
      readabilityScore: atsResult.readabilityScore,
    },
    missingKeywords: atsResult.missingKeywords,
    skillGaps: atsResult.skillGaps,
    aiSuggestions,
    recruiterSimulation: recruiterSim,
  });

  await analysis.save();
  return analysis;
}

export async function getAnalysisById(id: string, userId: string) {
  await dbConnect();
  const analysis = await Analysis.findOne({ _id: id, userId }).populate('resumeId');
  return analysis;
}

export async function getAnalysesByUser(userId: string) {
  await dbConnect();
  const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 }).populate('resumeId');
  return analyses;
}