import { z } from 'zod';

export const RecruiterSimulationResponseSchema = z.object({
  probability: z.number().int().min(0).max(100),
  verdict: z.string(),
});

export type RecruiterSimulationResponse = z.infer<typeof RecruiterSimulationResponseSchema>;
