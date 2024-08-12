import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth';

/**
 * We don't want to allow users to make a GET request here since it
 * won't do anything. To authenticate with Google, users will need
 * to click the button on the login or register page to initiate
 * the authentication flow.
 */
export function loader() {
  return redirect('/login');
}

/**
 * This call will redirect the user to the authenticate with google
 * screen and will request them to allow permissions for the app
 * Once they do, we will handle the rest in the callback route
 */
export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('google', request);
}
