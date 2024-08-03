import { env } from './validation';

/**
 * Run a check for the expected environment that the app is running in
 * versus the current environment the app is running in.
 *
 * @param environment the environment we are looking for.
 *
 * @returns `true` when the current environment matches the
 * expected one; `false` otherwise.
 */
export function is(environment: (typeof env)['APP_ENV']) {
  return environment === env.APP_ENV;
}

/**
 * Get the absolute url for the relative url requested.
 *
 * @param path the relative url of the route starting with a forward
 * slash (e.g. `/some/path`).
 *
 * @example
 * `getAbsoluteUrl('/some/path')` => `http://localhost:5173/some/path`
 *
 * @returns the complete url to access the path specified.
 */
export function getAbsoluteUrl(path: string) {
  return `${env.APP_URL}${path}`;
}
