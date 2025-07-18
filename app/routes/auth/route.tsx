import { Outlet, redirect } from 'react-router';

import { requireNotLoggedIn } from '~/services/auth';
import type { Route } from './+types/route';

export async function loader({ request }: Route.LoaderArgs) {
  await requireNotLoggedIn(request);

  const url = new URL(request.url);

  // Loading the layout page won't be any good to the user.
  // Let's redirect them to the login page since they'll
  // be able to see and do something there.
  if (['/auth/', '/auth'].includes(url.pathname)) {
    throw redirect('/auth/login');
  }

  return null;
}

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
