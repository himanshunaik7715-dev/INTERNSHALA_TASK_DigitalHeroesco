import { z } from 'zod';

export const CreateResumeSchema = z.object({
  text: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  uploadThingKey: z.string().optional(),
}).refine((data) => data.text || data.fileUrl, {
  message: "Either text or fileUrl must be provided",
  path: ["text"],
});