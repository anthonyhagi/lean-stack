import { OAuth2Strategy } from 'remix-auth-oauth2';

import { env } from '~/services/app/validation';

import type { ProviderUser } from '../types';

export type GoogleProfile = {
  provider: 'google';
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [{ value: string }];
  photos: [{ value: string }];
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    email: string;
    email_verified: boolean;
    hd: string;
  };
};

const PROFILE_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

async function userProfile(accessToken: string): Promise<GoogleProfile> {
  const response = await fetch(PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const raw: GoogleProfile['_json'] = await response.json();

  const profile: GoogleProfile = {
    provider: 'google',
    id: raw.sub,
    displayName: raw.name,
    name: {
      familyName: raw.family_name,
      givenName: raw.given_name,
    },
    emails: [{ value: raw.email }],
    photos: [{ value: raw.picture }],
    _json: raw,
  };

  return profile;
}

export const googleStrategy = new OAuth2Strategy(
  {
    clientId: env.GOOGLE_CLIENT_ID!,
    clientSecret: env.GOOGLE_CLIENT_SECRET!,
    redirectURI: `${env.APP_URL}/auth/google/callback`,
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: [
      [
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    ],
  },
  async ({ tokens }): Promise<ProviderUser> => {
    const profile = await userProfile(tokens.accessToken());

    return {
      id: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      integration: {
        accessToken: tokens.accessToken(),
        refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : '',
      },
    };
  }
);
