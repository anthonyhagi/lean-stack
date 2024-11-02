import { env } from '../app';
import { CLOUDFLARE_VERIFY_URL } from './constants';
import { turnstileResponseSchema } from './validation';

export async function verifyCloudflareResponse(formResponse: string) {
  const formData = new FormData();

  formData.set('response', formResponse);
  formData.set('secret', env.CLOUDFLARE_TURNSTILE_SECRET_KEY);

  const resp = await fetch(CLOUDFLARE_VERIFY_URL, {
    method: 'POST',
    body: formData,
  });

  const outcome = await resp.json();

  return turnstileResponseSchema.parse(outcome);
}
