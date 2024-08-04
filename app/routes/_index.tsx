import type { MetaFunction } from '@remix-run/node';

import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between dark:bg-zinc-950">
      <header></header>

      <div className="mx-auto max-w-7xl">
        <div className="py-8 text-center">
          <Heading as="h1">Welcome to the lean stack</Heading>

          <Text variant="large" className="mt-2 dark:text-zinc-500">
            Let's get your app up and running
          </Text>
        </div>
      </div>

      <footer></footer>
    </main>
  );
}
