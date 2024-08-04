import { GoogleStrategy } from 'remix-auth-google';
import { env } from '~/services/app';

import type { ProviderUser } from '../types';

export const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID!,
    clientSecret: env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
    prompt: 'select_account',
    includeGrantedScopes: true,
    accessType: 'offline',
  },
  async ({ profile, accessToken, refreshToken }): Promise<ProviderUser> => {
    return {
      id: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      integration: {
        accessToken,
        // Google may or may not give us back a refresh token
        refreshToken: refreshToken ?? '',
      },
    };
  }
);
