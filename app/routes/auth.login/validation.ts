import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof schema>;
