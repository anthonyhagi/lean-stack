import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { logout } from './actions.server';

/**
 * We don't want to allow logging out of users from a GET request
 * as this may be done unsuspectedly of a user. Make sure a POST
 * request is made to log a user out.
 */
export function loader() {
  return redirect('/');
}

/**
 * Handle running the log out steps to ensure a users' session
 * is completely logged out and cannot be accessed again.
 */
export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
