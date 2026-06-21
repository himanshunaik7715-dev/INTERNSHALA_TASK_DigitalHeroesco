import { z } from 'zod';

export const CreateAnalysisSchema = z.object({
  resumeId: z.string(),
  jobDescription: z.string().min(20, 'Job description must be at least 20 characters'),
});