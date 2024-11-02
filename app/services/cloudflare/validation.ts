import { z } from 'zod';

const turnstileSuccessResponseSchema = z.object({
  success: z.literal(true),
  challenge_ts: z.string().datetime(),
  hostname: z.string(),
  'error-codes': z.string().array(),
  action: z.string(),
  cdata: z.string(),
});

const turnstileFailedResponseSchema = z.object({
  success: z.literal(false),
  'error-codes': z
    .enum([
      'missing-input-secret',
      'invalid-input-secret',
      'missing-input-response',
      'invalid-input-response',
      'bad-request',
      'timeout-or-duplicate',
      'internal-error',
    ])
    .or(z.string())
    .array(),
});

export const turnstileResponseSchema = z.discriminatedUnion('success', [
  turnstileSuccessResponseSchema,
  turnstileFailedResponseSchema,
]);
