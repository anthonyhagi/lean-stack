import { render } from '@react-email/components';

import type { ReactElement } from 'react';

import { is } from '~/services/app';

/**
 * Handle rendering the email into HTML and text form to be
 * attached to emails.
 *
 * @param Component the component we want to render.
 *
 * @returns an object with both the html and text as keys.
 */
export async function renderEmail(Component: ReactElement) {
  const html = await render(Component, {
    pretty: !is('production'),
    plainText: false,
  });

  const text = await render(Component, {
    plainText: true,
  });

  return { html, text };
}
