// Each provider should be specified here in lowercase form. These
// are the providers that we have integrations for within the app
export type ProviderName = 'google';

// This `user` type is a way to format callbacks for social auth
// providers such that we can easily create a profile for them
// internally.
export type ProviderUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  integration: {
    accessToken: string;
    refreshToken: string;
  };
};
