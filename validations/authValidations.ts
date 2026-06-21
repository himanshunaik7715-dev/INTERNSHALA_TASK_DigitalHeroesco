import { z } from 'zod';

export const MigrateGuestSchema = z.object({
  guestToken: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
});