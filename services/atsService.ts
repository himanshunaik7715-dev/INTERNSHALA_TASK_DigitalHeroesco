import { IResume } from '@/models/Resume';

interface ATSScoreResult {
  overallScore: number;
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  formattingScore: number;
  readabilityScore: number;
  missingKeywords: string[];
  skillGaps: string[];
}

export function calculateATSScore(
  resume: IResume,
  jobDescription: string
): ATSScoreResult {
  const resumeText = resume.originalText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const jdWords = jdLower.split(/\s+/);
  const keywords = new Set<string>();
  jdWords.forEach(word => {
    if (word.length > 3) keywords.add(word);
  });

  let keywordHits = 0;
  const missingKeywords: string[] = [];
  keywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      keywordHits++;
    } else {
      missingKeywords.push(keyword);
    }
  });
  const keywordMatchScore = keywords.size ? (keywordHits / keywords.size) * 40 : 0;

  const resumeSkills = resume.parsedData.skills.map(s => s.toLowerCase());
  let skillHits = 0;
  const skillGaps: string[] = [];
  keywords.forEach(keyword => {
    if (resumeSkills.includes(keyword)) {
      skillHits++;
    } else if (!['experience', 'education', 'skills'].includes(keyword)) {
      skillGaps.push(keyword);
    }
  });
  const skillsMatchScore = keywords.size ? (skillHits / keywords.size) * 25 : 0;

  const experienceMatchScore = resume.parsedData.experience.length > 0 ? 15 : 5;
  const educationMatchScore = resume.parsedData.education.length > 0 ? 10 : 3;
  const formattingScore = 5;
  const readabilityScore = 5;

  const overallScore = Math.round(
    keywordMatchScore +
      skillsMatchScore +
      experienceMatchScore +
      educationMatchScore +
      formattingScore +
      readabilityScore
  );

  return {
    overallScore,
    keywordMatch: Math.round(keywordMatchScore),
    skillsMatch: Math.round(skillsMatchScore),
    experienceMatch: experienceMatchScore,
    educationMatch: educationMatchScore,
    formattingScore,
    readabilityScore,
    missingKeywords: missingKeywords.slice(0, 20),
    skillGaps: skillGaps.slice(0, 20),
  };
}